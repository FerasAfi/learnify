from unstructured.partition.pdf import partition_pdf
from unstructured.partition.docx import partition_docx
from unstructured.partition.html import partition_html
from unstructured.partition.text import partition_text
from youtube_transcript_api import *



def get_pdf(file):
    elements = partition_pdf(file)

    for element in elements:
        print(element.category, ":", element.text)


def get_docx(file):
    elements = partition_docx(file)

    for el in elements:
        print(el.category, ":", el.text)


def get_site(url):
    site = partition_html(url=url)

    for el in site:
        print(el.category, ":", el.text)


def get_txt(file):
    elements = partition_text(filename="notes.txt")

    for el in elements:
        print(el.text)





