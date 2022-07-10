function updateCalendar(pullData) {
    today = new Date();
    const daysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31];
    todayIndex = today.getDate() - 1;
    for (var i=0;i<today.getMonth();i++) {
        todayIndex += daysInMonths[i];
    }
    //dataIndex = 364
    const squares = document.querySelector('.squares');
    for (var i = 1; i < 365; i++) {
        score = pullData[i]['score'];
        //score = 0.7166666666666667
        console.log(score)

        if (i == todayIndex) {
            color = '0047AB';
        } else if (0 <= score && score < 0.5) {
            color = 'FF0000FF';
        } else if (0.5 <= score && score < 1) {
            //console.log('set yellow')
            color = 'FF8C00FF';
        } else if (1 <= score && score < 1.5){
            color = '008000FF';
        } else if (1.5 <= score) {
            color = '8A2BE2FF';
        } else {
            color = '000000';
        }
        if (i <= todayIndex) {
            squares.insertAdjacentHTML('beforeend', `<li style="background: ${'#' + color}"></li>`);
        } else {
            squares.insertAdjacentHTML('beforeend', `<li style="border: darkslategray 1px solid;"></li>`);
        }
    }
}


function updateTimeWorked() {
    timePassed = Math.round(Date.now() / 1000) - startTime
    minutesPassed = Math.floor(timePassed / 60)
    formattedTime = '0' + Math.floor(minutesPassed / 60).toString() + ':' + (minutesPassed % 60).toString().padStart(2,'0');
    calendarButton.innerHTML = formattedTime
}