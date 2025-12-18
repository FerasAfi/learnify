from unstructured.partition.pdf import partition_pdf
from unstructured.partition.docx import partition_docx
from unstructured.partition.html import partition_html
from unstructured.partition.text import partition_text
from youtube_transcript_api import YouTubeTranscriptApi
import requests
import os
import re



def get_yt(url):
    if ("https://www.youtube.com/watch?v=" not in url) and ("www.youtube.com/watch?v=" not in url):
        raise ValueError("Invalid URL: not a YouTube link")
    else:
        video_id = url.replace("https://www.youtube.com/watch?v=", "").replace("www.youtube.com/watch?v=", "")

    ytt_api = YouTubeTranscriptApi()
    fetched_transcript = ytt_api.fetch(video_id, languages=['en'])

    transcript = ""
    for snippet in fetched_transcript:
        transcript += snippet.text

    return(transcript)



def get_pdf(file_path):

    pdf_path = os.path.join("files", f"{file_path}.pdf")
    if not os.path.exists(pdf_path):
        raise ValueError(f"PDF file not found: {file_path}")

    try:
        elements = partition_pdf(pdf_path)
        text = "\n".join([el.text for el in elements if el.text])
        if not text.strip():
            raise ValueError("PDF appears to contain no readable text")
        return text
    except Exception:
        raise ValueError("Failed to extract text from PDF")



def get_docx(file_path):

    docx_path = os.path.join("files", f"{file_path}.docx")
    if not os.path.exists(docx_path):
        raise ValueError(f"DOCX file not found: {file_path+'.docx'}")

    try:
        elements = partition_docx(docx_path)
        text = "\n".join([el.text for el in elements if el.text])
        if not text.strip():
            raise ValueError("DOCX appears to contain no readable text")
        return text
    except Exception:
        raise ValueError("Failed to extract text from DOCX")

def get_site(url):

    if not url.startswith(("http://", "https://")):
        raise ValueError("Invalid website URL")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

    try:

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        html_text = response.text

        elements = partition_html(text=html_text)
        text = "\n".join([el.text for el in elements if el.text])

        if not text.strip():
            raise ValueError("Site contains no readable text")
        return clean_latex_tags(text)

    except requests.exceptions.RequestException as e:
        raise ValueError(f"Failed to fetch the URL: {e}")
    except Exception as e:
        raise ValueError(f"Failed to extract text from website: {e}")

def clean_latex_tags(text):
    if not text:
        return text

    text = re.sub(r'\{\\displaystyle\s+(.*?)\}', r'\1', text)
    text = re.sub(r'\\\((.+?)\\\)', r'\1', text)
    text = re.sub(r'\\\[(.+?)\\\]', r'\1', text)
    text = re.sub(r'\\(textbf|textit|emph|text|mathrm|mathbf)\{([^}]+)\}', r'\2', text)
    text = re.sub(r'\\[a-zA-Z]+\s*(\[[^\]]*\])?\s*\{([^}]+)\}', r'\2', text)
    text = re.sub(r'\\begin\{[^}]+\}(.*?)\\end\{[^}]+\}', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\\([a-zA-Z]+)\b', '', text)
    text = re.sub(r'\{\s*\}', '', text)
    text = re.sub(r'\{[^{}]*\\[a-zA-Z]+[^{}]*\}', '', text)

    math_envs = ['align', 'equation', 'gather', 'multline', 'split', 'matrix', 'cases']
    for env in math_envs:
        text = re.sub(r'\\begin\{' + re.escape(env) + r'\}(?:\[[^\]]*\])?', '', text)
        text = re.sub(r'\\end\{' + re.escape(env) + r'\}', '', text)

    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s*([.,;:!?])\s*', r'\1 ', text)

    return text.strip()

def get_txt(file_path):

    txt_path = os.path.join("files", f"{file_path}.txt")
    if not os.path.exists(txt_path):
        raise ValueError(f"TXT file not found: {file_path}")

    try:
        elements = partition_text(txt_path)
        text = "\n".join([el.text for el in elements if el.text])
        if not text.strip():
            raise ValueError("TXT file appears to contain no readable text")
        return text
    except Exception:
        raise ValueError("Failed to extract text from TXT file")

