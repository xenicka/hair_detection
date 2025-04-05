
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
hair_types = ['Long Curly Hair', 'Long Straight Hair', 'Long Wavy Hair', ' Short Curly Hair', 'Short Straight Hair', 'Short Wavy Hair', 'Bald']

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


@app.route('/')
def home():
    return render_template('about.html',is_authenticated='user_id' in session)
@app.route('/detect_alopecia')
def home2():
    if 'user_id' not in session:
        return render_template('sign_in.html') # Redirect to sign-in if not authenticated
    return render_template('detect_alopecia.html',is_authenticated=True)
@app.route('/detect_hair')
def home22():
    if 'user_id' not in session:
        return render_template('sign_in.html') # Redirect to sign-in if not authenticated
    return render_template('detect_hair.html',is_authenticated=True)
@app.route('/result_hair')
def home3():
    if 'user_id' not in session:
        return render_template('sign_in.html')
    return render_template('result_hair.html', is_authenticated=True)

@app.route('/result_alopecia')
def home4():
    return render_template('result_alopecia.html')
@app.route('/register')
def home5():
    return render_template('register.html')
@app.route('/')
def about():
    if 'user_id' not in session:
        return render_template('sign_in.html') # Redirect to sign-in if not authenticated
    return render_template('about.html', is_authenticated=True)
@app.route('/sign_in')
def home7():
    return render_template('sign_in.html')
@app.route('/account_page')
def profile():
    if 'user_id' not in session:
        return "Unauthorized", 401  # Если нет пользователя в сессии

    user = User.query.get(session['user_id'])
    if not user:
        return "User not found", 404

    return render_template('account_page.html', user=user)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return render_template('/sign_in.html')

@app.route('/register', methods=['POST'])
def register():
    # Get the data from the request
    data = request.get_json()
    
    # Extract values from the JSON data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    
    # Validate passwords
    if password != confirm_password:
        return jsonify({'success': False, 'message': 'Passwords do not match.'}), 400

    # Check if the email already exists in the database
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Email already registered.'}), 400

    # Hash the password for security
    hashed_password = generate_password_hash(password)

    # Create a new user and add to the database
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    

    # Return success response
    return jsonify({'success': True, 'message': 'Registration successful!'}), 201

@app.route('/create_plan')
def plan():
    if 'user_id' not in session:
        return render_template('sign_in.html') # Redirect to sign-in if not authenticated
    return render_template('create_plan.html', is_authenticated=True)
@app.route('/sign_in', methods=['POST'])
def sign_in():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    

    existing_user = User.query.filter_by(email=email).first()
    if not existing_user:
        return jsonify({'success': False, 'message': 'Email not registered.'}), 400

    if not check_password_hash(existing_user.password, password):
        return jsonify({'success': False, 'message': 'Incorrect password.'}), 400

    session['user_id'] = existing_user.id  # Сохраняем ID пользователя


    return jsonify({'success': True, 'message': 'Login successful!'}), 201
    

@app.route('/upload_hair', methods=['POST'])
def upload_for_hair_type():
    return upload_file(type=hair_types,model=model_for_type,option = "hair")

@app.route('/upload_alopecia', methods=['POST'])
def upload_for_alopecia_type():
    return upload_file(type=alopecia_types,model=model_for_alopecia,option="alopecia")

def upload_file(type,model,option):
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        img = Image.open(io.BytesIO(file.read()))
        print("Image successfully loaded.")
    except Exception as e:
        return jsonify({'error': f'Error loading image: {str(e)}'})

    # Make predictions
    
    try:
        results = model.predict(source=img, conf=0.25)
        print("Predictions made.")
        print(results[0])
    except Exception as e:
        return jsonify({'error': f'Error during prediction: {str(e)}'})

    if results[0].boxes is not None and len(results[0].boxes) > 0:
        predictions = []
        for i in range(len(results[0].boxes.conf)):
            confidence = results[0].boxes.conf[i].item()
            class_id = int(results[0].boxes.cls[i])
            class_name = type[class_id]
            predictions.append({'class': class_name, 'confidence': confidence})

        # Sort predictions by confidence
        predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Format predictions with confidence percentages
        formatted_predictions = [
            {'class': predictions[0]['class'], 'confidence': f"{predictions[0]['confidence'] * 100:.2f}%" }
            # for pred in predictions
        ]

        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                print(f"User found: {user.name}")
                if option == "alopecia":
                    user.alopecia_type = str(formatted_predictions)
                else:
                    user.hair_type = str(formatted_predictions)
                db.session.commit()
                print("Predictions saved to db.")
            else:
                print("User not found.")
        else:
            print("No user in session.")
    else:
        formatted_predictions = [{'class': 'No predictions', 'confidence': '0.00%'}]

    return jsonify({'predictions': formatted_predictions})



if __name__ == "__main__":
    threading.Timer(1, open_browser).start()  # Wait 1 second before opening
    app.run(debug=True, use_reloader=False)  # Disable reloader to prevent multiple browser tabs opening