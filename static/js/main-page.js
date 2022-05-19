let x = 0;
let startGame;
startGame = false;
let intervalCount = 0;
const buttonNames = ['play','profile','about','settings','x','y'];

var root = document.querySelector(':root');

window.onload  = function () {
    var window = document.getElementById("window");
    var ul = document.getElementsByTagName('ul')[0];
    var liList = document.getElementsByTagName('li');
    var orbit = document.getElementById('orbit');
    var dict = {};

    //build dictionary
    for (let i=0;i<6;i++) {
        dict[buttonNames[i]] = liList[i];
    }
    console.log(dict);

    //opening animation
    for (let j=0;j<6;j++) {
        setTimeout(function () {
            liList[j].classList.toggle('pushObject-' + buttonNames[j]);
        }, 100 * j);
    }


    setInterval(function () {

        dict['settings'].onclick = function (e) {
            //dict['settings'].classList.toggle('pushObject-settings');
            orbit.classList.toggle('redirect-orbit');
            //pause rotation
            const running = ul.style.animationPlayState === 'paused';
            ul.style.animationPlayState = running ? 'running' : 'paused';
            for (let j=0;j<6;j++) {
                for (let i=0;i<2;i++) {
                    liList[j].children[i].style.animationPlayState = running ? 'running' : 'paused';
                }
            }
            var settingsCoords = dict['settings'].getBoundingClientRect();
            var windowCoords = window.getBoundingClientRect();
            const currentAngle = Math.atan((settingsCoords.top - windowCoords.top)/(settingsCoords.left - windowCoords.left));
            console.log(currentAngle*(180/Math.PI));
            root.style.setProperty('--windowTranslateX','250px');
            root.style.setProperty('--windowRotate',(-currentAngle).toString()+'rad');
            console.log(currentAngle.toString()+'rad');
        };

        //pause rotation
        window.onclick = function () {
            orbit.classList.toggle('redirect-orbit');
            window.classList.toggle('redirect-window');
            const running = ul.style.animationPlayState === 'paused';
            ul.style.animationPlayState = running ? 'running' : 'paused';
            for (let j=0;j<6;j++) {
                for (let i=0;i<2;i++) {
                    liList[j].children[i].style.animationPlayState = running ? 'running' : 'paused';
                }
            }
        };

    },10);
};