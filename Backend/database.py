from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import ForeignKey, Column, Integer, String, Boolean, DateTime, func, Text


SQLALCHEMY_DB_URL = "mysql+pymysql://root@localhost/learnify"
engine = create_engine(SQLALCHEMY_DB_URL, echo=True)
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
    source = Column(Text)
    date_created = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<courses(id='{self.id}' user_id='{self.user_id}' name='{self.name}' source='{self.source}' date_created='{self.date_created}' )>"


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
    question_id = Column(Integer, ForeignKey("quizs.id"))
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
    course_id = Column(Integer, ForeignKey("courses.id"))
    sender_type = Column(Boolean)
    content = Column(Text)
    time_sent = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<messages(id='{self.id}' course_id='{self.course_id}' chat_id='{self.chat_id}' time_sent='{self.time_sent} sender_type={self.sender_type}  content={self.content}  ' )>"


Base.metadata.create_all(engine)


SessionLocal = sessionmaker(bind=engine)



#Authentication

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
        print(f"user {username} added successfully")
        return new_user
    except Exception as e:
        session.rollback()
        print(f"failed to add {username}")
        return 0
    finally:
        session.close()


def check_user(username, password):
    session = SessionLocal()
    try:
        user_exists = session.query(Users).filter(Users.username == username).first()
        if not user_exists:
            raise ValueError("Username doesn't exists")
        if








def create_course(user_id, name, source):
    session = SessionLocal()
    try:
        new_course = Courses(
                user_id=user_id,
                name=name,
                source=source
        )
        session.add(new_course)
        session.commit()
        print(f"course with {user_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add course with {user_id} id")
        return 0
    finally:
        session.close()

def create_quiz(course_id, name):
    session = SessionLocal()
    try:
        new_quiz = Quizs(course_id=course_id, name=name)
        session.add(new_quiz)
        session.commit()
        print(f"quiz with {course_id} id was added successfully")
        return 1
    except Exception as e:
        session.rollback()
        print(f"failed to add quiz with {course_id} id")
        return 0
    finally:
        session.close()

def create_question(quiz_id, question, options, answer):
    session = SessionLocal()
    try:
        new_question = Questions(quiz_id=quiz_id, question=question, options=options, answer=answer)
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

def create_flashcard(course_id, front, back):
    session = SessionLocal()
    try:
        new_flashcard = Quizs(course_id=course_id, front=front, back=back)
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

def create_summary(course_id, content):
    session = SessionLocal()
    try:
        new_summary = Summaries(course_id=course_id, content=content)
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

def create_chat(user_id ,course_id):
    session = SessionLocal()
    try:
        new_chat = Chats(user_id=user_id ,course_id=course_id)
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

def create_message(course_id, chat_id, sender_type, content):
    session = SessionLocal()
    try:
        new_message = Messages(course_id=course_id, chat_id=chat_id, sender_type=sender_type, content=content)
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


