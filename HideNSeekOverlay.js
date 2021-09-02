// ==UserScript==
// @name         Small view
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       seanysean, JashSK
// @match        https://smashkarts.io/*
// @icon         https://www.google.com/s2/favicons?domain=smashkarts.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const config = {
        lightningFrequency: 20, // seconds
        wideViewDuration: 5, // seconds
        wideViewSize: 60, // %
        mainFlashlightSize: 40, // %
        itemLightSize: 40, // %
        welcomeScreenTime: 5,
    }
    const configScreenOuter = document.createElement('div');
    configScreenOuter.classList.add('configscreenouter', 'seanshidethething');
    configScreenOuter.innerHTML = `
    <div class="configscreeninner">
         <div class="centered t1" style="text-decoration: underline;">Settings</div>
         <div class="newconfigline">
              <label class="t2">Flashlight: </label>
              <spacer style="width:100%"></spacer>
              <input class="input" id="input" placeholder="0">
              <label class="t2">secs</label>
         </div>
         <div class="newconfigline">
         </div>
    </div>`;


    const coverScreen = document.createElement('div');
    const weaponOverlay = document.createElement('div');
    const styleThingy = document.createElement('style');
    const flashLight = document.createElement('div');
    const itemLight = document.createElement('div');
    const timerLight = document.createElement('div');
    const musicArray = ['https://seanysean.github.io/sk-hs-assets/Dark_80s_Horror_Music_-_Intruder_Royalty_Free_No_Copyright.mp3', 'https://seanysean.github.io/sk-hs-assets/REPULSIVE_-_Forgotten_COPYRIGHT_FREE_HORROR_MUSIC.mp3'];
    const soundEffectsArray = ['https://seanysean.github.io/sk-hs-assets/lightning.mp3', 'https://seanysean.github.io/sk-hs-assets/lightning2.mp3', 'https://seanysean.github.io/sk-hs-assets/lightning3.mp3'];
    let currentSong;
    let lightningSound;
    let arrayOfTimeouts = [];
    let coverScreenOn = false;
    coverScreen.classList.add('seansimpossibletorememberclassname', 'seanshidethething');
    flashLight.classList.add('seansflashlightmain', 'seanflashlight');
    itemLight.classList.add('seanflashlight', 'seanitemlight');
    timerLight.classList.add('seanflashlight', 'timerlight');

    styleThingy.innerHTML = `
    .input{
        width: 7vh;
        height: 6vh;
        padding: 1vh 1vh;
        margin: 1vh 1.5vh;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 4vh;
        text-align: center;
    }
    .seansimpossibletorememberclassname {
        pointer-events: none;
        width: 100%;
        height: 100%;
        background: black;
        position: absolute;
        top: 0;
        mix-blend-mode: hard-light;
    }
    .seanflashlight {
        background: gray;
        position: absolute;
    }
    .seansflashlightmain {
        width: 100vh;
        height: 100vh;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .seansflashlightmain::after {
        background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 35%);
        background-position: 50% -10vh;
    }
    .seanitemlight {
        width: 31vh;
        height: 31vh;
        bottom: 0;
        right: 0;
    }
    .seanitemlight::after {
        background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 60%);
    }
    .seanflashlight::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
    }
    .timerlight{
        left: 50%;
        top: 3vh;
        width: 12vh;
        height: 7vh;
        transform: translate(-50%);
        margin-left: 16vh;
    }
    .timerlight::after{
       background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 71%)
    }
    .seanshidethething {
        opacity: 0;
    }
    .jashwideview {
        width: 100%;
        height: 100%;
        border: none;
    }
    .jashwideview::after{
        background: radial-gradient(RGBa(0, 245, 249, 0.2), RGBa(0, 245, 249, 0.2) 10%, #000 ${config.wideViewSize}%);
        background-position: 50% -10vh;
    }
    .configscreenouter{
        position: absolute;
        background: black;
        left: 50%;
        top: 50%;
        width: 60vh;
        height: 80vh;
        transform: translate(-50%,-50%);
        border-radius: 5%;
        border: RGBa(255, 255, 255, 0.3) solid 0.5vh;
        box-shadow: 0px 0px 15px white;
        padding: 1vh;
    }
    .configscreeninner{
        width: 100%;
        height: 100%;
        border: 0.5vh RGBa(255, 255, 255, 0.3) solid;
        border-radius: 5%;
        padding: 2vh;
    }
    .newconfigline{
        width: 100%;
        margin-bottom: 3vh;
        flex-direction: row;
        display: flex;
        align-items: center;
    }
    .centered{
        width: 100%;
        margin-bottom: 3vh;
        flex-direction: row;
        text-align:center;
    }
    .t1{
       color: white;
       font-size: 5vh;
       font-family:fantasy;
       letter-spacing: 0.2vh;
       display: inline-block;
    }
    .t2{
       color: white;
       font-size: 4vh;
       font-family:fantasy;
       letter-spacing: 0.1vh;
       display: inline-block;
    }
    body {
        overflow: hidden;
    }`;
    coverScreen.appendChild(flashLight);
    coverScreen.appendChild(itemLight);
    coverScreen.appendChild(timerLight);
    document.body.appendChild(coverScreen);
    document.body.appendChild(styleThingy);
    document.body.appendChild(configScreenOuter);
    document.body.addEventListener('keyup', e=> {
        if (e.key === 'q' && e.ctrlKey) {
            coverScreenOn = !coverScreenOn;
            if (!coverScreenOn) {
                coverScreen.classList.add('seanshidethething');
                configScreenOuter.classList.add('seanshidethething');
                endAllTimeouts();
                currentSong.pause();
                currentSong.load();
                lightningSound.load();
                lightningSound.pause();
            } else {
                configScreenOuter.classList.remove('seanshidethething');
                setTimeout(()=>{
                    configScreenOuter.classList.add('seanshidethething');
                }, 1000 * config.welcomeScreenTime);
                coverScreen.classList.remove('seanshidethething');
                if(!currentSong){
                    currentSong = new Audio(musicArray[1]);
                }
                currentSong.load();
                currentSong.play();
                currentSong.currentTime = 5;

                setTimeout(handleFlickerTimeOut,1000 * config.welcomeScreenTime);
                
                const gameMusic = setTimeout(()=>{
                    currentSong.pause();
                    currentSong = new Audio(musicArray[0]);
                    lightningSound = new Audio(soundEffectsArray[0]);
                    currentSong.loop = true;
                    currentSong.play();
                }, 1000 * config.welcomeScreenTime);
                arrayOfTimeouts.push(gameMusic);
            }
        }
    });
    function handleFlickerTimeOut() {
        const timeoutInt = setTimeout(()=>{
            if (coverScreenOn) {
                lightningSound = new Audio(soundEffectsArray[getRandomInt(0 , 2)]);
                lightningSound.play();
                setTimeout(()=>{
                    flashLight.classList.add('jashwideview');
                    timerLight.classList.add('seanshidethething');
                }, 100); // .1 seconds
                setTimeout(()=>{
                    flashLight.classList.remove('jashwideview');
                    timerLight.classList.remove('seanshidethething');;
                }, config.wideViewDuration * 1000);
                handleFlickerTimeOut();
            }
        }, 1000 * config.lightningFrequency);
        arrayOfTimeouts.push(timeoutInt);
    }
    function endAllTimeouts() {
        arrayOfTimeouts.forEach(t=>{
            clearTimeout(t);
        });
        clearTimeout(gameMusic);
        arrayOfTimeouts = [];
    }
    function addBorders() {
        const borderSize = (window.innerWidth - window.innerHeight) / 2;
        coverScreen.style.borderLeft = `${borderSize + 1}px solid #000`;
        coverScreen.style.borderRight = `${borderSize + 1}px solid #000`;
        debugger;
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    //addBorders();
})();
