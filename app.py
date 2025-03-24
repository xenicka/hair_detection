
import webbrowser
import threading

from flask import Flask, request, jsonify, render_template,session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from ultralytics import YOLO
from PIL import Image
import io
from flask_session import Session



def open_browser():     
    webbrowser.open_new("http://127.0.0.1:5000")


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Example using SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'  # Установи случайный ключ
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)


db = SQLAlchemy(app)

alopecia_types = ['Alopecia_Areata', 'Alopecia_Totalis','Androgenetic_Alopecia']
hair_types = ['long Curly Hair', 'long Straight Hair', 'long Wavy Hair', ' short curly hair', 'short straight hair', 'short wavy hair', 'bald']

model_for_type = YOLO('best.pt')  
model_for_alopecia = YOLO('best2.pt')  


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    hair_type = db.Column(db.String(500), nullable=True, default=None) 
    alopecia_type = db.Column(db.String(500), nullable=True, default=None) 

    def __repr__(self):
        return f"<User {self.name}>"

with app.app_context():
    db.create_all()



if __name__ == "__main__":
    threading.Timer(1, open_browser).start()  # Wait 1 second before opening
    app.run(debug=True, use_reloader=False)  # Disable reloader to prevent multiple browser tabs opening

