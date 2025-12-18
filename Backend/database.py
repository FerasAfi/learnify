from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy import ForeignKey, Column, Integer, String, Boolean, DateTime, func, Text
from utils import llm
import json

SQLALCHEMY_DATABASE_URL = "sqlite:///./learnify.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
Base = declarative_base()



class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(30))
    password = Column(String(50))
    email = Column(String(300))
    profile_pic = Column(String(500))
    age = Column(Integer)
    sex = Column(Boolean)
    date_joined = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<users(id='{self.id}' username='{self.username}' password='{self.password}' email='{self.email}' profile_pic='{self.profile_pic}' age='{self.age}'  sex='{self.sex}'  date_joined='{self.date_joined}')>"


class Courses(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(30), default="Untitled Course")
    date_created = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<courses(id='{self.id}' user_id='{self.user_id}' name='{self.name}' date_created='{self.date_created}' )>"


class Sources(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    origin = Column(Text)
    transcript = Column(Text)
    date_added = Column(DateTime(timezone=True), server_default=func.now())


    def __repr__(self):
        return f"<sources(id='{self.id}' course_id='{self.course_id}' origin='{self.origin}' transcript='{self.transcript}' date_added='{self.date_added}' )>"


class Quizs(Base):
    __tablename__ = "quizs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    name = Column(String(30))


    def __repr__(self):
        return f"<quizs(id='{self.id}' name='{self.name}')>"


class QuizProgress(Base):
    __tablename__ = "quiz_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizs.id"))
    current_question = Column(Integer, default=0)
    answers = Column(Text)
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)

    def __repr__(self):
        return f"<quiz_progess(id='{self.id}' user_id='{self.user_id}'  quiz_id='{self.quiz_id}' current_question='{self.current_question}' answers='{self.answers}'   completed='{self.completed}' score='{self.score}'  )>"


