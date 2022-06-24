from flask import *
import csv

app = Flask(__name__)

@app.route('/')
def index():
    with open('static/data/calendar.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        pushData = []
        for index, row in enumerate(reader):
            entry = row[0].split(',')
            if index == 0:
                keys = entry
            else:
                dict = {}
                for index2,dataPoint in enumerate(entry):
                    try:
                        dataPoint = float(dataPoint)
                    except:
                        pass
                    dict[keys[index2]] = dataPoint
                score = dict['pure']+dict['stats']+dict['mech']+dict['physics']+dict['compsci']
                dict['score'] = score
                pushData.append(dict)

    #for entry in pushData:
    #    print(entry)

    return render_template("main-page.html", data=pushData)


if __name__ == "__main__":
    app.run(debug=True)