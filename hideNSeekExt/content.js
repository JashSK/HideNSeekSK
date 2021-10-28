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
        <div class="new-menu-line" style="justify-content:center; margin-bottom:2vh;">
            <div id="startBtn" class="start-btn" style="text-align:center;">
                <label class="t1">Start</label>
            </div>
        </div>
        <div class="new-menu-line" style="justify-content:center; margin-bottom:2vh;">
            <div id="instructionsBtn" class="slim-blue-btn" style="text-align:center;">
                <label class="t3">How to Setup</label>
            </div>
        </div>
        <div class="new-menu-line" style="justify-content:center; margin-bottom:3vh;">
            <div id="creditsBtn" class="slim-blue-btn" style="text-align:center;">
                <label class="t3">Credits</label>
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
        <div class="new-menu-line t1" style="margin-bottom: 5vh;letter-spacing: 0.1vh;">Settings</div>
        <div class="new-menu-line t2" style="margin-bottom: 3vh;">Volume</div>
        <div class="new-menu-line" style="justify-content:center;margin-bottom:7vh;">
            <input type="range" min="0" max="1" step="0.01" id="changeVolumeSlider" style="width: 26vh;">
        </div>
        <div class="new-menu-line">
            <div id="reset" class="reset-btn t2">Reset</div>
            <div id="checkmarkBtn" class="checkmark-btn">
                <img src="${chrome.runtime.getURL("/assets/images/game-images/checkmark.png")}" style="width:7vh;height:7vh;user-select:none;"></img>
            </div>
        </div>
    </div>
    `;

    
    const instructionsScreen = document.createElement('div');
    instructionsScreen.classList.add('instructions-screen','hide-item');
    instructionsScreen.id = "instructions";
    instructionsScreen.innerHTML = `
        <div class="menu-inner-border">
        <div class="new-menu-line t1" style="margin-bottom: 5vh; text-align:center; letter-spacing: 0.1vh;">How To Setup</div>
        <div class="new-menu-line" style="justify-content:start; margin-bottom: 1vh;width:100%;align-items:start">
            <div style="width: 50%;">
                <label class="t3" style="margin-bottom: 2vh;">1.) Join or create a private room</label>
                <div style="justify-content: center; display: flex; margin-left: -4vh;">
                    <img src="${chrome.runtime.getURL("/assets/images/game-images/room-code.jpg")}" style="width:80%;user-select:none;border-radius:1vh;"></img>
                </div>
            </div>
            <div style="width: 50%;">
                <label class="t3" style="margin-bottom: 2vh;">2.) Switch to "Close" camera view</label>
                <div style="justify-content: center; display: flex; margin-left: -4vh; margin-bottom: 2vh;">
                    <img src="${chrome.runtime.getURL("/assets/images/game-images/close-camera1.jpg")}" style="width:80%;user-select:none;border-radius:3vh;"></img>
                </div>
                <label class="t3" style="margin-bottom: 2vh;">3.) Start overlay from menu!</label>
                <div style="justify-content: center; display: flex; margin-left: -6vh;">
                    <img src="${chrome.runtime.getURL("/assets/images/game-images/click-start.jpg")}" style="width:60%;user-select:none;"></img>
                </div>
            </div> 
        </div>
        <div class="new-menu-line" style="justify-content:space-around; margin-top: 6vh;">
            <a href="https://youtu.be/gi5UTJ3_EY8" class="slim-blue-btn" target="_blank" style="text-decoration:none;pointer-events:all;text-align:center; width: 35%; height: 10vh;background: RGBa(253,165,15);border: 1vh RGBa(233,86,34) solid;">
                <label class="t3" style="pointer-events:all;">Go To Explanation Video</label>
            </a>
            <div id="setupBackBtn" class="slim-blue-btn" style="text-align:center; width: 30%;">
                <label class="t2">Go Back</label>
            </div>
        </div>
        </div>`;

    const creditsScreen = document.createElement('div');
    creditsScreen.classList.add('credits-screen','hide-item');
    creditsScreen.id = "credits";
    creditsScreen.innerHTML = `
        <div class="menu-inner-border">
        <div class="new-menu-line t1" style="margin-bottom: 2vh; text-align:center; letter-spacing: 0.1vh;">Credits</div>
        <div class="new-menu-line" style="justify-content:center; margin-bottom: 2vh;width:100%;align-items:start">
            <label class="t2">Developers</label>
        </div>
        <div class="new-menu-line" style="justify-content:space-around; margin-left: 1vh; margin-bottom: 1vh;width:100%;align-items:center">
            <a href="https://www.youtube.com/channel/UCnb2FsAV8vKZy-YYN85ZMiw" target="_blank" style="color:RGBa(18, 105, 255);pointer-events:all;display: flex;flex-direction: column;justify-content: center;align-items:center;">
                <div class="t3" style="margin-bottom:1vh;color:RGBa(18, 105, 255);">JashSK</div>
                <img src="https://yt3.ggpht.com/ytc/AKedOLRgfBT0GuDoCdkzNGJdBYNEmX3eGrIE9nQsUbNR=s88-c-k-c0x00ffffff-no-rj" style="width:11vh;border-radius: 50%;"></img>
            </a>
            <a href="https://www.youtube.com/channel/UCNIqfp1ZUfVfjh-FBoNDu8w" target="_blank" style="color:RGBa(18, 105, 255);pointer-events:all;display: flex;flex-direction: column;justify-content: center;align-items:center;">
                <div class="t3" style="margin-bottom:1vh;color:RGBa(18, 105, 255);">SeanySean</div>
                <img src="https://yt3.ggpht.com/ytc/AKedOLRuTAJ1rX8pPDuMrPLMW8LvYVzKF1LVq4dnm5k=s88-c-k-c0x00ffffff-no-rj" style="width:11vh;border-radius: 50%;"></img>
            </a>
        </div>
        <div class="new-menu-line" style="justify-content:center; margin-bottom: 2vh;width:100%;align-items:start">
            <label class="t2">Music</label>
        </div>
        <div class="new-menu-line" style="justify-content:center; margin-bottom: 2vh;width:100%;align-items:start">
            <label style="text-align:center;">
                <a href="https://www.youtube.com/watch?v=pc2MbqAFf7U&list=PLtVY5E-1y01h01JRTqZHCEDDLoC6OJSq7&index=26" target="_blank" class="t3" style="color:RGBa(18, 105, 255);pointer-events:all;">Forgotten</a>
                <label class="t3"> by </label>
                <label><a href="https://soundcloud.com/repulsivesound/" class="t3" target="_blank" style="color:RGBa(18, 105, 255);pointer-events:all;">REPULSIVE</a></label>
            </label>
        </div>
        <div class="new-menu-line" style="justify-content:center; margin-bottom: 4vh;width:100%;align-items:start">
            <label style="text-align:center;">
                <a href="https://www.youtube.com/watch?v=MA_a4UjKRG8&list=PLtVY5E-1y01h01JRTqZHCEDDLoC6OJSq7&index=25" target="_blank" class="t3" style="color:RGBa(18, 105, 255);pointer-events:all;">Intruder</a>
                <label class="t3"> by Karl Casey @ </label>
                <label><a href="https://whitebataudio.com/" class="t3" target="_blank" style="color:RGBa(18, 105, 255);pointer-events:all;">White Bat Audio</a></label>
            </label>
        </div>
        <div class="new-menu-line" style="justify-content:center;">
            <div id="creditsBackBtn" class="slim-blue-btn" style="text-align:center; width: 40%; height: 7vh;">
                <label class="t3">Go Back</label>
            </div>
        </div>
        </div>`;
    

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
    document.body.appendChild(instructionsScreen);
    document.body.appendChild(creditsScreen);
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
                    document.getElementById('instructionsBtn').addEventListener('click',()=>{
                        instructionsScreen.classList.remove('hide-item');
                        menuScreen.classList.add('hide-item');
                    });
                    document.getElementById('creditsBtn').addEventListener('click',()=>{
                        creditsScreen.classList.remove('hide-item');
                        menuScreen.classList.add('hide-item');
                    });
                    document.getElementById('settingsBtn').addEventListener('click',()=>{
                        optionsScreen.classList.remove('hide-item');
                        menuScreen.classList.add('hide-item');
                    });
                    document.getElementById('setupBackBtn').addEventListener('click',()=>{
                        menuScreen.classList.remove('hide-item');
                        instructionsScreen.classList.add('hide-item');
                    });
                    document.getElementById('creditsBackBtn').addEventListener('click',()=>{
                        menuScreen.classList.remove('hide-item');
                        creditsScreen.classList.add('hide-item');
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
                    document.getElementById('checkmarkBtn').addEventListener('click', ()=>{
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

    /*function handleFlickerTimeOut() {
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
    } // end of handleFlickerTimeOut*/

    function handleFlickerTimeOut() {
        const d = new Date();
	    const currentMilliseconds = d.getUTCSeconds() * 1000 + d.getUTCMilliseconds();
	    const timeTillNextEvent = 20000 - (currentMilliseconds % 20000);
	    const timeoutInt = setTimeout(() => {
            lightningStrike();
	    }, timeTillNextEvent);
        arrayOfTimeouts.push(timeoutInt);
    }

    function lightningStrike() {
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
    }

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
            dragValue.style.top = (parseInt(responsivePos[1].substring(0, responsivePos[1].indexOf('v') - 1)) + 4).toString() + "vh";
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