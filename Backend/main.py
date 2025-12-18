from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import User, LoginCredentials, Course, Source,GenerateRequest , Quiz, Question, FlashCard, Summary, Chat, Message
import database as db
from utils import text_extraction as txt



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Authentication
#############------------------------------------------------------##############

@app.post('/signup')
def signup(user: User):
    try:
        result = db.create_user(
            username=user.username,
            password=user.password,
            email=user.email,
            sex=user.sex,
            age=user.age
        )

        if result == 0:
            raise HTTPException(status_code=500, detail="Error creating user")
        return {'msg':"User created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@app.post('/signin')
def signin(credentials: LoginCredentials):
    try:
        return db.check_credentials(credentials.username, credentials.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise  HTTPException(status_code=500,detail="Error while checking credentials")

@app.delete('/delete-user')
def delete_user(user_id: int):
    try:
        db.delete_account(user_id)
        return {'msg': f'User with id: {user_id} was deleted successfully'}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#Course
#############------------------------------------------------------##############


@app.post('/create-course')
def create_course(course: Course):
    try:
        return db.create_course(
            user_id=course.user_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Course")

@app.get('/get-courses')
def get_course(q: int):
    try:
        return db.get_courses(q)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error while searching for courses")

@app.post('/add-source')
def add_source(source: Source):
    try:
        print(f"DEBUG: Received - course_id={source.course_id}, type={type}")
        print(f"DEBUG: Source length: {len(source.source)} chars")
        print(f"DEBUG: Source first 100 chars: {source.source[:100]}")

        match source.type:
            case "yt":
                print("DEBUG: Processing YouTube...")
                trans = txt.get_yt(source.source)
            case "pdf":
                trans = txt.get_pdf(source.source)
            case "docx":
                trans = txt.get_docx(source.source)
            case "txt":
                trans = txt.get_txt(source.source)
            case "site":
                trans = txt.get_site(source.source)
            case _:
                raise HTTPException(status_code=400, detail="Invalid type provided")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to extract transcript")
    print(f"DEBUG: Transcript length: {len(trans)} chars")
    try:
        db.add_source(source.course_id, source.source, trans)

        return {"message": "Source added successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=e)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error while adding source")

@app.get('/get-sources')
def get_sources(course_id: int):
    try:
        return db.get_sources(course_id)

    except ValueError as e:
        HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        HTTPException(status_code=500, detail=str(e))

@app.put('/update-course-title')
def update_course_title(course_id: int, title: str):
    try:
        db.update_course_title(course_id, title)
        return {'msg':f'Course id: {course_id} title Updated'}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error while updating course title")

@app.post('/generate-content')
def generate_content(course_id: GenerateRequest):
    try:
        db.add_generate_content(course_id.course_id)
        return {'msg':f'Content added to course with id: {course_id}'}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error while adding content")

@app.delete(('/delete-course'))
def delete_course(course_id: int):
    try:
        db.delete_course(course_id)
        return {'msg': f'Course with id: {course_id} was deleted successfully'}
    except ValueError as e:
        HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        HTTPException(status_code=500, detail=str(e))

#Quiz
#############------------------------------------------------------##############


@app.post('/create-quiz')
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

@app.get('/get-quiz')
def get_quiz(q: int):
    try:
        return db.get_quiz(q)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error while searching for quizs")

@app.post('/create-question')
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

@app.get('/get-questions')
def get_questions(q: int):
    try:
        return db.get_questions(q)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#FlashCard
#############------------------------------------------------------##############

@app.post('/create-flashcard')
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

@app.get('/get-flashcard')
def get_flashcard(q: int):
    try:
        return db.get_flashcards(q)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error while searching for flashcards")


#Summary
#############------------------------------------------------------##############


@app.post('/create-summary')
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

@app.get('/get-summary')
def get_summary(q: int):
    try:
        return db.get_summary(q)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error while searching for summary")


#Chat-Bot
#############------------------------------------------------------##############


@app.post('/create-chat')
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

@app.post('/create-message')
def create_message(message: Message):
    try:
        db.create_message(
            chat_id=message.chat_id,
            sender_type=message.sender_type,
            content=message.content
        )
        return {'msg': "Message created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating Message")

@app.get('/get-messages')
def get_messages(q: int):
    try:
        return db.get_messages(q)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong getting messages")








