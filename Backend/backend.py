from flask import Flask
from flask import request
import json
import db   

def create_app():
    app = Flask(__name__)
    return app

app = create_app()
mongo = db.config_db(app, "myDatabase")

@app.route("/api/user", methods = ['POST'])
def api_user():
    data = request.get_json()

    user = db.create_user(mongo, data['username'], data['password'])

    if user:
        response = app.response_class(
                response=json.dumps({'body' : user.login}),
                status=200,
                mimetype='application/json'
            )
        return response

    else:
        error = {'body' : 'username already exists'}
        response = app.response_class(
            response=json.dumps(error),
            status=400,
            mimetype='application/json'
        )
        return response