const weatherKey = "b77f0aa180c13145e170900784035320"
const coords = [51.561190,-0.145670]

const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&lat=${coords[0]}&lon=${coords[1]}&appid=${weatherKey}`;

const sitesURLs = ['https://github.com/ZackYounger',
                   'https://www.youtube.com/',
                   'https://twitter.com/',
                   'https://www.twitch.tv/',
                   'https://hero.highgateschool.org.uk/planner',
                   'https://outlook.office.com/mail/'];

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const weekdaysShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const subjects = ['pure','stats','mech','physics','compsci','else'];
var subjectIndex = -1;

const root = document.querySelector(':root');

let closest;
let distance;
let containersX;
let accContainersX;
let pushDistance;
let highlightDistance = 400;
let selectionDistance = 80;
let selectorMenuOffset = 8;
let selectorOffset = 0;
let search;
let workMode = false;

let pushData = [];

//calendar
let calendarContainer;
let calendarButton;

let weatherContainer;

async function doWeather() {

    const date = new Date();

    document.getElementsByClassName('date-day')[0].innerHTML = weekdays[date.getDay()]; //assign day
    document.getElementsByClassName('date-full')[0].innerHTML = date.getDate().toString() + " " + months[date.getMonth()].toString() + " " + date.getFullYear().toString();

    var response = await fetch(weatherURL);
    var data = (await response.json());
    var weatherData = data;


    //collate data

    var dayButtons = document.getElementsByClassName('week-list')[0];
    let i = 0;
    for (day of dayButtons.getElementsByTagName('li')) {
        const dayData = {};
        dayData['fullDay'] = weekdaysShort[(date.getDay()+i)%weekdays.length];
        dayData['shortDay'] = weekdaysShort[(date.getDay()+i)%weekdaysShort.length];
        dayData['temp'] = Math.round(weatherData['daily'][i]['temp']['day']).toString() + "??C";
        dayData['tempMax'] = Math.round(weatherData['daily'][i]['temp']['max']).toString() + "??C";
        dayData['tempMin'] = Math.round(weatherData['daily'][i]['temp']['min']).toString() + "??C";
        dayData['precipitation'] = (weatherData['daily'][i]['pop']*100).toString() + "%";
        dayData['humidity'] = (weatherData['daily'][i]['humidity']).toString() + "%";
        dayData['windspeed'] =weatherData['daily'][i]['wind_speed'].toString() + " m/s";

        pushData.push(dayData);

        day.getElementsByClassName('day-name')[0].innerHTML = dayData['shortDay'];
        day.getElementsByClassName('min-temp')[0].innerHTML = dayData['tempMin'];
        day.getElementsByClassName('max-temp')[0].innerHTML = dayData['tempMax'];
        i++;
    }


    document.getElementsByClassName('weather-temp')[0].innerHTML = (Math.round(weatherData['current']['temp']*10)/10).toString() + "??C";
    document.getElementsByClassName('date-time')[0].innerHTML = 'London, GB';
    document.getElementsByClassName('value precipitation')[0].innerHTML = weatherData['daily'][0]['pop'].toString() + "%";
    document.getElementsByClassName('value humidity')[0].innerHTML = weatherData['current']['humidity'].toString() + "%";
    document.getElementsByClassName('value windspeed')[0].innerHTML = weatherData['current']['wind_speed'].toString() + " m/s";

    const mySentence = weatherData['current']['weather'][0]['description'];
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    newWords = words.join(" ");

    document.getElementsByClassName('weather-desc')[0].innerHTML = newWords;

    weatherElements[0].innerHTML = outputTemp.toString();
    weatherElements[1].innerHTML = weatherData[0]['dt_txt'];

    var weatherIcon = document.getElementById('icon1');
}


function updateWeatherStats (stats) {
    document.getElementsByClassName('value precipitation')[0].innerHTML = stats['precipitation'];
    document.getElementsByClassName('value humidity')[0].innerHTML = stats['humidity'];
    document.getElementsByClassName('value windspeed')[0].innerHTML = stats['windspeed'];

}


window.onload  = function () {

    //calendar
    calendarContainer = document.getElementsByClassName('graph')[0];
    calendarButton = document.getElementsByClassName('calendar-button')[0];

    //weather elements
    const dayButtons = document.getElementsByClassName('dayButton');
    const activeDayButton = dayButtons[0];
    weatherContainer = document.getElementsByClassName('main-weather-container')[0];

    //url selector elements
    const selectorMenu = document.getElementsByClassName('selectorMenu')[0];
    const selector = document.getElementById('selector');
    const selectorData = selector.getBoundingClientRect();
    const containers = document.getElementsByClassName('svg-container leisure');
    const workContainers = document.getElementsByClassName('svg-container work');

    const search = document.getElementsByClassName('searchbar2')[0];

    const workSelectorMenu = document.getElementsByClassName('selectorMenu')[1];

    doWeather();

    selector.style.transition = '0ms';
    root.style.setProperty('--distanceSelector', "0%");

    containersX = containers[0].getBoundingClientRect().x + containers[0].getBoundingClientRect().width/2 - selectorData.width/2;
    accContainersX = containersX + selectorData.width/2;
    const containerHeight = containers[0].getBoundingClientRect().height;

    const containerCoords = [];
    for (container of containers) {
        const data = container.getBoundingClientRect();
        containerCoords.push(data.y + data.height - selectorData.height/2 - 10);

    }



    function mousemove(event) {
        selector.style.transition = '200ms';

        closest = containerCoords.reduce((a, b) => {
            return Math.abs(b - event.clientY) < Math.abs(a - event.clientY) ? b : a;
        });


        root.style.setProperty('--selectorX', containersX.toString() + "px");
        root.style.setProperty('--selectorY', (closest - containerHeight/2 + 10).toString() + "px");

        distance = (Math.abs(event.clientX - accContainersX));
        //if (distance < highlightDistance && !(workMode)) {
        if (distance < highlightDistance) {
            pushDistance = (highlightDistance - distance)/(highlightDistance/100);
        } else {
            pushDistance = 0;
        }
        root.style.setProperty('--distanceSelector', pushDistance.toString() + "%");

        root.style.setProperty('--mouseX', event.clientX.toString() + "px");
        root.style.setProperty('--mouseY', event.clientY.toString() + "px");


        // incoming jank
        dayButtons[0].onclick = function () {
            for (button of dayButtons) {button.classList.remove('active')}
            dayButtons[0].classList.add('active')
            updateWeatherStats(pushData[0])
        }
        dayButtons[1].onclick = function () {
            for (button of dayButtons) {button.classList.remove('active')}
            dayButtons[1].classList.add('active')
            updateWeatherStats(pushData[1])
        }
        dayButtons[2].onclick = function () {
            for (button of dayButtons) {button.classList.remove('active')}
            dayButtons[2].classList.add('active')
            updateWeatherStats(pushData[2])
        }
        dayButtons[3].onclick = function () {
            for (button of dayButtons) {button.classList.remove('active')}
            dayButtons[3].classList.add('active')
            updateWeatherStats(pushData[3])
        }

    }
    window.addEventListener('mousemove', mousemove);


    function mouseclick(event) {
        if (distance < selectionDistance) {
            const index = containerCoords.indexOf(closest);
            if (!workMode) {
                const redirectLink = sitesURLs[index];
                window.location.href = redirectLink;
            } else {
                for (container of workContainers) {
                    container.style.background = 'transparent';
                }
                workContainers[index].style.background = 'blue';
                subjectIndex = index
            }
        }

        calendarButton.onclick = function () {
            if (!workMode) {
                workMode = true
                startTime = Math.round(Date.now() / 1000)
                calendarButton.style.background = 'green';
                refreshTimeWorked = setInterval(updateTimeWorked, 1000);

                selectorMenu.style.right = '-15%';
                workSelectorMenu.style.right = '8%';
                weatherContainer.style.marginLeft = '-600px';

            } else if (subjectIndex >= 0) {
                workMode = false

                selectorMenu.style.right = '8%';
                workSelectorMenu.style.right = '-15%';
                weatherContainer.style.marginLeft = '0px';

                calendarButton.style.background = 'red';
                setTimeout(function () {
                    root.style.setProperty('--distanceSelector', "30%");
                }, 800)
                calendarButton.innerHTML = 'Start';

                clearInterval(refreshTimeWorked)
                endTime = Math.round(Date.now() / 1000)
                duration = endTime - startTime

                if (duration > 10) { //allows for accidental clicks within 10 secs
                    const request = new XMLHttpRequest()
                    request.open(`POST`, `/receiveData/${[duration, subjects[subjectIndex]]}`)
                    request.send()
                    console.log('send data')
                }
            } else {
                alert('select a subject!')
            }
        }

    }
    window.addEventListener('mousedown',mouseclick);

    function enter(event) {
        if (event.key === "Enter") {
            redirectLink = "https://www.google.com/search?q=" + search.value.replaceAll(" ","+");
            window.location.href = redirectLink;
        }
    }
    window.addEventListener("keypress", enter);


    function resize() {
        containersX = containers[0].getBoundingClientRect().x + containers[0].getBoundingClientRect().width/2 - selectorData.width/2;
        accContainersX = containersX + selectorData.width/2;

        if (window.innerWidth > 1850) {
            calendarContainer.style.opacity = '100%';
        } else {
            calendarContainer.style.opacity = '0%'
        }
    }
    window.addEventListener('resize',resize)
    resize();
};
