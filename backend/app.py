# app.py:
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer as Serializer
from datetime import datetime, timedelta

# Modules:
from modules.assistant_module import assistant

app = Flask(__name__)
cors_origin = os.environ.get("CORS_ORIGIN", "http://localhost:3000")
CORS(app, origins=[cors_origin])

# Database configuration
postgres_user = os.environ.get("POSTGRES_USER")
postgres_pw = os.environ.get("POSTGRES_PW")
postgres_db = 'postgres'
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{postgres_user}:{postgres_pw}@localhost:5432/{postgres_db}'
app.config['SECRET_KEY'] = os.environ.get("SECRET_TOKEN_KEY")

# Initialize SQLAlchemy with the app
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(260), nullable=False)
    language = db.Column(db.String(5), default='en')

with app.app_context():
    #db.drop_all() # For dev to delete all tables and create them from scratch
    db.create_all()

@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.json
    print("Received data:", data)
    hashed_password = generate_password_hash(data['password']) # Hash the password
    new_user = User(
        name=data['name'],
        surname=data['surname'],
        email=data['email'],
        password=hashed_password
    )
    db.session.add(new_user)
    try:
        db.session.commit()
        print(f"User created successfully: {new_user.name} {new_user.surname}")
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")  # Log any error
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        # Correct password
        expiration_time = datetime.utcnow() + timedelta(hours=1)  # Expires 1 hour from now
        s = Serializer(app.config['SECRET_KEY'])
        token = s.dumps({'user_id': user.id, 'exp': expiration_time.timestamp()})
        return jsonify({"token": token, "user": user.name, "user_id": user.id}), 200
    else:
        # Incorrect password
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/verify_token', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    s = Serializer(app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
        # Check if token is expired
        if datetime.utcnow().timestamp() > data['exp']:
            return jsonify({"error": "Token expired"}), 401
        user = User.query.get(data['user_id'])
        return jsonify({"user": user.name, "user_id": user.id}), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

@app.route('/update_language', methods=['POST'])
def update_language():
    data = request.json
    user_id = data['user_id']
    language = data['language']
    print("user_id:", user_id)
    print("language_id:", language)

    user = User.query.get(user_id)
    if user:
        user.language = language
        db.session.commit()
        return jsonify({"message": "Language updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404

# Module functions/routes
@app.route('/assistant', methods=['POST'])
def handle_assistant():
    data = request.get_json()
    response_text = assistant(data)
    return jsonify({"response": response_text})

if __name__ == '__main__':
    app.run(debug=True)
