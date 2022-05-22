const weatherKey = "b77f0aa180c13145e170900784035320"
const coords = [51.561190,-0.145670]

const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&lat=${coords[0]}&lon=${coords[1]}&appid=${weatherKey}`;

const sitesURLs = ['https://github.com/ZackYounger',
                   'https://hero.highgateschool.org.uk/planner',
                   'https://outlook.office.com/mail/',
                   'https://www.twitch.tv/',
                   'https://twitter.com/',
                   'https://www.youtube.com/'];

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const weekdaysShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];


const root = document.querySelector(':root');

var closest;
var distance;
var pushDistance;
var highlightDistance = 400;
var selectionDistance = 80;
var search;

async function doWeather() {

    const date = new Date();

    document.getElementsByClassName('date-day')[0].innerHTML = weekdays[date.getDay()]; //assign day
    document.getElementsByClassName('date-full')[0].innerHTML = date.getDate().toString() + " " + months[date.getMonth()].toString() + " " + date.getFullYear().toString();

    var response = await fetch(weatherURL);
    var data = (await response.json());
    var weatherData = data;


    //collate data
    var pushData = [];

    var dayButtons = document.getElementsByClassName('week-list')[0];
    let i = 0;
    for (day of dayButtons.getElementsByTagName('li')) {
        const dayData = {};
        dayData['fullDay'] = weekdaysShort[(date.getDay()+i)%weekdays.length];
        dayData['shortDay'] = weekdaysShort[(date.getDay()+i)%weekdaysShort.length];
        dayData['temp'] = Math.round(weatherData['daily'][i]['temp']['day']).toString() + "°C";
        dayData['tempMax'] = Math.round(weatherData['daily'][i]['temp']['max']).toString() + "°C";
        dayData['tempMin'] = Math.round(weatherData['daily'][i]['temp']['min']).toString() + "°C";
        dayData['precipitation'] = (weatherData['daily'][i]['pop']*100).toString() + "%";
        dayData['humidity'] = (weatherData['daily'][i]['humidity']*100).toString() + "%";
        dayData['windspeed'] =weatherData['daily'][i]['wind_speed'].toString() + " m/s";

        pushData.push(dayData);

        day.getElementsByClassName('day-name')[0].innerHTML = dayData['shortDay'];
        day.getElementsByClassName('min-temp')[0].innerHTML = dayData['tempMin'];
        day.getElementsByClassName('max-temp')[0].innerHTML = dayData['tempMax'];
        i++;
    }

    console.log(pushData);

    document.getElementsByClassName('weather-temp')[0].innerHTML = (Math.round(weatherData['current']['temp']*10)/10).toString() + "°C";
    //document.getElementsByClassName('weather-bound min-temp')[0].innerHTML = Math.round(weatherData['daily'][0]['temp']['min']).toString() + "°C";
    //document.getElementsByClassName('weather-bound max-temp')[0].innerHTML = Math.round(weatherData['daily'][0]['temp']['max']).toString() + "°C";
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


window.onload  = function () {

    //weather elements
    dayButtons = document.getElementsByClassName('dayButton');
    activeDayButton = dayButtons[0];
    console.log(dayButtons)

    //url selector elements
    const selectorMenu = document.getElementById('selectorMenu');
    const selector = document.getElementById('selector');
    const selectorData = selector.getBoundingClientRect();
    const containers = document.getElementsByClassName('svg-container');
    search = document.getElementsByClassName('searchbar2')[0];

    doWeather();

    selector.style.transition = '0ms';
    root.style.setProperty('--distanceSelector', "0%");

    var containersX = containers[0].getBoundingClientRect().x + containers[0].getBoundingClientRect().width/2 - selectorData.width/2;
    var accContainersX = containersX + selectorData.width/2;
    const containerHeight = containers[0].getBoundingClientRect().height;

    const containerCoords = [];
    for (container of containers) {
        const data = container.getBoundingClientRect();
        containerCoords.push(data.y + data.height - selectorData.height/2 - 10);
    }

    function mousemove(event) {
        selector.style.transition = '200ms';
        //if (event != null) {
            //console.log(
            //    "clientX: ", event.clientX,
            //    "clientY:", event.clientY);
            //}

        closest = containerCoords.reduce((a, b) => {
            return Math.abs(b - event.clientY) < Math.abs(a - event.clientY) ? b : a;
        });


        root.style.setProperty('--selectorX', containersX.toString() + "px");
        root.style.setProperty('--selectorY', (closest - containerHeight/2 + 10).toString() + "px");

        distance = (Math.abs(event.clientX - accContainersX));
        if (distance < highlightDistance) {
            pushDistance = (highlightDistance - distance)/(highlightDistance/100);
        } else {
            pushDistance = 0;
        }
        root.style.setProperty('--distanceSelector', pushDistance.toString() + "%");

        root.style.setProperty('--mouseX', event.clientX.toString() + "px");
        root.style.setProperty('--mouseY', event.clientY.toString() + "px");



        //selecting Day for weather
        for (i=0;i<3;i++) {
            dayButtons[i].onclick = function() {
                console.log(dayButtons[i])
                dayButtons[i].classList.add('active')
            }
        }
    }
    window.addEventListener('mousemove', mousemove);


    function mouseclick(event) {
        if (distance < selectionDistance) {
            const index = containerCoords.indexOf(closest);
            const redirectLink = sitesURLs[index];
            window.location.href = redirectLink;
        }
    }
    window.addEventListener('mousedown',mouseclick);

    function enter(event) {
        console.log('enter unction');
        if (event.key === "Enter") {
            redirectLink = "https://www.google.com/search?q=" + search.value.replaceAll(" ","+");
            window.location.href = redirectLink;
        }
    }
    window.addEventListener("keypress", enter);
};
