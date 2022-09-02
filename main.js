const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const songsApi = 'https://api-cho-sowndev.vercel.app/api/v1/audios';
const audio = $('.music_nowPlaying_audio');
import {setInfor, audioControl, setProgress, changeSong} from './method.js';
let songs;
const start = ()=>{
  getSongs();
}
start();
document.onclick = ()=>(console.log(Math.random() * 6 + 1))
function getSongs(){
  fetch(songsApi)
    .then((res) => res.json())
    .then(resJs => {
      songs = resJs.data;
      setInfor.all(songs)
      addEvent();
      $('.loading').style.display = 'none';
    })
}
export {songs};
function addEvent(){
  document.onkeydown = (e)=>{
    console.log(e.keyCode )
    e.preventDefault()
    switch(e.which){
      case 32:{
        if($('.music_control-pauseIcon').style.display === 'none'){
          audioControl.play();
        }else{
          audioControl.pause();
        }
        break;
      }
      case 74:{
        backwardSong();
        break;
      }
      case 70: {
        forwardSong();
        break;
      }
      case 37: {
        handleSkip(Number(audio.currentTime) - 5);
        break;
      }
      case 39: {
        setProgress.stop();
        if(`${$('.progressTime_minute').innerText}:${$('.progressTime_second').innerText}` == $('.music_nowPlaying_duration').innerText && audio.loop === false){
          changeSong(Number(audio.getAttribute('id')));
        }else{
          handleSkip(Number(audio.currentTime) + 5);
        }
        break;
      }
      case 77: {
        handleLoop();
      }
    }
  }
  $('.music_control-play').onclick = () => {   
    handleAudioControl();
  }
  
  $('.music_control_progress').addEventListener('change', ()=>{
    handleSkip(audio.duration / 100 * $('.music_control_progress').value)
  })
  
  $('.music_control-backward').onclick = ()=>{
    forwardSong();
  }
  $('.music_control-forward').onclick = ()=>{
    backwardSong();
  }
  $$('.song').forEach((song)=>{
    song.onclick = ()=>{
      changeSong(song.getAttribute('id') - 1)
    }
  })
  $('.music_control-repeat').onclick = ()=>{
    handleLoop();
  }
  function forwardSong(){
    changeSong(audio.getAttribute('id') - 2)
  }
  function backwardSong(){
    changeSong(audio.getAttribute('id'))
  }
  function handleAudioControl(){
    if($('.music_control-pauseIcon').style.display === 'none'){
      audioControl.play();
    }else{
      audioControl.pause();
    }
  }
  function handleSkip(skipValue){
    setProgress.stop();
    audio.currentTime = skipValue;
    audioControl.play();
  }
  function handleLoop(){
    if(audio.loop === false){
      audio.setAttribute('loop', true);
      $('.music_control-repeat').style.color = 'var(--primary-color)';
    }else{
      audio.removeAttribute('loop');
      $('.music_control-repeat').style.color = 'var(--text-color)';
    }
  }
}


