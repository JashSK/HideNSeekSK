// ==UserScript==
// @name         In the Dark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Smash Karts hide and seek minigame!
// @author       seanysean, JashSK
// @match        https://smashkarts.io/*
// @icon         https://www.google.com/s2/favicons?domain=smashkarts.io
// @grant        none
// ==/UserScript==

// -------------------------------------------------
//
// Proceed with caution, not for the faint of heart.
//
// -------------------------------------------------

//I'm sowry mr. extenshun revuer

(function() {
    'use strict';
    const config = {
        lightningFrequency: 20, // seconds
        wideViewDuration: 5, // seconds
        wideViewSize: 60, // %
        mainFlashlightSize: 40, // %
        itemLightSize: 40, // %
        welcomeSplashTime: 10,
        audioVolume: (localStorage.getItem('HNS-volume') !== null) ? Number(localStorage.getItem('HNS-volume')) : 0.5
    }
    const homeScreen = document.createElement('div');
    homeScreen.classList.add('home-screen', 'hide-item');
    const menuScreen = document.createElement('div');

    const audios /* lol audios */ = [];
    menuScreen.classList.add('menu-screen', 'hide-item');
    menuScreen.id = "menu";
    menuScreen.innerHTML = `
    <div class="menu-inner-border">
        <div class="new-menu-line" style="justify-content:center;">
            <div id="startBtn" class="start-btn" style="text-align:center;">
                <label class="t1">Start</label>
            </div>
        </div>
        <div class="new-menu-line">
            <div id="settingsBtn" class="settings-btn">
                <img src="https://seanysean.github.io/sk-hs-assets/cogwheel.png" style="width:7vh;height:7vh;user-select:none;"></img>
            </div>
            <div id="exitBtn" class="exit-btn">
                <img src="https://seanysean.github.io/sk-hs-assets/x-symbol.png" style="width:7vh;height:7vh;user-select:none;"></img>
            </div>
        </div>
    </div>`;
    const optionsScreen = document.createElement('div');
    optionsScreen.classList.add('menu-screen', 'hide-item');
    optionsScreen.id = "optionsScreen";
    optionsScreen.innerHTML = `
    <div class="menu-inner-border" style="text-align:center;">
        <div class="new-menu-line t2" style="margin-bottom: 3vh;">Volume</div>
        <div class="new-menu-line" style="justify-content:center;">
            <input type="range" min="0" max="1" step="0.01" id="changeVolumeSlider" style="width: 26vh;">
        </div>
        <div class="new-menu-line">
            <div id="reset" class="reset-btn t2">Reset</div>
            <div id="exitBtn2" class="exit-btn">
                <img src="https://seanysean.github.io/sk-hs-assets/x-symbol.png" style="width:7vh;height:7vh;user-select:none;"></img>
            </div>
        </div>
    </div>
    `;

    const welcomeSplash = document.createElement('div');
    const splashTitle = document.createElement('label');
    const splashSubtitle = document.createElement('label');
    const splashContinueText = document.createElement('label');
    welcomeSplash.classList.add('welcomesplash');
    welcomeSplash.appendChild(splashTitle);
    splashSubtitle.classList.add('splash-subtitle');
    splashContinueText.classList.add('splash-text');
    splashTitle.classList.add('splash-title');
    splashTitle.appendChild(document.createTextNode("In the Dark"));
    splashSubtitle.appendChild(document.createTextNode('A Smash Karts Hide \'N Seek Mini Game'));
    splashContinueText.appendChild(document.createTextNode("(click anywhere to continue)"));

    const gameOverlay = document.createElement('div');
    const styleThingy = document.createElement('style');
    const flashLight = document.createElement('div');
    const itemLight = document.createElement('div');
    const timerLight = document.createElement('div');
    const overlayBtn = document.createElement('div');
    const exitBtn = document.createElement('div');
    const musicArray = ['https://seanysean.github.io/sk-hs-assets/Dark_80s_Horror_Music_-_Intruder_Royalty_Free_No_Copyright.mp3', 'https://seanysean.github.io/sk-hs-assets/REPULSIVE_-_Forgotten_COPYRIGHT_FREE_HORROR_MUSIC.mp3'];
    const soundEffectsArray = ['https://seanysean.github.io/sk-hs-assets/lightning.mp3', 'https://seanysean.github.io/sk-hs-assets/lightning2.mp3', 'https://seanysean.github.io/sk-hs-assets/lightning3.mp3'];
    const magnifyingGlass = new Image();
    magnifyingGlass.src = 'https://seanysean.github.io/sk-hs-assets/magnifying-glass-1.png';
    magnifyingGlass.classList.add('magnifying-glass');
    let currentSong;
    let lightningSound;
    let arrayOfTimeouts = [];
    let gameOverlayOn = false;
    gameOverlay.classList.add('game-overlay', 'hide-item');
    flashLight.classList.add('flashlight-main', 'flashlight');
    itemLight.classList.add('flashlight', 'item-light');
    timerLight.classList.add('flashlight', 'timer-light');
    overlayBtn.classList.add('overlay-btn');
    overlayBtn.id = "overlayBtn";
    exitBtn.classList.add('exit-btn', 'exit-btn-reposition', 'hide-item');
    exitBtn.innerHTML = `<img src="https://seanysean.github.io/sk-hs-assets/x-symbol.png" style="width:7vh;height:7vh;"></img>`;
    overlayBtn.appendChild(magnifyingGlass);

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
    #changeVolumeSlider {
        pointer-events: all !important;
    }
    .game-overlay {
        pointer-events: none;
        width: 100%;
        height: 100%;
        background: black;
        position: absolute;
        top: 0;
        mix-blend-mode: hard-light;
    }
    .lightning-strike::after {
        content: "";
        width: 100%;
        height: 100%;
        background: #fff;
        animation: 1s linear fadeout;
        animation-fill-mode: forwards;
        top: 0;
        left: 0;
        position: absolute;
    }
    @keyframes fadeout {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    .flashlight {
        background: gray;
        position: absolute;
    }
    .flashlight::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
    }
    .flashlight-main {
        width: 100vh;
        height: 100vh;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 100%;
    }
    .flashlight-main::after {
        background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 35%);
        background-position: 50% -10vh;
    }
    .item-light {
        width: 31vh;
        height: 31vh;
        bottom: 0;
        right: 0;
    }
    .item-light::after {
        background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 60%);
    }
    .timer-light{
        left: 50%;
        top: 3.7vh;
        width: 11vh;
        height: 6vh;
        transform: translate(-50%);
        margin-left: 16.5vh;
        border-radius: 100%;
    }
    .timer-light::after{
       background: radial-gradient(RGBa(72,71,29,0.4), RGBa(72,71,29,0.4) 10%, #000 71%)
    }
    .hide-item {
        opacity: 0;
        pointer-events: none !important;
        display: none;
    }
    .lightning-view {
        width: 100%;
        height: 100%;
        border: none;
    }
    .lightning-view::after{
        background: radial-gradient(RGBa(0, 245, 249, 0.2), RGBa(0, 245, 249, 0.2) 10%, #000 ${config.wideViewSize}%);
        background-position: 50% -10vh;
    }
    .overlay-btn {
        position: absolute;
        width: 8vh;
        height: 8vh;
        top: 26vh;
        right: -2vh;
        background: black;
        border-radius: 30%;
        border: white solid 0.5vh;
        box-shadow: 0px 0px 0vh black;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000000;
        transform: translate(-50%,-50%);
    }
    .magnifying-glass {
        width: 5vh;
        height: 5vh;
        pointer-events: none;
        user-select: none;
    }
    .home-screen {
        background: radial-gradient(transparent 10%, #000 100%);
        pointer-events: none;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
    }
    .menu-screen{
        position: absolute;
        background: black;
        right: 13vh;
        top: 50%;
        width: 44vh;
        height: 36vh;
        transform: translate(-50%,-50%);
        border-radius: 5%;
        border: RGBa(255, 255, 255, 0.3) solid 0.5vh;
        box-shadow: 0px 0px 15px white;
        padding: 1vh;
        pointer-events: all;
        z-index: 1000000;
    }
    .menu-inner-border{
        width: 100%;
        height: 100%;
        border: 0.5vh RGBa(255, 255, 255, 0.3) solid;
        border-radius: 5%;
        padding: 2vh;
        pointer-events: none;
    }
    .new-menu-line{
        width: 100%;
        margin-bottom: 5vh;
        flex-direction: row;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .t1{
        user-select: none;
        color: white;
        font-size: 6vh;
        font-family:fantasy;
        letter-spacing: 0.7vh;
        display: inline-block;
    }
    .t2{
        user-select: none;
        color: white;
        font-size: 4.5vh;
        font-family:fantasy;
        letter-spacing: 0.1vh;
        display: inline-block;
    }
    .start-btn {
        width: 100%;
        height: 10vh;
        background: RGBa(253,165,15);
        border: 1vh RGBa(233,86,34) solid;
        border-radius: 8%/33%;
        pointer-events:all;
    }
    .settings-btn {
        width: 30%;
        height: 10vh;
        background: RGBa(27,136,240);
        border: 1vh RGB(144,201,255) solid;
        border-radius: 25%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        pointer-events: all;
    }
    .exit-btn {
        width: 30%;
        height: 10vh;
        background: RGBa(230,0,0);
        border: 1vh RGBa(161,0,0) solid;
        border-radius: 25%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        pointer-events:all;
        z-index: 10000000;
    }
    .reset-btn{
        width: 47%;
        height: 10vh;
        background: RGBa(253,165,15);
        border: 1vh RGBa(233,86,34) solid;
        border-radius: 17%/33%;
        pointer-events:all;
        line-height: 7.7vh;
    }
    .exit-btn-reposition {
        position: absolute;
        top: 3vh;
        right: 3vh;
        width: 10vh;
    }
    .splash-title {
        user-select: none;
        color: white;
        font-size: 15vh;
        font-family: fantasy;
        letter-spacing: 0.2vh;
        display: inline-block;
        opacity: 0%;
        position: absolute;
        top: 38vh;
    }
    .splash-subtitle {
        user-select: none;
        position: absolute;
        top: 56vh;
        left: 50%;
        color: RGBa(188, 0, 0);
        font-size: 4vh;
        font-family: fantasy;
        letter-spacing: 0.2vh;
        display: inline-block;
        opacity: 0%;
        transform: translate(-50%);
        text-align: center;
    }
    .splash-text {
        user-select: none;
        position: absolute;
        top: 64vh;
        left: 50%;
        color: RGBa(232, 193, 37);
        font-size: 3vh;
        font-family: fantasy;
        letter-spacing: 0.2vh;
        display: inline-block;
        opacity: 0%;
        animation: pulse-text 5s infinite;
        transform: translate(-50%);
        text-align: center;
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
    }`; // end of style guide

    gameOverlay.appendChild(flashLight);
    gameOverlay.appendChild(itemLight);
    gameOverlay.appendChild(timerLight);
    document.body.appendChild(gameOverlay);
    document.body.appendChild(styleThingy);
    document.body.appendChild(welcomeSplash);
    document.body.appendChild(overlayBtn);
    document.body.appendChild(menuScreen);
    document.body.appendChild(homeScreen);
    document.body.appendChild(optionsScreen);
    document.body.appendChild(exitBtn);
    document.getElementById('changeVolumeSlider').value = config.audioVolume;
    document.getElementById("changeVolumeSlider").addEventListener("change", (e) => {
         console.log(e.target.value);
         config.audioVolume = Number(e.target.value);
         localStorage.setItem('HNS-volume', e.target.value);
         currentSong.volume = config.audioVolume;
    });
    // Start welcome screen
    overlayBtn.addEventListener('click', event => {
        if(startX == endX && startY == endY){
            gameOverlayOn = true;
            overlayBtn.classList.add('hide-item');
            welcomeSplash.classList.add('fade-in-splash');
            currentSong = new Audio(musicArray[1]);
            currentSong.volume = config.audioVolume;
            currentSong.load();
            currentSong.currentTime = 5;
            currentSong.play();
            lightningSound = new Audio(soundEffectsArray[0]);
            lightningSound.volume = config.audioVolume;
            lightningSound.load();
            lightningSound.play();
            var timeout1 = setTimeout(()=>{
                if(gameOverlayOn){
                    splashTitle.classList.add('fade-in-splash-title');
                }
            }, 1000 * 1.5);
            var timeout2 = setTimeout(()=>{
                if(gameOverlayOn){
                    welcomeSplash.appendChild(splashSubtitle);
                    splashSubtitle.classList.add('fade-in-splash-title');
                    console.log("subtitle text appended");
                }
            }, 1000 * 2);
            var timeout3 = setTimeout(()=>{
                if(gameOverlayOn){
                    welcomeSplash.appendChild(splashContinueText);
                    console.log("continue text appended");
                }
            }, 1000 * 8.5);
            welcomeSplash.addEventListener('click', event =>{
                if(gameOverlayOn){
                    clearTimeout(timeout1);
                    clearTimeout(timeout2);
                    clearTimeout(timeout3);
                    welcomeSplash.classList.remove('fade-in-splash');
                    splashTitle.classList.remove('fade-in-splash-title');
                    splashSubtitle.classList.remove('fade-in-splash-title');
                    welcomeSplash.classList.add('fade-out-splash');
                    splashTitle.classList.add('fade-out-splash');
                    splashSubtitle.classList.add('fade-out-splash');
                    splashContinueText.classList.add('fade-out-splash');

                    menuScreen.classList.remove('hide-item');
                    homeScreen.classList.remove('hide-item');
                    document.getElementById("startBtn").addEventListener('click',event =>{
                        overlayBtn.classList.add('hide-item');
                        menuScreen.classList.add('hide-item');
                        homeScreen.classList.add('hide-item');
                        console.log("start clicked");
                        startGame();
                    });
                    document.getElementById("exitBtn").addEventListener('click',event =>{
                        overlayBtn.classList.remove('hide-item');
                        menuScreen.classList.add('hide-item');
                        homeScreen.classList.add('hide-item');
                        currentSong.pause();
                        lightningSound.pause();
                        gameOverlay.classList.add('hide-item');
                        welcomeSplash.classList.remove('fade-in-splash');
                        splashTitle.classList.remove('fade-in-splash-title');
                        welcomeSplash.classList.remove('fade-out-splash');
                        splashTitle.classList.remove('fade-out-splash');
                        splashSubtitle.classList.remove('fade-out-splash');
                        splashContinueText.classList.remove('fade-out-splash');
                        try {
                            welcomeSplash.removeChild(splashContinueText);
                        }
                        catch{
                        }
                        gameOverlayOn = false;
                        endAllTimeouts();
                        console.log("exit overlay");
                    });
                    document.getElementById('settingsBtn').addEventListener('click',()=>{
                        optionsScreen.classList.remove('hide-item');
                        menuScreen.classList.add('hide-item');
                    });
                    document.getElementById('reset').addEventListener('click',()=>{
                        //reset to default settings

                        //Volume
                        config.audioVolume = 0.5;
                        localStorage.setItem('HNS-volume', 0.5);
                        currentSong.volume = config.audioVolume;
                        document.getElementById("changeVolumeSlider").value = 0.5;

                        //Postion of elements
                        document.getElementById('menu').style.left = "auto";
                        document.getElementById('menu').style.top = "50%";
                        localStorage.setItem('menu.pos', ``);

                        document.getElementById('optionsScreen').style.left = "auto";
                        document.getElementById('optionsScreen').style.top = "50%";

                        document.getElementById('overlayBtn').style.left = "auto";
                        document.getElementById('overlayBtn').style.top = "26vh";
                        localStorage.setItem('overlayBtn.pos', ``);
                    });
                    document.getElementById('exitBtn2').addEventListener('click', ()=>{
                        optionsScreen.classList.add('hide-item');
                        menuScreen.classList.remove('hide-item');
                    });
                } // end of if
            }); // end of welcomeSplash event listener
        }// end of if
    }); //end of overlayBtn event listener

    function startGame() {
        gameOverlay.classList.remove('hide-item');
        exitBtn.classList.remove('hide-item');
        currentSong.pause();
        currentSong = new Audio(musicArray[0]);
        currentSong.volume = config.audioVolume;
        currentSong.loop = true;
        currentSong.play();
        exitBtn.addEventListener('click', event =>{
            menuScreen.classList.remove('hide-item');
            homeScreen.classList.remove('hide-item');
            gameOverlay.classList.add('hide-item');
            exitBtn.classList.add('hide-item');
            currentSong.pause();
            lightningSound.pause();
            currentSong = new Audio(musicArray[1]);
            currentSong.volume = config.audioVolume;
            currentSong.load();
            currentSong.currentTime = 5;
            currentSong.play();
            endAllTimeouts();
            console.log("exit game");
        });
        handleFlickerTimeOut();
    }

    function handleFlickerTimeOut() {
        const timeoutInt = setTimeout(()=>{
            if (gameOverlayOn) {
                var rand = getRandomInt(0 , 2)
                console.log(rand);
                lightningSound = new Audio(soundEffectsArray[rand]);
                lightningSound.play();
                lightningSound.volume = config.audioVolume;
                setTimeout(()=>{
                    gameOverlay.classList.add('lightning-strike');
                    flashLight.classList.add('lightning-view');
                    timerLight.classList.add('hide-item');
                }, 100); // .1 seconds
                setTimeout(()=>{
                    gameOverlay.classList.remove('lightning-strike');
                    flashLight.classList.remove('lightning-view');
                    timerLight.classList.remove('hide-item');;
                }, config.wideViewDuration * 1000);
                handleFlickerTimeOut();
            }
        }, 1000 * config.lightningFrequency);
        arrayOfTimeouts.push(timeoutInt);
    } // end of handleFlickerTimeOut

    var dragValue;
    var startX;
    var startY;
    var endX;
    var endY;
    function move(id){
        dragValue = document.getElementById(id);
        console.log("Drag value: " + dragValue.id);
        startX = dragValue.getBoundingClientRect().x;
        startY = dragValue.getBoundingClientRect().y;
        console.log("X: " + startX + " Y: " + startY);
    }

    document.addEventListener("mousemove", event=>{
        var x = event.pageX;
        var y = event.pageY;
        //console.log("mouse x at: " + x);
        //console.log("mouse y at: " + y);
        if(dragValue != null){
            if (x - (dragValue.offsetWidth / 2) < 0) { // || () || (x + (dragValue.offsetWidth / 2) > window.innerWidth) || ( {
                x = 0 + (dragValue.offsetWidth / 2);
            } else if (x + (dragValue.offsetWidth / 2) > window.innerWidth) {
                x = window.innerWidth - (dragValue.offsetWidth / 2);
            }
            if (y - (dragValue.offsetHeight / 2) < 0) {
                y = 0 + (dragValue.offsetHeight / 2);
            } else if (y + (dragValue.offsetHeight / 2) > window.innerHeight) {
                y = window.innerHeight - (dragValue.offsetHeight / 2);
            }
            const responsivePos = convertPixelsToResponsiveValue([x,y]);
            dragValue.style.left = responsivePos[0];
            dragValue.style.top = responsivePos[1];
            localStorage.setItem(dragValue.id + '.pos', `${responsivePos[0]},${responsivePos[1]}`);
            if(dragValue.id == 'menu'){
                document.getElementById('optionsScreen').style.left = responsivePos[0];
                document.getElementById('optionsScreen').style.top = responsivePos[1];
                //localStorage.setItem('optionsScreen.pos', `${responsivePos[0]},${responsivePos[1]}`);
            }
            if(dragValue.id == 'optionsScreen'){
                document.getElementById('menu').style.left = responsivePos[0];
                document.getElementById('menu').style.top = responsivePos[1];
                localStorage.setItem('menu.pos', `${responsivePos[0]},${responsivePos[1]}`);
            }
        }
    });

    overlayBtn.addEventListener('mousedown', event=>{
        console.log("overlay Button mousedown");
        move('overlayBtn');
    });

    menuScreen.addEventListener('mousedown', event=>{
        move('menu');
    });

    document.getElementById('reset').addEventListener('mouseover', event=>{
        console.log("reset button hovered");
    });

    document.addEventListener("mouseup", event=>{
        endX = dragValue.getBoundingClientRect().x;
        endY = dragValue.getBoundingClientRect().y;
        console.log("X: " + endX + " Y: " + endY);
        dragValue = null;
    });

    function endAllTimeouts() {
        arrayOfTimeouts.forEach(t=>{
            clearTimeout(t);
        });
        arrayOfTimeouts = [];
    } // end of endAllTimeouts

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    } // end of getRandomInt

    if (localStorage.getItem('overlayBtn.pos')) {
        const coords = localStorage.getItem('overlayBtn.pos').split(',');
        overlayBtn.style.left = coords[0];
        overlayBtn.style.top = coords[1];
    }
    if (localStorage.getItem('menu.pos')) {
        const coords = localStorage.getItem('menu.pos').split(',');
        menuScreen.style.left = coords[0];
        menuScreen.style.top = coords[1];
        optionsScreen.style.left = coords[0];
        optionsScreen.style.top = coords[1];
    }

    function convertPixelsToResponsiveValue(values) {
        const x = ((values[0] * 100) / window.innerWidth) + 'vw';
        const y = ((values[1] * 100) / window.innerHeight) + 'vh';
        return [x,y];
    }
})();
