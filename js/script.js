console.log(`Let's Write Some Javascript`);
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure two digits for both minutes and seconds
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let data = div.getElementsByTagName("a")
    // console.log(data);
    songs = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs);
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="music" src="svg/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Song Artist </div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
        <img class="invert" src="svg/play.svg" alt="">
        </div>
        </li>`;
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            play.src = "pause.svg"; 

        })
    })

    return songs;

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play();
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums(){

    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    cardContainer = document.querySelector(".cardContainer");
    let array =  Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-2)[0];
            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="solid"> -->
                    <svg width="25px" height="25px" xmlns="http://www.w3.org/2000/svg" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg>
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
            </div>`
        }
    }
    console.log(a);

}
async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0], true);
    // console.log(songs);
    // Display all the albums on the page 
    await displayAlbums();

    // Attach an event listener to play, next and previous button
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "play.svg"

        }
    })
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    // Event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // Add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-5%";
    })
    // Add an event listener to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add an event listener to previous and next 
    previous.addEventListener("click", () => {
        currentSong.pause();
        // console.log('Previous Clicked');     
        let index = songs.indexOf((currentSong.src.split('/').slice(-1)[0]));
        if ([index - 1] >= 0) {
            playMusic(songs[index - 1])
        }

    })
    //Add an event listener to previous and next 
    next.addEventListener("click", () => {
        // console.log('Next Clicked'); 
        currentSong.pause();
        let index = songs.indexOf((currentSong.src.split('/').slice(-1)[0]));
        // console.log(songs,index);
        if ([index + 1] <= songs.length - 1) {
            playMusic(songs[index + 1])
        }

    })
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    // Load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target);
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = "0";
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;  
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = "0.1";
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
        
    })
}

main();      