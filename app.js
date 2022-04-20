const zingChat = 'https://apihash.herokuapp.com/getChartHome';

function start() {
    getZingChat(renderSongs);
}

function getZingChat(callback) {
    fetch(zingChat).
        then(response => response.json()).
        then(callback);
}

function getSong(id, i,  callback) {
    fetch(`https://apihash.herokuapp.com/getSong/${id}`)
    .then((response) => (response.json()))
    .then((response) => {
        if (response.err == 0) {
            allMusic[i].src = response.data[128];
            let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                    <span>${allMusic[i].title}</span>
                    <p>${allMusic[i].artistsNames}</p>
                    </div>
                    <span id="${allMusic[i].encodeId}" class="audio-duration">3:40</span>
                    <audio class="${allMusic[i].encodeId}" src="${response.data[128]}"></audio>
                </li>`;
            ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
            
            let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].encodeId}`);
            let liAudioTag = ulTag.querySelector(`.${allMusic[i].encodeId}`);
            liAudioTag.addEventListener("loadeddata", ()=>{
            let duration = liAudioTag.duration;
            let totalMin = Math.floor(duration / 60);
            let totalSec = Math.floor(duration % 60);
            if(totalSec < 10) totalSec = `0${totalSec}`;
            liAudioDurationTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
            liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
            });
        }
 
    });
}

let allMusic = [
    {
      name: "Chạy về nơi phía anh",
      artist: "Khắc Việt",
      img: "music1",
      src: "ChayVeNoiPhiaAnh-KhacViet-7129688"
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
const tooltip = wrapper.querySelector('.tooltip');

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

//set default volume
let currVolume = localStorage.getItem('volumeCurrent') ? localStorage.getItem('volumeCurrent') : volumeContainer.clientHeight;
changeVolumeIcon(currVolume/ volumeContainer.clientHeight )
volumeCurrent.style.height = currVolume +'px';

const ulTag = wrapper.querySelector("ul");

start();
function renderSongs(data) {
    allMusic = data.data.RTChart.items
    // let create li tags according to array length for list
    for (let i = 0; i < allMusic.length; i++) {
        getSong(allMusic[i].encodeId, i , renderSong);
    }
}

function renderSong() {

}
window.addEventListener("loaded", ()=>{
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
});

function loadMusic(indexNumb){
    clearInterval(intervalAction);
    musicName.innerText = allMusic[indexNumb - 1].title;
    musicArtist.innerText = allMusic[indexNumb - 1].artistsNames;
    // musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    // mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
    musicImg.src = allMusic[indexNumb - 1].thumbnailM;
    mainAudio.src = allMusic[indexNumb - 1].src;
}

let intervalAction;
//play music function
function playMusic(){
    wrapper.classList.add("paused");
    if (playPauseBtn.classList.contains('bx-play')) playPauseBtn.classList.replace('bx-play', 'bx-pause')
    clearInterval(intervalAction);
    intervalAction = setInterval(()=>{
        currentRotate = getComputedStyle(musicImg).getPropertyValue('--deg');
        currentRotateNumber = currentRotate.slice(0, currentRotate.length - 3);
        //if (currentRotateNumber == '360') currentRotateNumber = '0';
        nextRotateNumber = parseInt(currentRotateNumber) + 3 ;
        nextRotate = nextRotateNumber + 'deg';
        
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

//process next song when current song end
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
    (e.target == volumeContainer) ? currentVolume = (volumeHeight - clickOffsetY) : currentVolume = (volumeCurrent.clientHeight - clickOffsetY);

    changeVolumeIcon(currentVolume / volumeHeight);
    volumeCurrent.style.height = currentVolume + 'px';
    localStorage.setItem('volumeCurrent', currentVolume);
    
    mainAudio.volume = currentVolume / volumeHeight;
})

volumeIcon.addEventListener('click', () => {
    if (volumeIcon.getAttribute('volume-data') !== 'muted') {
        mainAudio.volume = 0;
        changeVolumeIcon(0);
        volumeCurrent.style.height = '0px';
    }
    else {
        let currVolume = localStorage.getItem('volumeCurrent') ? localStorage.getItem('volumeCurrent') : volumeContainer.clientHeight;
        let volume = currVolume / volumeContainer.clientHeight;
        changeVolumeIcon(volume);
        mainAudio.volume = volume;
        volumeCurrent.style.height = currVolume + 'px';

    }
    
});

function getVolumeData(value) {
    if (value / volumeContainer.clientHeight == 0) return 'muted';
    if (value / volumeContainer.clientHeight < 0.6) return 'medium';
    return 'large';
}

function getVolumeIconClass(volumeData) {
    switch (volumeData) {
        case 'muted': 
            return 'bx-volume-mute';
        case 'medium' : 
            return 'bx-volume-low';
        default: 
            return 'bx-volume-full';
    }
}

function changeVolumeIcon(volumeValue) {
    if (volumeValue == 0) {
        volumeIcon.classList.replace(getVolumeIconClass(volumeIcon.getAttribute('volume-data')), 'bx-volume-mute' );
        volumeIcon.setAttribute('volume-data', 'muted');
        return;
    }

    if (volumeValue < 0.6) {
        volumeIcon.classList.replace(getVolumeIconClass(volumeIcon.getAttribute('volume-data')),'bx-volume-low' );
        volumeIcon.setAttribute('volume-data', 'medium');
        return;
    }

    if (volumeValue >= 0.6) {
        volumeIcon.classList.replace(getVolumeIconClass(volumeIcon.getAttribute('volume-data')),'bx-volume-full' );
        volumeIcon.setAttribute('volume-data', 'large');
    }
}

progressContainer.addEventListener('mousemove', (e) => {
    let progressWidth = progressContainer.clientWidth;
    let clickOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    if (e.target === progressContainer || e.target == progressBar) {
        let tooltipTime = (clickOffsetX / progressWidth) * songDuration;
        let tooltipMin = Math.floor(tooltipTime / 60);
        let tooltipSec = Math.floor(tooltipTime % 60);
        tooltipSec = tooltipSec < 10 ? '0' + tooltipSec: tooltipSec;
        tooltip.style.left = (clickOffsetX / progressWidth)*100 + '%';
        tooltip.innerText = `${tooltipMin}:${tooltipSec}`
    }
})
