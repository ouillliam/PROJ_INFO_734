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

@app.route("/api/user/login", methods = ['POST'])
def api_user_login():
    data = request.get_json()

    user = db.find_user(mongo, data['username'], data['password'])

    if user:
        response = app.response_class(
                response=json.dumps({'body' : user.login}),
                status=200,
                mimetype='application/json'
            )
        return response

    else:
        error = {'body' : 'Invalid credentials'}
        response = app.response_class(
            response=json.dumps(error),
            status=400,
            mimetype='application/json'
        )
        return response

@app.route("/api/server", methods = ["POST", "GET"])
def crud_server():
    if request.method == "POST" :
        data = request.get_json()

        server = db.create_server(mongo, data['serverName'], data["admin"])

        if server:
            response = app.response_class(
                    response=json.dumps({'body' : server.name}),
                    status=200,
                    mimetype='application/json'
                )
            return response

        else:
            error = {'body' : 'Server already exists'}
            response = app.response_class(
                response=json.dumps(error),
                status=400,
                mimetype='application/json'
            )
            return response

    elif request.method == "GET" :
        servers = db.get_servers(mongo)
        if servers:
            servers = [server.name for server in servers]
            response = app.response_class(
                    response=json.dumps({'body' : servers}),
                    status=200,
                    mimetype='application/json'
                )
            return response
        else:
            error = {'body' : 'Error getting servers'}
            response = app.response_class(
                response=json.dumps(error),
                status=400,
                mimetype='application/json'
            )
            return response