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
        welcomeSplashTime: 10,
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

    const welcomeSplash = document.createElement('div');
    const splashTitle = document.createElement('label');
    const splashContinueText = document.createElement('label');
    welcomeSplash.classList.add('welcomesplash');
    welcomeSplash.appendChild(splashTitle);
    splashContinueText.classList.add('splash-text1');
    splashTitle.classList.add('splash-title1');
    splashTitle.appendChild(document.createTextNode("In the Dark"));
    splashContinueText.appendChild(document.createTextNode("(click anywhere to continue)"));

    const coverScreen = document.createElement('div');
    const weaponOverlay = document.createElement('div');
    const styleThingy = document.createElement('style');
    const flashLight = document.createElement('div');
    const itemLight = document.createElement('div');
    const timerLight = document.createElement('div');
    const overlayButton = document.createElement('div');
    const musicArray = ['https://seanysean.github.io/sk-hs-assets/Dark_80s_Horror_Music_-_Intruder_Royalty_Free_No_Copyright.mp3', 'https://seanysean.github.io/sk-hs-assets/REPULSIVE_-_Forgotten_COPYRIGHT_FREE_HORROR_MUSIC.mp3'];
    const soundEffectsArray = ['https://seanysean.github.io/sk-hs-assets/lightning.mp3', 'https://seanysean.github.io/sk-hs-assets/lightning2.mp3', 'https://seanysean.github.io/sk-hs-assets/lightning3.mp3'];
    const magnifyingGlass = new Image();
    magnifyingGlass.src = 'https://seanysean.github.io/sk-hs-assets/magnifying-glass-1.png';
    magnifyingGlass.classList.add('magnifying-glass');
    let currentSong;
    let lightningSound;
    let arrayOfTimeouts = [];
    let coverScreenOn = false;
    coverScreen.classList.add('seansimpossibletorememberclassname', 'seanshidethething');
    flashLight.classList.add('seansflashlightmain', 'seanflashlight');
    itemLight.classList.add('seanflashlight', 'seanitemlight');
    timerLight.classList.add('seanflashlight', 'timerlight');
    overlayButton.classList.add('overlay-button');
    overlayButton.appendChild(magnifyingGlass);

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
        border-radius: 100%;
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
        top: 3.7vh;
        width: 11vh;
        height: 6vh;
        transform: translate(-50%);
        margin-left: 16.5vh;
        border-radius: 100%;
    }
    .timerlight::after{
       background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 71%)
    }
    .seanshidethething {
        opacity: 0;
        pointer-events: none;
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
    .overlay-button {
        position: absolute;
        width: 8vh;
        height: 8vh;
        top: 22vh;
        right: 2vh;
        background: black;
        border-radius: 30%;
        border: white solid 0.5vh;
        box-shadow: 0px 0px 0vh black;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000000;
    }
    .magnifying-glass {
        width: 5vh;
        height: 5vh;
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
        pointer-events: none;
    }
    .configscreeninner{
        width: 100%;
        height: 100%;
        border: 0.5vh RGBa(255, 255, 255, 0.3) solid;
        border-radius: 5%;
        padding: 2vh;
        pointer-events: none;
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
    .splash-title1 {
        color: white;
        font-size: 15vh;
        font-family: fantasy;
        letter-spacing: 0.2vh;
        display: inline-block;
        opacity: 0%;
    }
    .splash-text1 {
        position: absolute;
        top: 60vh;
        left: 50%;
        color: white;
        font-size: 3vh;
        font-family: fantasy;
        letter-spacing: 0.2vh;
        display: inline-block;
        opacity: 0%;
        animation: pulse-text 5s infinite;
        transform: translate(-50%);
    }
    @keyframes pulse-text {
        0% {
            opacity: 0%;
        }
        50% {
            opacity: 100%;
        }
        100% {
            opacity: 0%;
        }
    }
    .welcomesplash{
        background: black;
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0%;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        /*text-align: center;*/
    }
    .fade-in-splash {
        animation: fade-in-splash-animation 1s ease-in forwards;
        pointer-events: all;
    }
    @keyframes fade-in-splash-animation {
        0% {
           opacity: 0%;
        }

        100% {
           opacity: 100%;
        }
    }
    .fade-out-splash {
        animation: fade-out-splash-animation 1s ease-out forwards;
        pointer-events: none;
    }
    @keyframes fade-out-splash-animation {
        0% {
           opacity: 100%;
        }

        100% {
           opacity: 0%;
        }
    }
    .fade-in-splash-title {
        animation: splash-title-animation 8s ease-in forwards;
    }
    @keyframes splash-title-animation {
        0% {
           opacity: 0%;
        }

        100% {
           opacity: 100%;
        }
    }
    body {
        overflow: hidden;
    }`;
    coverScreen.appendChild(flashLight);
    coverScreen.appendChild(itemLight);
    coverScreen.appendChild(timerLight);
    document.body.appendChild(coverScreen);
    document.body.appendChild(styleThingy);
    document.body.appendChild(welcomeSplash);
    document.body.appendChild(overlayButton);
    overlayButton.addEventListener('click', event => {
        coverScreenOn = !coverScreenOn;
            if (!coverScreenOn) {
                currentSong.pause();
                lightningSound.pause();
                coverScreen.classList.add('seanshidethething');
                welcomeSplash.classList.remove('fade-in-splash');
                splashTitle.classList.remove('fade-in-splash-title');
                welcomeSplash.classList.remove('fade-out-splash');
                splashTitle.classList.remove('fade-out-splash');
                splashContinueText.classList.remove('fade-out-splash');
                welcomeSplash.removeChild(splashContinueText);
                endAllTimeouts();
            } else {
                welcomeSplash.classList.add('fade-in-splash');
                currentSong = new Audio(musicArray[1]);
                currentSong.load();
                currentSong.currentTime = 5;
                currentSong.play();
                lightningSound = new Audio(soundEffectsArray[0]);
                lightningSound.load();
                lightningSound.play();
                setTimeout(()=>{
                    if(coverScreenOn){
                        splashTitle.classList.add('fade-in-splash-title');
                    }
                }, 1000 * 1.5);
                setTimeout(()=>{
                    if(coverScreenOn){
                        welcomeSplash.appendChild(splashContinueText);
                    }
                }, 1000 * 9.5);
                welcomeSplash.addEventListener('click', event =>{
                    if(coverScreenOn){
                        welcomeSplash.classList.remove('fade-in-splash');
                        splashTitle.classList.remove('fade-in-splash-title');
                        welcomeSplash.classList.add('fade-out-splash');
                        splashTitle.classList.add('fade-out-splash');
                        splashContinueText.classList.add('fade-out-splash');
                        coverScreen.classList.remove('seanshidethething');
                        currentSong.pause();
                        currentSong = new Audio(musicArray[0]);
                        currentSong.load();
                        currentSong.loop = true;
                        currentSong.play();
                        handleFlickerTimeOut();
                    }
                });

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
