from flask import *
import csv
from datetime import date
import datetime

app = Flask(__name__)

subjects = ['pure','stats','mech','physics','compsci','else']

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        pass
    else:
        pushData = getData()
        print(pushData)
        # for entry in pushData:
        #    print(entry)
        return render_template("main-page.html", data=pushData)


@app.route('/receiveData/<string:data>', methods=['POST'])
def receiveData(data):
    data = data.split(',')
    time, subject = int(data[0]),data[1]
    time = time / 60
    year, month, day = str(date.today()).split('-')
    year, month, day = int(year), int(month), int(day)
    index = dateToIndex(day,month)
    calendarData = getData()
    calendarData[index][subject] += time

    print(calendarData[dateToIndex(25,6)])
    print(sum(int(calendarData[dateToIndex(25,6)][subj]) for subj in subjects))
    print([int(calendarData[dateToIndex(25, 6)][subj]) for subj in subjects])
    print([subj for subj in subjects])
    print(calendarData[dateToIndex(25, 6)]['pure'])
    calendarData[dateToIndex(25, 6)[subjects[0]]]

    for index,entry in enumerate(calendarData):
        calendarData[index]['score'] = sum(int(entry[subj]) for subj in subjects)
        if calendarData[index]['score'] != 0:
            print(calendarData[index]['score'])

    saveData(calendarData)

    return ('/')


def getData():
    with open('static/data/calendar.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        data = []
        for index, row in enumerate(reader):
            entry = row[0].split(',')
            if index == 0:
                keys = entry
            else:
                dict = {}
                for index2, dataPoint in enumerate(entry):
                    try:
                        dataPoint = float(dataPoint)
                    except:
                        pass
                    dict[keys[index2]] = dataPoint

                #score = dict['pure'] + dict['stats'] + dict['mech'] + dict['physics'] + dict['compsci']
                #dict['score'] = score
                data.append(dict)
    return data


def saveData(data):
    with open('static/data/calendar.csv', 'w', newline='') as file:
        w = csv.DictWriter(file, fieldnames=data[0].keys(), )
        w.writeheader()
        w.writerows(data)


daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
def dateToIndex(day, month):
    returnIndex = 0
    m = 0
    while m != month - 1:
        returnIndex += daysInMonths[m]
        m += 1
    return returnIndex + day


if __name__ == "__main__":
    app.run(debug=True)