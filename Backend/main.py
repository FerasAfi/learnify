from fastapi import FastAPI, HTTPException
from models import User, LoginCredentials,Course, Quiz, Question, FlashCard, Summary, Chat, Message
import database as db

app = FastAPI()

#Authentication

@app.post('/signup')
def signup(user: User):
    try:
        db.create_user(
            username=user.username,
            password=user.password,
            email=user.email,
            sex=user.sex,
            age=user.age
        )
        return {'msg':"User created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500,detail="Error creating user" )

@app.post('/signin')
def signin(credentials: LoginCredentials):
    try:
        db.check_user(credentials.username, credentials.password)







@app.post('/create_course')
def create_course(course: Course):
    try:
        db.create_course(
            user_id=course.user_id,
            name=course.name,
            source=course.source
        )
        return {'msg': "Course created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Course")

@app.post('/create_quiz')
def create_quiz(quiz: Quiz):
    try:
        db.create_quiz(
            course_id=quiz.course_id,
            name=quiz.name
        )
        return {'msg': "Quiz created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Quiz")

@app.post('/create_question')
def create_question(question: Question):
    try:
        db.create_question(
            quiz_id=question.quiz_id,
            question=question.question,
            options=question.options,
            answer=question.answer
        )
        return {'msg': "Question created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Question")


@app.post('/create_flashcard')
def create_flashcard(flashcard: FlashCard):
    try:
        db.create_flashcard(
            course_id=flashcard.course_id,
            front=flashcard.front,
            back=flashcard.back
        )
        return {'msg': "Flashcard created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Flashcard")


@app.post('/create_summary')
def create_summary(summary: Summary):
    try:
        db.create_summary(
            course_id=summary.course_id,
            content=summary.content
        )
        return {'msg': "Summary created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Summary")


@app.post('/create_chat')
def create_chat(chat: Chat):
    try:
        db.create_chat(
            user_id=chat.user_id,
            course_id=chat.course_id
        )
        return {'msg': "Chat created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Chat")


@app.post('/create_message')
def create_message(message: Message):
    try:
        db.create_message(
            course_id=message.course_id,
            chat_id=message.chat_id,
            sender_type=message.sender_type,
            content=message.content
        )
        return {'msg': "Message created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Message")









