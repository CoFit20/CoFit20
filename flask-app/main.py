from flask import Flask , render_template, request
import json
from flask_bootstrap import Bootstrap
import time
app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('home.html')


@app.route('/shared', methods=['GET', 'POST'])
def shared():
    return render_template('shared.html')

@app.route('/private', methods=['GET', 'POST'])
def private():
    return render_template('private.html')

@app.route('/workouts', methods=['GET'])
def get_workouts():
    return json.dumps(["intro",'warmup','wo','wo','wo_break','wo','wo','wo_break'])



@app.route('/getWorkouts')
def getWorkouts():
    d = ""
    with open('./static/example.json') as f:
        d = json.load(f)

    return d


@app.route('/getWorkoutsPrivate')
def getWorkoutsPrivate():
    d = ""
    with open('./static/example_private.json') as f:
        d = json.load(f)

    return d

if __name__ == '__main__':
    bootstrap = Bootstrap(app)
    app.run(debug=True,host='0.0.0.0')
