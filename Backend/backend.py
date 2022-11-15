from flask import Flask
import db   

def create_app():
    app = Flask(__name__)
    return app

app = create_app()
mongo = db.config_db(app, "myDatabase")


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"