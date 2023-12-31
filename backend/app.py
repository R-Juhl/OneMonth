# app.py:
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer as Serializer
from datetime import datetime, timedelta
import logging
from modules.models import db, User, UserCourseSession, UserSelectedCourse


from pathlib import Path
import uuid
import openai
client = openai.OpenAI(
  api_key = os.environ.get("OPENAI_API_KEY_ONEMONTH")
)

# Create a custom logger
logger = logging.getLogger('myapp')
logger.setLevel(logging.DEBUG)
# Create handlers
c_handler = logging.StreamHandler()
c_handler.setLevel(logging.DEBUG)
# Create formatters and add it to handlers
c_format = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
c_handler.setFormatter(c_format)
# Add handlers to the logger
logger.addHandler(c_handler)

# Modules:
from modules.assistant_module import assistant
from modules.teacher_module import get_initial_message, continue_course, get_course_thread, get_thread_messages


app = Flask(__name__)
cors_origin = os.environ.get("CORS_ORIGIN", "http://localhost:3000")
CORS(app, origins=[cors_origin])

# Database configuration (local machine hosting)
postgres_user_local = os.environ.get("POSTGRES_USER_LOCAL")
#postgres_pw_local = os.environ.get("POSTGRES_PW_LOCAL")
#postgres_db = 'postgres'
#app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{postgres_user}:{postgres_pw}@localhost:5432/{postgres_db}'


# Database configuration (DigitalOcean hosting)
postgres_user = os.environ.get("POSTGRES_USER")
postgres_pw = os.environ.get("POSTGRES_PW")
postgres_host = os.environ.get("POSTGRES_HOST")
postgres_port = os.environ.get("POSTGRES_PORT")
postgres_db = os.environ.get("POSTGRES_DB")
print("DB User:", postgres_user)
print("DB Password:", postgres_pw)
print("DB Host:", postgres_host)
print("DB Port:", postgres_port)
print("DB Name:", postgres_db)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{postgres_user}:{postgres_pw}@{postgres_host}:{postgres_port}/{postgres_db}?sslmode=require'



app.config['SECRET_KEY'] = os.environ.get("SECRET_TOKEN_KEY")

# Initialize SQLAlchemy with the app
db.init_app(app)

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
        if user:
            return jsonify({
                "user": user.name, 
                "user_id": user.id, 
                "user_version": user.user_version
            }), 200
        else:
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

@app.route('/get_language', methods=['POST'])
def get_language():
    user_id = request.json.get('user_id')
    user = User.query.get(user_id)
    if user:
        return jsonify({"language": user.language}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/update_user_version', methods=['POST'])
def update_user_version():
    if not request.is_json:
        return jsonify({"error": "Invalid request"}), 400

    data = request.json
    user_id = data.get('user_id')
    user_version = data.get('user_version')

    user = User.query.get(user_id)
    if user:
        user.user_version = user_version
        db.session.commit()
        return jsonify({"message": "User version updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404


### Module functions/routes: ###


# Route for handling the assistant #
@app.route('/assistant', methods=['POST'])
def handle_assistant():
    data = request.get_json()
    response_text = assistant(data)
    return jsonify({"response": response_text})

# Route for getting or creating a thread for a course #
@app.route('/get_or_create_course_thread', methods=['POST'])
def get_or_create_course_thread():
    data = request.json
    user_id = data['user_id']
    course_id = data['course_id']
    thread_id, is_new_thread = get_course_thread(user_id, course_id)
    return jsonify({"thread_id": thread_id, "isNewThread": is_new_thread})

# Route for getting the messages of a thread #
@app.route('/get_thread_messages', methods=['POST'])
def handle_get_thread_messages():
    data = request.json
    thread_id = data['thread_id']
    messages_list = get_thread_messages(thread_id)
    return jsonify({"messages": messages_list})

# Route for starting a course #
@app.route('/course_initial', methods=['GET'])
def handle_initial():
    thread_id = request.args.get('thread_id')
    course_id = request.args.get('course_id')
    user_id = request.args.get('user_id')
    print(f"User ID received in handle_initial: {user_id}")
    return get_initial_message(thread_id, user_id, course_id)

# Route for continuing a course #
@app.route('/course_continue', methods=['POST'])
def handle_continue():
    data = request.json
    logger.debug(f"handle_continue called with data: {data}")
    thread_id = data.get('thread_id')
    user_input = data.get('user_input')

    # Logging the received data
    logger.debug(f"Received data for course_continue: {data}")
    response = continue_course(thread_id, user_input)
    # Logging the response
    logger.debug(f"Sending response: {response.get_json()}")

    return response

# Route for getting the user's course sessions #
@app.route('/get_user_course_sessions', methods=['POST'])
def get_user_course_sessions():
    user_id = request.json.get('user_id')
    sessions = UserCourseSession.query.filter_by(user_id=user_id).all()
    sessions_data = [{'course_id': session.course_id, 'thread_id': session.thread_id} for session in sessions]
    return jsonify(sessions_data)

# Route for saving the user's course selection #
@app.route('/save_user_courses', methods=['POST'])
def save_user_courses():
    data = request.json
    user_id = data['user_id']
    course_ids = data['course_ids']

    # Delete existing user course selections
    UserSelectedCourse.query.filter_by(user_id=user_id).delete()

    # Save new selections
    for course_id in course_ids:
        new_selection = UserSelectedCourse(user_id=user_id, course_id=course_id)
        db.session.add(new_selection)

    try:
        db.session.commit()
        return jsonify({"message": "Courses saved successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Route for retrieving the user's course selection #
@app.route('/get_user_selected_courses', methods=['POST'])
def get_user_selected_courses():
    user_id = request.json.get('user_id')
    selected_courses = UserSelectedCourse.query.filter_by(user_id=user_id).all()
    selected_course_ids = [course.course_id for course in selected_courses]
    return jsonify(selected_course_ids)

# Route for converting text to speech #
@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text')
    
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice="echo",
            input=text
        )
        speech_file_path = Path('audio') / f"speech_{uuid.uuid4()}.mp3"
        response.stream_to_file(str(speech_file_path))
        # Ensure the URL is correct and accessible from the frontend
        audio_url = f"http://localhost:5000/audio/{speech_file_path.name}"
        return jsonify({"audio_url": audio_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/audio/<filename>')
def uploaded_file(filename):
    return send_from_directory('audio', filename)

if __name__ == '__main__':
    app.run(debug=True)