class Questions(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    quiz_id = Column(Integer, ForeignKey("quizs.id"))
    question = Column(String(500))
    options = Column(Text)
    answer = Column(Text)

    def __repr__(self):
        return f"<questions(id='{self.id}' question_id='{self.question_id}' question='{self.question}' options='{self.options}' answer='{self.answer}' )>"


class FlashCards(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    front = Column(Text)
    back = Column(Text)

    def __repr__(self):
        return f"<flashcards(id='{self.id}' course_id='{self.course_id}' front='{self.front}' back='{self.back}' )>"


class Summaries(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    content = Column(Text)


    def __repr__(self):
        return f"<summaries (id='{self.id}' course_id='{self.course_id}' content='{self.content}')>"


class Chats(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    time_created = Column(DateTime(timezone=True), server_default=func.now())


    def __repr__(self):
        return f"<chats(id='{self.id}' course_id='{self.course_id}' user_id='{self.user_id}' time_created='{self.time_created}' )>"


class Messages(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    sender_type = Column(Boolean)
    content = Column(Text)
    time_sent = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<messages(id='{self.id}' chat_id='{self.chat_id}' time_sent='{self.time_sent} sender_type={self.sender_type}  content={self.content}  ' )>"


Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)



#Authentication
#############------------------------------------------------------##############

def create_user(username, password, email, sex, age):
    session = SessionLocal()
    try:
        user_exists = session.query(Users).filter(Users.username == username).first()
        if user_exists:
            raise ValueError("Username already exists")
        new_user = Users(
            username=username,
            password=password,
            email=email,
            sex=sex,
            age=age
        )
        session.add(new_user)
        session.commit()
        session.refresh(user_exists)
        print(f"user {username} added successfully")
        return new_user

    except Exception as e:
        session.rollback()
        print(f"failed to add {username}")
        raise
    finally:
        session.close()

def check_credentials(username, password):
    session = SessionLocal()
    try:
        user = session.query(Users).filter(Users.username == username).first()
        if not user:
            raise ValueError("Username doesn't exists")
        if user.password != password:
            raise ValueError("Password is incorrect")

        return {
            "msg": "login successful",
            "user_id": user.id
        }
    finally:
        session.close()

def update_password(user_id, old_password, new_password):
    session = SessionLocal()
    try:
        user = session.query(Users).filter(Users.id == user_id).first()
        if user.password != old_password:
            raise ValueError ("Your password doesn't match")
        user.password = new_password
        session.commit()

    finally:
        session.close()

def update_username(user_id, new_username):
    session = SessionLocal()
    try:
        user = session.query(Users).filter(Users.id == user_id).first()
        user.username = new_username
        session.commit()

    finally:
        session.close()

def delete_account(user_id):
    session = SessionLocal()
    try:
        user = session.query(Users).filter(Users.id == user_id).first()
        if not user:
            raise ValueError(f'No user found with the id: {user_id}')
        session.delete(user)
        session.commit()
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to delete user with id:  {user_id}")
        raise e
    finally:
        session.close()


#Course
#############------------------------------------------------------##############


def create_course(user_id):
    session = SessionLocal()
    try:
        new_course = Courses(
                user_id=user_id
        )
        session.add(new_course)
        session.commit()
        print(f"course with {user_id} id was added successfully")
        return {
            'msg': "Course created successfully",
            'id': new_course.id,
            'user_id': new_course.user_id,
            'name': new_course.name,
            'date_created': new_course.date_created.isoformat() if new_course.date_created else None
        }
    except Exception as e:
        session.rollback()
        print(f"failed to add course with {user_id} id")
        return 0
    finally:
        session.close()

def get_courses(user_id: int):
    session = SessionLocal()
    try:
        courses = session.query(Courses).filter(Courses.user_id == user_id).all()
        if courses == []:
            raise ValueError("No courses found")
        return [
            {
                "id": c.id,
                "name": c.name,
                "user_id": c.user_id,
                "date_created": c.date_created
            }
            for c in courses
        ]
    finally:
        session.close()

def add_source(course_id, origin, transcript):
    session = SessionLocal()

    try:
        new_source = Sources(
            course_id=course_id,
            origin=origin,
            transcript=transcript
        )
        session.add(new_source)
        session.commit()
        print(f"source was added successfully to course id: {course_id} ")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add source to course id:  {course_id}")
        raise e
    finally:
        session.close()

def get_sources(course_id):
    session = SessionLocal()
    try:
        sources = session.query(Sources).filter(Sources.course_id == course_id).all()
        if sources == []:
            raise ValueError(f"No courses found with {course_id} id")
        return [
                s.transcript  for s in sources
        ]
    finally:
        session.close()

def update_course_title(course_id, title):
    session = SessionLocal()
    try:
        course = session.query(Courses).filter(Courses.id == course_id).first()
        if not course:
            raise ValueError(f"No course was found with id: {course_id} ")

        course.name = title
        session.commit()
        print(f"title was updated successfully of course id: {course_id} ")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to update title of course id:  {course_id}")
        raise e
    finally:
        session.close()

def delete_course(course_id):
    session = SessionLocal()
    try:
        course = session.query(Courses).filter(Courses.id == course_id).first()
        if not course:
            raise ValueError(f'No course found with the id: {course_id}')

        session.query(Questions).filter(
            Questions.quiz_id.in_(
                session.query(Quizs.id).filter(Quizs.course_id == course_id)
            )
        ).delete(synchronize_session=False)

        session.query(Messages).filter(
            Messages.chat_id.in_(
                session.query(Chats.id).filter(Chats.course_id == course_id)
            )
        ).delete(synchronize_session=False)

        session.query(Sources).filter(Sources.course_id == course_id).delete()
        session.query(Quizs).filter(Quizs.course_id == course_id).delete()
        session.query(FlashCards).filter(FlashCards.course_id == course_id).delete()
        session.query(Summaries).filter(Summaries.course_id == course_id).delete()
        session.query(Chats).filter(Chats.course_id == course_id).delete()

        session.delete(course)
        session.commit()
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to delete course with id:  {course_id}")
        raise e
    finally:
        session.close()

def add_generate_content(course_id):
    session = SessionLocal()
    try:
        print(f"DEBUG: Starting content generation for course_id: {course_id}")


        sources = get_sources(course_id)
        print(f"DEBUG: Sources type: {type(sources)}")

        if not sources:
            raise ValueError(f"No sources found for course_id: {course_id}")
        if isinstance(sources, list):
            content = ' '.join(str(item).strip() for item in sources if item)
        elif isinstance(sources, str):
            content = sources
        else:
            content = str(sources)
        if not content.strip():
            raise ValueError("Extracted content is empty")


        print("DEBUG: Calling LLM...")
        course_title, summary, flashcards, quizs = llm.generate_content(content)
        print(f"DEBUG: LLM returned - title: {course_title}, flashcards: {len(flashcards)}, quizs: {len(quizs)}")

        if not course_title or not summary:
            raise ValueError("LLM failed to generate valid content")

        print("DEBUG: Updating course title...")
        update_course_title(course_id, course_title)


        print("DEBUG: Creating summary...")
        create_summary(course_id, summary)


        if flashcards:
            print(f"DEBUG: Creating {len(flashcards)} flashcards...")
            for flashcard in flashcards:
                if 'front' in flashcard and 'back' in flashcard:
                    create_flashcard(course_id, flashcard['front'], flashcard['back'])


        quiz_title = f'Quiz for {course_title}'
        print(f"DEBUG: Creating quiz: {quiz_title}")
        quiz_id = create_quiz(course_id, quiz_title)

        if quiz_id and quizs:
            print(f"DEBUG: Creating quiz questions...")
            for quiz in quizs:
                create_question(quiz_id, quiz['question'], str(quiz['options']), quiz['answer'])


        session.commit()
        print(f"DEBUG: Successfully completed for course_id: {course_id}")

    except Exception as e:
        print(f"ERROR in add_generate_content: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        session.rollback()
        raise
    finally:
        session.close()


#QUIZ
#############------------------------------------------------------##############


def create_quiz(course_id, name):
    session = SessionLocal()
    new_quiz = None
    try:
        new_quiz = Quizs(course_id=course_id, name=name)
        session.add(new_quiz)
        session.commit()
        print(f"quiz with {course_id} id was added successfully")
        return new_quiz.id
    except Exception as e:
        session.rollback()
        print(f"failed to add quiz with {course_id} id")
        return new_quiz.id
    finally:
        session.close()

def get_quiz(q):
    session = SessionLocal()
    try:
        quiz = session.query(Quizs).filter(Quizs.course_id == q).first()
        if not quiz:
            raise ValueError("No quiz found")
        return {
            "id": quiz.id,
            "course_id": quiz.course_id,
            "title": quiz.name
        }
    except Exception as e:
        print(e)
    finally:
        session.close()

def create_question(quiz_id, question, options, answer):
    session = SessionLocal()
    try:
        new_question = Questions(
                            quiz_id=quiz_id,
                            question=question,
                            options=options,
                            answer=answer
                        )
        session.add(new_question)
        session.commit()
        print(f"question with {quiz_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add question with {quiz_id} id")
        return 0
    finally:
        session.close()

def get_questions(quiz_id: int):
    session = SessionLocal()
    try:
        questions = session.query(Questions).filter(Questions.quiz_id == quiz_id).all()
        if questions == []:
            raise ValueError("No questions found")
        return [
            {
                "id": q.id,
                "quiz_id": q.quiz_id,
                "question": q.question,
                "options": q.options,
                "answer": q.answer
            } for q in questions
        ]
    finally:
        session.close()


#Flashcard
#############------------------------------------------------------##############


def create_flashcard(course_id, front, back):
    session = SessionLocal()
    try:
        new_flashcard = FlashCards(
                            course_id=course_id,
                            front=front,
                            back=back
                         )
        session.add(new_flashcard)
        session.commit()
        print(f"flashcard with {course_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add flashcard with {course_id} id")
        return 0
    finally:
        session.close()

def get_flashcards(course_id: int):
    session = SessionLocal()
    try:
        flashcards = session.query(FlashCards).filter(FlashCards.course_id == course_id).all()
        if flashcards == []:
            raise ValueError("No flashcards found")
        return [
            {
                "id": f.id,
                "front": f.front,
                "back": f.back
            } for f in flashcards
        ]
    finally:
        session.close()


#Summary
#############------------------------------------------------------##############


def create_summary(course_id, content):
    session = SessionLocal()
    try:
        new_summary = Summaries(
                        course_id=course_id,
                        content=content
                    )
        session.add(new_summary)
        session.commit()
        print(f"summary with {course_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add summary with {course_id} id")
        return 0
    finally:
        session.close()


def get_summary(course_id):
    session = SessionLocal()
    try:
        summary = session.query(Summaries).filter(Summaries.course_id == course_id).first()
        if not summary:
            raise ValueError("No summary was found")
        return {
            "id": summary.id,
            "content": summary.content
        }
    finally:
        session.close()


#Chat-bot
#############------------------------------------------------------##############

def create_chat(user_id ,course_id):
    session = SessionLocal()
    try:
        new_chat = Chats(
                    user_id=user_id ,
                    course_id=course_id
                    )
        session.add(new_chat)
        session.commit()
        print(f"chat with {course_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add chat with {course_id} id")
        return 0
    finally:
        session.close()

def create_message(chat_id, sender_type, content):
    session = SessionLocal()
    try:
        new_message = Messages(
                        chat_id=chat_id,
                        sender_type=sender_type,
                        content=content
                        )
        session.add(new_message)
        session.commit()
        print(f"message associated with chat {chat_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add message in chat: {chat_id} id")
        return 0
    finally:
        session.close()

def get_messages(chat_id: int):
    session = SessionLocal()
    try:
        messages = session.query(Messages).filter(Messages.chat_id == chat_id).all()
        if messages == []:
            raise ValueError("No massages were found")

        return [
            {
                "id": m.id,
                "course_id": m.course_id,
                "sender_type": m.sender_type,
                "content": m.content,
                "time_sent": m.time_sent
            } for m in messages
        ]
    finally:
        session.close()
