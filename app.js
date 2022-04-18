let allMusic = [
    {
      name: "Chạy về nơi phía anh",
      artist: "Khắc Việt",
      img: "music1",
      src: "ChayVeNoiPhiaAnh-KhacViet-7129688"
    },
    {
      name: "Câu hẹn câu thề",
      artist: "Đình Dũng",
      img: "music2",
      src: "CauHenCauThe-DinhDung-6994741"
    },
    {
      name: "Có em đây",
      artist: "Như Việt",
      img: "music3",
      src: "CoEmDay-NhuViet-7126614"
    },
    {
      name: "Đế Vương",
      artist: "Đình Dũng",
      img: "music4",
      src: "DeVuong-DinhDungACV-7121634"
    },
    {
      name: "Ước mơ của mẹ",
      artist: "Quân AP",
      img: "music5",
      src: "UocMoCuaMe1-QuanAP-7127567"
    },
    {
      name: "Váy cưới",
      artist: "Trung Tự",
      img: "music6",
      src: "VayCuoiTrungTuProgressiveHouseRemix-TrungTu-4955768"
    }
]

const wrapper = document.querySelector('.wrapper');
const musicImg = wrapper.querySelector('.music__img');
const musicName = wrapper.querySelector('.song__name');
const musicArtist = wrapper.querySelector('.song__artist');
const mainAudio = wrapper.querySelector('#audio');

const playPauseBtn = wrapper.querySelector('.play-pause__btn');
const prevBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');

const progressContainer = wrapper.querySelector('.progress__container');
const progressBar = wrapper.querySelector('.progress__bar');

const volumeContainer = wrapper.querySelector('.volume__container');
const volumeCurrent = wrapper.querySelector('.volume__current');
const volumeIcon = wrapper.querySelector('.volume__icon');

const currentTimeProgress = wrapper.querySelector('.progress__current');
const endTimeProgress = wrapper.querySelector('.progress__end');

const moreMusicBtn = wrapper.querySelector('#controls__more');
const musicList = wrapper.querySelector('.music__list');
const closeMoreMusic  = wrapper.querySelector('#close');
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
let currVolume = localStorage.getItem('volumeCurrent') ? localStorage.getItem('volumeCurrent') : 60;
let label = getVolumeData(currVolume);

volumeIcon.setAttribute('volume-data', label);
volumeCurrent.style.height = currVolume +'px';
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
});

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

let intervalAction;
//play music function
function playMusic(){
    wrapper.classList.add("paused");
    if (playPauseBtn.classList.contains('bx-play')) playPauseBtn.classList.replace('bx-play', 'bx-pause')
    //playPauseBtn.querySelector("i").innerText = "pause";
    intervalAction = setInterval(()=>{
        currentRotate = getComputedStyle(musicImg).getPropertyValue('--deg');
        currentRotateNumber = currentRotate.slice(0, currentRotate.length - 3);
        //if (currentRotateNumber == '360') currentRotateNumber = '0';
        nextRotateNumber = parseInt(currentRotateNumber) + 3 ;
        nextRotate = nextRotateNumber + 'deg';
        console.log(nextRotate)
        musicImg.style.setProperty('--deg', nextRotate);
    },100)

    mainAudio.play();
}

function pauseMusic() {
    wrapper.classList.remove("paused");
    clearInterval(intervalAction);
    musicImg.style.setProperty('--deg', '0deg');
    if (playPauseBtn.classList.contains('bx-pause')) playPauseBtn.classList.replace('bx-pause', 'bx-play')
    mainAudio.pause();
}


function prevMusic() {
    clearInterval(intervalAction);
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function nextMusic() {
    clearInterval(intervalAction);
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

playPauseBtn.addEventListener('click', () => {
    const isPlaying = wrapper.classList.contains('paused');
    isPlaying ? pauseMusic() : playMusic();
    playingSong();
})

prevBtn.addEventListener("click", ()=>{
    prevMusic();
});
  //next music button event
nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let percent = currentTime / duration * 100;
    progressBar.style.width = percent + '%';

    mainAudio.addEventListener('loadeddata', () => {
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) totalSec = `0${totalSec}`;
        endTimeProgress.innerHTML = `${totalMin}:${totalSec}`
    })

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) currentSec = `0${currentSec}`;
    currentTimeProgress.innerHTML = `${currentMin}:${currentSec}`;
})


//update song when click progress bar
progressContainer.addEventListener('click', (e)=> {
    let progressWidth = progressContainer.clientWidth;
    let clickOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
    
})

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

closeMoreMusic.addEventListener('click', ()=>{
    musicList.classList.toggle("show")
})


