# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(260), nullable=False)
    language = db.Column(db.String(5), default='en')
    user_version = db.Column(db.String(10), default=None)  # Options are: 'free', 'mentor', 'premium', 'custom', and 'dev'
    currency = db.Column(db.Integer, default=0)

class UserCourseSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer)
    thread_id = db.Column(db.String(100))

class UserSelectedCourse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer)