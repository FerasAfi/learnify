from fastapi import FastAPI
from pymupdf import annot_skel

from models import User, Course, Quiz, Question, FlashCard, Summary, Chat, Message
import database as db

app = FastAPI()

#Authentication

@app.post('/create_user')
def create_user(user: User):
    if db.create_user(username=user.username, password=user.password, email=user.email, sex=user.sex, age=user.age):
        return {'msg':"200"}
    else:
        return {'msg': "500"}


@app.post('/create_course')
def create_course(course: Course):
    if db.create_course(user_id=course.user_id, source=course.source):
        return {'msg': "200"}
    else:
        return {'msg': "500"}

@app.post('/create_quiz')
def create_quiz(quiz: Quiz):
    if db.create_quiz(course_id=quiz.course_id, name=quiz.name):
        return {'msg': "200"}
    else:
        return {'msg': "500"}

@app.post('/create_question')
def create_question(question: Question):
    if db.create_question(quiz_id=question.quiz_id, question=question.question, options=question.options, answer=question.answer):
        return {'msg': "200"}
    else:
        return {'msg': "500"}


@app.post('/create_flashcard')
def create_flashcard(flashcard: FlashCard):
    if db.create_flashcard(course_id=flashcard.course_id, front=flashcard.front, back=flashcard.back):
        return {'msg': "200"}
    else:
        return {'msg': "500"}


@app.post('/create_summary')
def create_summary(summary: Summary):
    if db.create_summary(course_id=summary.course_id, content=summary.content):
        return {'msg': "200"}
    else:
        return {'msg': "500"}


@app.post('/create_chat')
def create_chat(chat: Chat):
    if db.create_chat(user_id=chat.user_id, course_id=chat.user_id):
        return {'msg': "200"}
    else:
        return {'msg': "500"}


@app.post('/create_message')
def create_message(message: Message):
    if db.create_message(course_id=message.course_id, chat_id=message.chat_id, sender_type=message.sender_type, content=message.content):
        return {'msg': "200"}
    else:
        return {'msg': "500"}





@app.get('/users/{user_id}')
def get_username(user_id):
    return






@app.post('/create_Quiz')
def create_course(quiz: Quiz):
    return quiz

@app.post('/create_course')
def create_course(course: Course):
    return course


