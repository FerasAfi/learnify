from pydantic import BaseModel


class User(BaseModel):

    username: str
    password: str
    email: str
    profile_pic: str = "cdn-icons-png.flaticon.com/512/6596/6596121.png"
    sex: bool
    age: int

class LoginCredentials(BaseModel):

    username: str
    password: str


class Course(BaseModel):

    user_id: int
    name: str = "Untitled Course"
    source: str



class Quiz(BaseModel):

    course_id: int
    name: str



class QuizProgress:

    user_id: int
    quiz_id: int
    current_question: int
    answers: str
    completed: bool
    score: int


class Question(BaseModel):

    quiz_id: int
    question: str
    options: str
    answer: str


class FlashCard(BaseModel):

    course_id: int
    front: str
    back: str


class Summary(BaseModel):

    course_id: int
    content: str


class Chat(BaseModel):

    user_id: int
    course_id: int


class Message(BaseModel):

    chat_id: int
    sender_type: bool
    content: str
