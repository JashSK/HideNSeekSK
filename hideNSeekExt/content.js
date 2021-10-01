// ==UserScript==
// @name         In the Dark
// @version      0.1
// @description  Smash Karts hide and seek minigame!
// @author       seanysean, JashSK
// @match        https://smashkarts.io/*
// ==/UserScript==

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
                <img src="${chrome.runtime.getURL("/assets/images/game-images/cogwheel.png")}" style="width:7vh;height:7vh;user-select:none;"></img>
            </div>
            <div id="exitBtn" class="exit-btn">
                <img src="${chrome.runtime.getURL("/assets/images/game-images/x-symbol.png")}" style="width:7vh;height:7vh;user-select:none;"></img>
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
                <img src="${chrome.runtime.getURL("/assets/images/game-images/x-symbol.png")}" style="width:7vh;height:7vh;user-select:none;"></img>
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
    const flashLight = document.createElement('div');
    const itemLight = document.createElement('div');
    const timerLight = document.createElement('div');
    const overlayBtn = document.createElement('div');
    const exitBtn = document.createElement('div');
    const musicArray = [chrome.runtime.getURL("/assets/music/Intruder.mp3"), chrome.runtime.getURL("/assets/music/Repulsive.mp3")];
    const soundEffectsArray = [chrome.runtime.getURL("/assets/sounds/lightning1.mp3"), chrome.runtime.getURL("/assets/sounds/lightning2.mp3"), chrome.runtime.getURL("/assets/sounds/lightning3.mp3")];
    const flashLightIcon = new Image();
    flashLightIcon.src = chrome.runtime.getURL('/assets/images/icons/flashlight128.png');
    flashLightIcon.classList.add('flashlight-icon');
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
    exitBtn.innerHTML = `<img src="${chrome.runtime.getURL("/assets/images/game-images/x-symbol.png")}" style="width:7vh;height:7vh;"></img>`;
    overlayBtn.appendChild(flashLightIcon);

    /*
    let root = document.documentElement;
    root.style.setProperty('--lightning-animation-timerLight', config.wideViewDuration);
    root.style.setProperty('--wideview-size', config.wideViewSize);
    */

    gameOverlay.appendChild(flashLight);
    gameOverlay.appendChild(itemLight);
    gameOverlay.appendChild(timerLight);
    document.body.appendChild(gameOverlay);
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
                    //flashLight.classList.add('lightning-view');
                    //timerLight.classList.add('hide-item');
                }, 100); // .1 seconds
                setTimeout(()=>{
                    gameOverlay.classList.remove('lightning-strike');
                    //flashLight.classList.remove('lightning-view');
                    //timerLight.classList.remove('hide-item');
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
        try{
            startX = dragValue.getBoundingClientRect().x;
            startY = dragValue.getBoundingClientRect().y;
        }
        catch (e){
            console.log(e);
        }
        
        console.log("X: " + startX + " Y: " + startY);
    }

    document.addEventListener("mousemove", event=>{
        var x = event.pageX;
        var y = event.pageY;
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
        try{
            endX = dragValue.getBoundingClientRect().x;
            endY = dragValue.getBoundingClientRect().y;
        }
        catch (e) {
            console.log(e);
        }
        
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