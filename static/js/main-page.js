const root = document.querySelector(':root');

const sitesURLs = ['https://github.com/ZackYounger',
                   'https://hero.highgateschool.org.uk/planner',
                   'https://outlook.office.com/mail/',
                   'https://www.twitch.tv/',
                   'https://twitter.com/',
                   'https://www.youtube.com/'];

var closest;
var distance;
var pushDistance;
var highlightDistance = 400;
var selectionDistance = 80;
var search;

window.onload  = function () {
    const selectorMenu = document.getElementById('selectorMenu');
    const selector = document.getElementById('selector');
    const selectorData = selector.getBoundingClientRect();
    const containers = document.getElementsByClassName('svg-container');
    search = document.getElementsByClassName('searchbar2')[0];

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
        console.log('enter unction')
        if (event.key === "Enter") {
            console.log("enter")
            redirectLink = "https://www.google.com/search?q=" + search.value.replaceAll(" ","+")
            window.location.href = redirectLink;
        }
    }

    window.addEventListener("keypress", enter);
};
