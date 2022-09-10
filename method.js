const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const audio = $('.music_nowPlaying_audio');
const songApi = 'https://api-cho-sowndev.vercel.app/api/v1/audio';
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
let toast_iconCloses = $$('.toast_icon-close');
let toastList = $$('.toast_item');
let songIsActive;
let setProgress_interval;
import {songs} from "./main.js";
function handleItem(list, callback){
    list.forEach(item => {
        callback(item);
    })
}
function changeActiveSong(song){
    songs[songIsActive.id - 1].isActive = false;
    fetch(songApi + '/' + songIsActive._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(songs[songIsActive.id - 1])
    })
    song.isActive = true;
    songIsActive = song;
    fetch(songApi + '/' + song._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(song)
    })
}
const setInfor = {
    all(songs){
      [songIsActive] = songs.filter(song => song.isActive === true);
      setInfor.playlist(songs);
      setInfor.songIsPlaying(songIsActive.id - 1);
    },
    playlist(songs){
      $('.playlist').innerHTML = songs.map((song) => {
        return `
            <li class="song" id="${song.id}">
                <div class="song_thumbnail_wrapper">
                    <img class="song_thumbnail" src="${song.thumbnail}" alt="">               
                    <div class="song_btn flex__center">
                        <i class="fas fa-pause song_btn_pause"></i>
                        <i class="fa-solid fa-play song_btn_play"></i>
                    </div>
                </div>
                <div class="song_info">
                    <span class="song_info_basic">
                        <p class="song_name contentOverflowHidden">${song.name}</p>
                        <p class="song_nowPlaying_title">đang phát</p>
                    </span>
                    <span class="song_info_description">
                        <p class="song_artist contentOverflowHidden">${song.artist}</p>
                        <i class="fa-solid fa-circle dot"></i>
                        <p class="song_duration">${song.duration}</p>
                    </span>
                </div>
            </li>
        `
      }).join('');
    },
    songIsPlaying(i){      
        audio.setAttribute('src', songs[i].audio);
        audio.setAttribute('id', songs[i].id);
        handleItem($$('.music_nowPlaying_name'), (item)=>{
            item.innerText = songs[i].name;
        })
        handleItem($$('.music_nowPlaying_artist'), (item)=>{
            item.innerText = songs[i].artist;
        })
        $('.music_nowPlaying_coverImage').setAttribute('src', songs[i].coverImage); 
        handleItem($$('.music_nowPlaying_thumbnail'), (item)=>{
            item.setAttribute('src', songs[i].thumbnail);
        })
        handleItem($$('.music_nowPlaying_duration'), (item)=>{
            item.innerText = songs[i].duration;
        })
        if($('.song.active')){
            $('.song.active').classList.remove('active');
        }
        $$('.song')[i].classList.add('active');
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
            if($('.progressTime_minute').innerText + ':' + $('.progressTime_second').innerText== $('.music_nowPlaying_duration').innerText){
                this.stop();
                if(audio.loop){
                    audioControl.play();
                }else if(audio.getAttribute('random') === 'true'){
                    let randomValue = Math.floor(Math.random() * $$('.song').length);
                    while(randomValue === audio.id - 1){
                        randomValue = Math.floor(Math.random() * $$('.song').length);
                    }
                    changeSong(randomValue);
                }
                else{
                    changeSong(Number(audio.getAttribute('id')));
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
        handleItem($$('.progressTime_minute'), (item)=>{
            item.innerText = minute;
        })
        handleItem($$('.progressTime_second'), (item)=>{
            item.innerText = second;
        })
    },
    setProgressBar(progressValue){
        handleItem($$('.music_control_progress'), (item)=>{
            item.value = progressValue;
        })
    }
  }
const audioControl = {
    play(){
      audio.play();
      handleItem($$('.music_control-pauseIcon'), (item)=>{
        item.style.display = 'block';
      })
      handleItem($$('.music_control-playIcon'), (item)=>{
        item.style.display = 'none';
      })
      setProgress.run();
      cdRotate.play();
    },
    pause(){
      audio.pause();
      handleItem($$('.music_control-pauseIcon'), (item)=>{
        item.style.display = 'none';
      })
      handleItem($$('.music_control-playIcon'), (item)=>{
        item.style.display = 'block';
      })
      setProgress.stop();
      cdRotate.pause();
    }
  }
  function changeSong(i){
    if(i >= songs.length){
        i = 0;
    }
    changeActiveSong(songs[i])
    setProgress.stop();
    setInfor.songIsPlaying(i)
    audioControl.play();
  }
const handleToast ={
    add(toast){
        $('.toast_list').insertAdjacentHTML('beforeend', toast);
        this.iconClose_addEvent();
        setTimeout(this.remove, 200)
    },
    remove(i) {
        toastList = $$('.toast_item');
        $$('.line').forEach( (line, i) =>{
            line.style.width = '0%';
            setTimeout(()=>{
                toastList[i].remove();
            }, 3000)
        })
    },
    iconClose_addEvent(){
        toast_iconCloses = $$('.toast_icon-close');
        toast_iconCloses.forEach((iconClose, i)=>{
            iconClose.onclick = ()=>{
                toastList[i].remove();
            }
        })
    }
}

export {setInfor, audioControl, setProgress, changeSong, handleToast};