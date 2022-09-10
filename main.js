const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const songsApi = 'https://api-cho-sowndev.vercel.app/api/v1/audios';
const audio = $('.music_nowPlaying_audio');
import {setInfor, audioControl, setProgress, changeSong, handleToast} from './method.js';
let songs;
let audioVolume;
function handleItem(list, callback){
  list.forEach(item => {
      callback(item);
  })
}
const toast_successfully =
    `
        <li class="toast_item toast_item-successfully">
            <svg class="toast_icon toast_icon-successfully" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <span class="toast_text-wrapper">
                <p class="toast_text-main">Thành công!</p>
                <p class="toast_text-sub">Tải nhạc thành công, cùng thưởng thức</p>
            </span>
            <svg class="toast_icon-close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
            <div class="line line-successfully"></div>
        </li>
    `;
const toast_errors =
    `
        <li class="toast_item toast_item-errors">
            <svg class="toast_icon toast_icon-errors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            <span class="toast_text-wrapper">
                <p class="toast_text-main">Thất bại!</p>
                <p class="toast_text-sub">Đã có lỗi xảy ra, vui lòng tải lại trang</p>
            </span>
            <svg class="toast_icon-close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
            <div class="line line-errors"></div>
        </li>
    `;

const start = ()=>{
  getSongs();
}

start();
function getSongs(){
  fetch(songsApi)
    .then(res => res.json())
    .then(resJs => {
      window.scrollTo(0, 0);
      songs = resJs.data;
      setInfor.all(songs)
      addEvent();
      $('.loading').style.display = 'none';
      handleToast.add(toast_successfully)
    })
    .catch(()=>{
      $('.loading').style.display = 'none';
      handleToast.add(toast_errors)
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
        forwardSong();
        break;
      }
      case 70: {
        backwardSong();
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
      case 76: {
        handleLoop();
        break;
      }
      case 82: {
        handleRandom();
        break;
      }
      case 77: {
        if($('.music_control_volume_icon_xmark').style.display == 'none'){
          handleAudio_mute();
        }else{
          handleAudio_unmute();
        }
        break;
      }
    }
  }
  document.onscroll = ()=>{
    if(window.scrollY >= $('.header').clientHeight){
      $('.footer').style.transform = 'translateY(0%)';
    }else{
      $('.footer').style.transform = 'translateY(100%)';
    }
  }
  $('.commentInput').addEventListener('keydown', (e)=>{
    e.stopPropagation()
  })
  handleItem($$('.music_control-play'), (item)=>{
    item.onclick = () => {   
      handleAudioControl();
    }
  })
  handleItem($$('.music_control_progress'), (item)=>{
    item.addEventListener('change', ()=>{
      handleSkip(audio.duration / 100 * item.value)
    })
  })
  handleItem($$('.music_control_volume'), (item)=>{
    item.addEventListener('change', (e)=>{
      setAudioVolume(e.target);
    })
  })
  handleItem($$('.music_control_volume_icon_default'), (item)=>{
    item.addEventListener('click', (e)=>{
      handleAudio_mute();
    })
  })
  handleItem($$('.music_control_volume_icon_xmark'), (item)=>{
    item.addEventListener('click', (e)=>{
      handleAudio_unmute();
    })
  })
  handleItem($$('.music_control-backward'), (item)=>{
    item.onclick = () => {   
      backwardSong();
    }
  })
  handleItem($$('.music_control-forward'), (item)=>{
    item.onclick = () => {   
      forwardSong();
    }
  })
  $$('.song').forEach((song)=>{
    song.onclick = ()=>{
      changeSong(song.getAttribute('id') - 1)
    }
  })
  handleItem($$('.music_control-repeat'), (item)=>{
    item.onclick = () => {   
      handleLoop();
    }
  })
  handleItem($$('.music_control-random'), (item)=>{
    item.onclick = () => {   
      handleRandom();
    }
  })
  function backwardSong(){
    changeSong(audio.getAttribute('id') - 2)
  }
  function forwardSong(){
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
      handleItem($$('.music_control-repeat'), (item)=>{
        item.style.color = 'var(--primary-color)';
      })
      audio.setAttribute('random', false);
      handleItem($$('.music_control-random'), (item)=>{
        item.style.color = 'var(--text-color)';
      })
    }else{
      audio.removeAttribute('loop');
      handleItem($$('.music_control-repeat'), (item)=>{
        item.style.color = 'var(--text-color)';
      })
    }
  }

  function handleRandom(){
    if(audio.getAttribute('random') === 'false'){
      console.log(0);
      audio.setAttribute('random', true);
      handleItem($$('.music_control-random'), (item)=>{
        item.style.color = 'var(--primary-color)';
      })
      audio.removeAttribute('loop');
      handleItem($$('.music_control-repeat'), (item)=>{
        item.style.color = 'var(--text-color)';
      })
    }else{
      audio.setAttribute('random', false);
      handleItem($$('.music_control-random'), (item)=>{
        item.style.color = 'var(--text-color)';
      })
    }
  }
  function setAudioVolume(volumeBar){
    if(volumeBar.value / 100 == 0){
      handleAudio_mute();
    }else{
      handleItem($$('.music_control_volume_icon_xmark'), (item)=>{
        item.style.display = 'none';
      })
      handleItem($$('.music_control_volume_icon_default'), (item)=>{
        item.style.display = 'block';
      })
    }
    audio.volume = volumeBar.value / 100;
    handleItem($$('.music_control_volume'), (item)=>{
      item.value = volumeBar.value;
    })
  }
  function handleAudio_unmute(){
    audio.volume = audioVolume;
    handleItem($$('.music_control_volume'), (item)=>{
      item.value = audioVolume * 100;
    })
    handleItem($$('.music_control_volume_icon_xmark'), (item)=>{
      item.style.display = 'none';
    })
    handleItem($$('.music_control_volume_icon_default'), (item)=>{
      item.style.display = 'block';
    })
  }
  function handleAudio_mute(){
    audioVolume = audio.volume;
    audio.volume = 0;
    handleItem($$('.music_control_volume'), (item)=>{
      item.value = 0;
    })
    handleItem($$('.music_control_volume_icon_xmark'), (item)=>{
      item.style.display = 'block';
    })
    handleItem($$('.music_control_volume_icon_default'), (item)=>{
      item.style.display = 'none';
    })
  }
}


