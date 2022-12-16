from flask_pymongo import PyMongo
from models import User, UserRepository, ServerRepository, Server, Member, Channel 

def config_db(app, db_name):
    app.config["MONGO_URI"] = f"mongodb://localhost:27017/{db_name}"
    mongo = PyMongo(app)
    return mongo

def create_user(mongo, username, password):

    user = User(**{
        'login' : username,
        'password' : password,
        'nickname' : username
    })

    userRepository = UserRepository(mongo.db)
    print(list(mongo.db["users"].find({})))
    print(userRepository.find_one_by({'login' : username}))
    if userRepository.find_one_by({'login' : username}) == None:
        userRepository.save(user)
        return user
    else:
        return False

def find_user(mongo, username, password):

    userRepository = UserRepository(mongo.db)

    user = userRepository.find_one_by({'login' : username, 'password' : password})
    if user == None:
        return False
    else: 
        return user

def create_server(mongo, server_name, admin):

    serverRepository = ServerRepository(mongo.db)
    userRepository = UserRepository(mongo.db)

    user = userRepository.find_one_by({'login' : admin})

    if not user:
        return False

    member = Member(**{
            'user' : user.id, 
            'role' : "admin"
        })

    channel = Channel(**{
            'name' : "General",
            "messages" : []
        })

    server = Server(**{
        'name' : server_name,
        'members' : [member],
        'channels' : [channel]
    })

    if not serverRepository.find_one_by({'name' : server_name}):
        serverRepository.save(server)
        return server
    else:
        return False

def get_servers_of_user(mongo, user):
    serverRepository = ServerRepository(mongo.db)
    userRepository = UserRepository(mongo.db)
    user_id = userRepository.find_one_by({'login' : user}).id 
    return serverRepository.find_by({ 'members.user' : {'$eq' : user_id} })

def get_server(mongo, server_name):
    serverRepository = ServerRepository(mongo.db)
    server = serverRepository.find_one_by({'name' : server_name})
    return server