const weatherKey = "b77f0aa180c13145e170900784035320"
const coords = [51.561190,-0.145670]

const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&lat=${coords[0]}&lon=${coords[1]}&appid=${weatherKey}`;

const sitesURLs = ['https://github.com/ZackYounger',
                   'https://hero.highgateschool.org.uk/planner',
                   'https://outlook.office.com/mail/',
                   'https://www.twitch.tv/',
                   'https://twitter.com/',
                   'https://www.youtube.com/'];

const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
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

    document.getElementsByClassName('date-day')[0].innerHTML = weekdays[date.getDay()-1]; //assign day
    document.getElementsByClassName('date-full')[0].innerHTML = date.getDate().toString() + " " + months[date.getMonth()].toString() + " " + date.getFullYear().toString();

    var response = await fetch(weatherURL);
    var data = (await response.json());
    console.log(data);
    var weatherData = data;
    console.log(data);

    document.getElementsByClassName('weather-temp')[0].innerHTML = (Math.round(weatherData['current']['temp']*10)/10).toString() + "°C";
    document.getElementsByClassName('weather-min')[0].innerHTML = Math.round(weatherData['daily'][0]['temp']['min']).toString() + "°C";
    document.getElementsByClassName('weather-max')[0].innerHTML = Math.round(weatherData['daily'][0]['temp']['max']).toString() + "°C";
    document.getElementsByClassName('date-time')[0].innerHTML = 'London, GB';
    document.getElementsByClassName('precipitation')[0].innerHTML = weatherData['current']['precipitation'];

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

    console.log(weatherData)
}


window.onload  = function () {

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
    }

    window.addEventListener('mousemove', mousemove);

    function mouseclick(event) {
        console.log(distance , selectionDistance/2)
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
            console.log("enter");
            redirectLink = "https://www.google.com/search?q=" + search.value.replaceAll(" ","+");
            window.location.href = redirectLink;
        }
    }

    window.addEventListener("keypress", enter);

};