const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if(totalSec < 10) totalSec = `0${totalSec}`;
        liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
        liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
}

function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");
    allLiTag.forEach(liTag => {
        let audioTag = liTag.querySelector(".audio-duration");
        if (liTag.classList.contains('playing')) {
            liTag.classList.remove('playing');
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = adDuration;
        }

        if (liTag.getAttribute('li-index') == musicIndex) {
            liTag.classList.add("playing");
            audioTag.innerText = "Playing";
        }

        liTag.setAttribute("onclick", "clicked(this)");
    });
}

function clicked(element){
    clearInterval(intervalAction);
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () =>{
    let currentRepeatBtnValue = repeatBtn.getAttribute('button-value');

    switch (currentRepeatBtnValue) {
        case "repeat" :
            repeatBtn.classList.replace('fa-repeat', 'fa-arrow-rotate-right');
            repeatBtn.setAttribute('button-value', 'repeat-one');
            break;
        case "repeat-one" :
            repeatBtn.classList.replace('fa-arrow-rotate-right', 'fa-shuffle');
            repeatBtn.setAttribute('button-value', 'shuffle');
            break;
        case "shuffle" :
            repeatBtn.classList.replace('fa-shuffle', 'fa-repeat');
            repeatBtn.setAttribute('button-value', 'repeat');
            break;
    }
})

mainAudio.addEventListener('ended', ()=> {
    let currentRepeatBtnValue = repeatBtn.getAttribute('button-value');

    switch (currentRepeatBtnValue) {
        case "repeat" :
            nextMusic();
            break;
        case "repeat-one" :
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle" :
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);

            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})

//update song when click progress bar
volumeContainer.addEventListener('click', (e)=> {
    let volumeHeight = volumeContainer.clientHeight;
    let clickOffsetY = e.offsetY;
    let currentVolume;
    if (e.target == volumeContainer) {
        currentVolume = (volumeHeight - clickOffsetY);
    }
    else {
        currentVolume = (volumeCurrent.clientHeight - clickOffsetY);
    }

    if (currentVolume === 0) {
        if (volumeIcon.getAttribute('volume-data') == 'large')
        volumeIcon.classList.replace('bx-volume-full','bx-volume-mute' );

        else if (volumeIcon.getAttribute('volume-data') == 'medium')
        volumeIcon.classList.replace('bx-volume-low','bx-volume-mute' )
        else volumeIcon.classList.replace('bx-volume-low','bx-volume-mute' )
        volumeIcon.setAttribute('volume-data', 'muted')
    }

    if (currentVolume / volumeHeight < 0.6) {
        if (volumeIcon.getAttribute('volume-data') == 'large'){
            console.log("me")
            volumeIcon.classList.replace('bx-volume-full','bx-volume-low' );
        }

        else if (volumeIcon.getAttribute('volume-data') == 'medium')
        volumeIcon.classList.replace('bx-volume-low','bx-volume-low' )
        else volumeIcon.classList.replace('bx-volume-mute','bx-volume-low' );
        volumeIcon.setAttribute('volume-data', 'medium')
    }

    if (currentVolume / volumeHeight >= 0.8) {
        if (volumeIcon.getAttribute('volume-data') == 'large')
        volumeIcon.classList.replace('bx-volume-full','bx-volume-full' );

        else if (volumeIcon.getAttribute('volume-data') == 'medium')
        volumeIcon.classList.replace('bx-volume-low','bx-volume-full' )
        else volumeIcon.classList.replace('bx-volume-mute','bx-volume-full' )
        volumeIcon.setAttribute('volume-data', 'large')
    }

    volumeCurrent.style.height = currentVolume + 'px';
    localStorage.setItem('volumeCurrent', currentVolume);
    
    mainAudio.volume = currentVolume / volumeHeight;
    
    
})

volumeIcon.addEventListener('click', () => {
    if (volumeIcon.getAttribute('volume-data') !== 'muted') {
        mainAudio.volume = 0;
        volumeIcon.classList.replace('bx-volume-full','bx-volume-mute' );
        volumeIcon.classList.replace('bx-volume-low','bx-volume-mute' );
        volumeCurrent.style.height = '0px';
        volumeIcon.setAttribute('volume-data', 'muted')
    }
    else {
        mainAudio.volume = 1;
        volumeIcon.classList.replace('bx-volume-mute','bx-volume-full' );
       
        volumeCurrent.style.height = '60px';
        volumeIcon.setAttribute('volume-data', 'large')
    }
    
});

function getVolumeData(value) {
    if (value / volumeContainer.clientHeight == 0) return 'muted';
    if (value / volumeContainer.clientHeight < 0.6) return 'medium';
    return 'large';
}
