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
        background: radial-gradient(RGBa(0, 245, 249, 0.2), RGBa(0, 245, 249, 0.2) 10%, #000 60%);
        background-position: 50% -10vh;
    }
    body {
        overflow: hidden;
    }`;
    coverScreen.appendChild(flashLight);
    coverScreen.appendChild(itemLight);
    coverScreen.appendChild(timerLight);
    document.body.appendChild(coverScreen);
    document.body.appendChild(styleThingy);
    document.body.addEventListener('keyup', e=> {
        if (e.key === 'q' && e.altKey) {
            coverScreenOn = !coverScreenOn;
            if (!coverScreenOn) {
                coverScreen.classList.add('seanshidethething');
                endAllTimeouts();
                currentSong.pause();
                currentSong.load();
                lightningSound.load();
                lightningSound.pause();
            } else {
                coverScreen.classList.remove('seanshidethething');
                handleFlickerTimeOut();
                if (!currentSong) {
                    currentSong = new Audio(musicArray[0]);
                    lightningSound = new Audio(soundEffectsArray[0]);
                    currentSong.loop = true;
                }
                currentSong.play();
            }
        }
    });
    function handleFlickerTimeOut() {
        const timeoutInt = setTimeout(()=>{
            if (coverScreenOn) {
                lightningSound = new Audio(soundEffectsArray[getRandomInt(0 , 2)]);
                lightningSound.play();
                setTimeout(()=>{
                    //coverScreen.classList.add('jashwideview');
                    //flashLight.setAttribute('background', 'radial-gradient(RGBa(0, 245, 249, 0.2), RGBa(0, 245, 249, 0.2) 10%, #000 60%)');
                    flashLight.classList.add('jashwideview');
                    timerLight.classList.add('seanshidethething');
                    //flashLight.style.background = 'radial-gradient(RGBa(0, 245, 249, 0.2), RGBa(0, 245, 249, 0.2) 10%, #000 60%)';
                    //flashLight.style.backgroundPosition = '50% -5vh';
                    //flashLight.style.width = '100%';
                }, 100); // 1 seconds
                setTimeout(()=>{
                    //coverScreen.classList.remove('jashwideview');
                    //flashLight.setAttribute('background', 'radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 35%)');
                    flashLight.classList.remove('jashwideview');
                    timerLight.classList.remove('seanshidethething');;
                    //flashLight.style.background = 'radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 35%)';
                    //flashLight.style.backgroundPosition = '50% -10vh';
                    //flashLight.style.width = '100vh';
                },5000); // 5 seconds
                handleFlickerTimeOut();
            }
        }, 1000 * 20); // 20 seconds
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
