from flask_pymongo import PyMongo
from models import User, UserRepository

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


