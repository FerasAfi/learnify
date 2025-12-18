from dotenv import load_dotenv
import google.generativeai as genai
import os, json

load_dotenv(dotenv_path="D:/Coding/Projects/Learnify/Backend/.env")

genai.configure(api_key=os.getenv("API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash-lite")


def generate_content(transcript):
    prompt = f"""
    You are an assistant that returns ONLY JSON. No explanations.
    {{
      "course_title": <brief title of the the course from the transcript> 
      "summary": "Please generate a detailed summary from the transcript or the subject included.",
      "flashcards": [
        {{
          "front": "<question>",
          "back": "<answer>"
        }} more than 30 flashcards
      ],
      "quiz": [
        {{
          "question": "<question text>",
          "options": ["A", "B", "C", "D"],
          "answer": "<correct optio n letter>"
        }} 20 questions exactly
      ],
      "transcript": "{transcript}"
    }}
    """

    response = model.generate_content(prompt)


    cleaned = response.text.strip().strip("```json").strip("```")
    content = json.loads(cleaned)

    course_title = content['course_title']
    summary = content['summary']
    flashcards = content['flashcards']
    quiz = content['quiz']


    return course_title, summary, flashcards, quiz