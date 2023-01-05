from flask import Flask
from flask import request
import json
import db   
import dictfier
from flask_socketio import SocketIO, send, emit

def server_to_json(server):
    query = [
                    {
                        "id" : dictfier.useobj(lambda obj : str(obj.id))
                    },
                    "name", 
                    {
                        "members" : [
                            [
                                
                                {"user" : [
                                    
                                        {"id" : dictfier.useobj(lambda obj : str(obj.id))},
                                        "login",
                                        "nickname"
                                ]
                                },
                                "role"
                            ]
                        ]
                    },
                    {
                        "channels" : [
                            [
                                "name",
                                {
                                    "messages" : [
                                        [
                                            {"from_user" : [
                                                "login"
                                            ]},
                                            "sent_at",
                                            "content"
                                        ]
                                    ]
                                }
                            ]
                        ]
                    }
                ]

    server_data = dictfier.dictfy(server, query)

    return server_data

def create_app():
    app = Flask(__name__)
    return app

app = create_app()
mongo = db.config_db(app, "myDatabase")

socketio = SocketIO(app, cors_allowed_origins="*", logger = False)

def init_rooms():
    socket_rooms = []
    servers = db.get_all_servers(mongo)
    for server in servers:
        socket_rooms.append(server.id)
    return socket_rooms


socket_rooms = init_rooms()

connections = set()

@socketio.server.event
def connect(sid, environ, auth):
    print("connection" , sid)
    connections.add(sid)

@socketio.server.event
def disconnect(sid):
    print("disconnected" , sid)
    connections.remove(sid)
    

@socketio.on('register_user')
def register_user(sid, username):
    print("REGISTERING " + username)
    socketio.server.save_session(sid, {'username' : username})
    servers = db.get_servers_of_user(mongo, username)
    for server in servers:
        print(username + " se connecte a " + server.name)
        socketio.server.enter_room(sid, server.name)
    print(f"{sid} {socketio.server.get_session(sid)}")
    print("TOUTES LES ROOMS")
    print(socketio.server.manager.rooms)
    
@socketio.on('add_member')
def add_member(member, server):
    print("JESSAIE D AJOYTER" + str(member))
    conn = None
    for connection in connections:
        username = ""
        
        try:
            username = socketio.server.get_session(connection)["username"]
        except:
            pass

        if username == member:
            print("VOILA LA SESSION DE " + member)
            print(socketio.server.get_session(connection))
            socketio.server.enter_room(connection, server)
            print(username + " rejoint " + server)
            socketio.emit("server_joined", {"server" : server, "username" : member}, to = connection)
            conn = connection
    
    print("JESSAY D EMIT SERVER "+ server + " JOINED " + member )
    if conn:
        socketio.emit("user_joined_server", {"server" : server_to_json(db.get_server(mongo, server)), "username" : member}, to = server, skip_sid = conn )
    else:
        socketio.emit("user_joined_server", {"server" : server_to_json(db.get_server(mongo, server)), "username" : member}, to = server)
        
@socketio.on('message_sent')
def handle_message_sent(server, channel):
    print("NOUVEAU MESSAGE ===================")
    socketio.emit("new_message", {"server" : server, "channel" : channel}, to = server)

@socketio.on('new_message_received')
def handle_new_message_received(login, channel, server):
    for connection in connections:
        username = ""
        try:
            username = socketio.server.get_session(connection)["username"]
        except:
            pass
        
        if username == login :
            socketio.emit('update_chat', {'channel' : channel,'server' : json.dumps(server_to_json(db.get_server(mongo, server)))} ,to = connection)


@socketio.on('channel_added')
def handle_new_channel(server_name):
    server = db.get_server(mongo, server_name)
    socketio.emit('new_channel', {"server" : server_to_json(server)}, to = server_name)



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

@app.route("/api/server", methods = ["POST", "GET", "PUT"])
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
    
    elif request.method == "PUT" :

        data = request.get_json()

        server = db.update_server(mongo, data["server_name"], data["new_channel"], data["new_member"],  data["channel_to_update"], data["new_message"], data["from"])
        print(f"bfyuegfseu : {server}")

        if server:
            server_data = server_to_json(server)
            response = app.response_class(
                    response=json.dumps(server_data),
                    status=200,
                    mimetype='application/json'
                )
            return response

        else:
            error = {'body' : 'Error updating server'}
            response = app.response_class(
                response=json.dumps(error),
                status=400,
                mimetype='application/json'
            )
            return response
        

    elif request.method == "GET" :
        user = request.args.get('user')
        server_name = request.args.get('server_name')

        if user:
            servers = db.get_servers_of_user(mongo, user)
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
        elif server_name:
            server = db.get_server(mongo, server_name)
            if server:
                
                server_data = server_to_json(server)

                response = app.response_class(
                        response=json.dumps({'body' : json.dumps(server_data)}),
                        status=200,
                        mimetype='application/json'
                    )
                return response
            else:
                error = {'body' : 'Error getting server'}
                response = app.response_class(
                    response=json.dumps(error),
                    status=400,
                    mimetype='application/json'
                )
                return response

        


if __name__ == '__main__':
    socketio.run(app)