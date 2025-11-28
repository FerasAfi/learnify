import google.generativeai as genai


genai.configure(api_key="AIzaSyCZfYs3jR2MHr8NVGnmYj57Od0bh66z9rY")

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_content(transcript):
    prompt = f"""
    {{
      "summary": "Please generate a brief summary of the transcript.",
      "flashcards": [
        {{
          "front": "<question or term>",
          "back": "<answer or explanation>"
        }} more than 30 flashcards
      ],
      "quiz": [
        {{
          "question": "<question text>",
          "options": ["A", "B", "C", "D"],
          "answer": "<correct option letter>"
        }} 20 questions exactly
      ],
      "transcript": "{transcript}"
    }}
    """

    response = model.generate_content(prompt)

    return response.text