const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const songsApi = 'http://localhost:3000/songs';
const audio = $('.music_nowPlaying_audio');
let songs;

import {setInfor, audioControl, setProgress, changeSong} from './method.js';

const start = ()=>{
  getSongs();
}
start();

function getSongs(){
  fetch(songsApi)
    .then((res) => res.json())
    .then(resJs => {
      songs = resJs;
      setInfor.all(songs)
      changeSong();
    })
}
export {songs};

$('.music_control-play').onclick = () => {
  if($('.music_control-pauseIcon').style.display === 'none'){
    audioControl.play();
  }else{
    audioControl.pause();
  }
}

$('.music_control_progress').addEventListener('mouseup', ()=>{
  audioControl.pause();
  audio.currentTime = audio.duration / 100 * $('.music_control_progress').value;
  audioControl.play();
})

