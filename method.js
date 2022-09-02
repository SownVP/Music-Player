const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const audio = $('.music_nowPlaying_audio');
const cdRotate =  
    $('.music_nowPlaying_thumbnail').animate(
        [
            { transform: 'translateY(50%) rotate(360deg)' }
        ],
        {
            duration: 50000,
            iterations: Infinity
        }
    )
cdRotate.pause();
const loadingRotate = 
        $('.loading_icon').animate(
            [
                { transform: 'translateY(50%) rotate(-360deg)' },
                { transform: 'translateY(50%) rotate(360deg)' }
            ],
            {
                duration: 3000,
                iterations: Infinity
            }
        )
let setProgress_interval;
import {songs} from "./main.js";
const setInfor = {
    all(songs){
      setInfor.playlist(songs);
      setInfor.songIsPlaying(songs.filter(song => song.isActive === true)[0]);
    },
    playlist(songs){
      $('.playlist').innerHTML = songs.map((song) => {
        return `
          <li class="song" id="${song.id}">
            <div class="song_thumbnail_wrapper">
                <img class="song_thumbnail" src="${song.thumbnail}" alt="">               
                <div class="song_playBtn flex__center">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <div class="song_info">
                <p class="song_name">${song.name}</p>
                <span class="song_info_basic">
                    <p class="song_artist">${song.artist}</p>
                    <i class="fa-solid fa-circle dot"></i>
                    <p class="song_duration">${song.duration}</p>
                </span>
            </div>
          </li>
        `
      }).join('');
    },
    songIsPlaying(songIsPlaying){
        audio.setAttribute('src', songIsPlaying.audio);
        audio.setAttribute('id', songIsPlaying.id);
        $('.music_nowPlaying_name').innerText = songIsPlaying.name;
        $('.music_nowPlaying_artist').innerText = songIsPlaying.artist;
        $('.music_nowPlaying_coverImage').setAttribute('src', songIsPlaying.coverImage);
        $('.music_nowPlaying_thumbnail').setAttribute('src', songIsPlaying.thumbnail); 
        $('.music_nowPlaying_duration').innerText = songIsPlaying.duration;
    }
  }
const setProgress = {
    run(){
        let minute = Math.floor(audio.currentTime.toFixed() / 60);
        let second = audio.currentTime.toFixed() - 60 * minute;
        let progressValue = (audio.currentTime / audio.duration * 100);
        if (isNaN(progressValue)){
            progressValue = 0;
        }
        this.setProgressBar(progressValue);
        this.setProgressTime(second, minute);
        setProgress_interval = setInterval(()=>{
            if(`${minute}:${second}` == $('.music_nowPlaying_duration').innerText){
                this.stop();
                if(audio.loop === false){
                    cdRotate.pause();
                    changeSong(Number(audio.getAttribute('id')));
                }else{
                    audioControl.play();
                }
                return;
            }
            ++second;
            if(second >= 60){
                ++minute;
                second = 0;
            }
            this.setProgressTime(second, minute);
            progressValue = (audio.currentTime / audio.duration * 100);
            this.setProgressBar(progressValue);
        }, 1000)
    },
    stop(){
      clearInterval(setProgress_interval)
    },
    setProgressTime(second, minute){
        if(second < 10){
            second = '0' + second;
        }
        $('.progressTime_minute').innerText = minute;
        $('.progressTime_second').innerText = second;
    },
    setProgressBar(progressValue){
        $('.music_control_progress').value = progressValue;
    }
  }
const audioControl = {
    play(){
      audio.play();
      $('.music_control-pauseIcon').style.display = 'block';
      $('.music_control-playIcon').style.display = 'none';
      setProgress.run();
      cdRotate.play();
    },
    pause(){
      audio.pause();
      $('.music_control-pauseIcon').style.display = 'none';
      $('.music_control-playIcon').style.display = 'block';
      $('.music_nowPlaying_thumbnail').style.animation = ''
      setProgress.stop();
      cdRotate.pause();
    }
  }
  function changeSong(i){
    if(i >= songs.length){
        i = 0;
    }
    setProgress.stop();
    setInfor.songIsPlaying(songs[i])
    audioControl.play();
  }
export {setInfor, audioControl, setProgress, changeSong};