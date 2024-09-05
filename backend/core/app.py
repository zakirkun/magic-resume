import os
# import typesense
from typing import List
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from llama_index.llms.groq import Groq
from core.utils.prompt import prompt_extract, prompt_missing_skill, prompt_course_suggest
from core.utils.schema import ResponseSchema
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from apiclient.discovery import build # type: ignore

load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY", None)
MODEL_NAME = os.getenv("MODEL_NAME", None)
YOUTUBE_KEY = os.getenv("YOUTUBE_API_KEY", None)
llm = Groq(model=MODEL_NAME, api_key=API_KEY)
youtube = build('youtube','v3', developerKey = YOUTUBE_KEY)

origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=origins,
    allow_headers=origins,
)

def course_suggest(skill: List[str]) -> List[str]:
    response = llm.complete(prompt=prompt_missing_skill.format(text=",".join(skill)))
    parsing_resp = response.text.replace("result: ", "").split(",")
    parsing_resp = list(map(lambda x: x.strip(), parsing_resp))
    if isinstance(parsing_resp, list):
        return parsing_resp
    else:
        return "Failed to Parsing Entity from Resume..."

def misssing_skill(text_resume: str) -> List[str]:
    response = llm.complete(prompt=prompt_missing_skill.format(text=text_resume))
    parsing_resp = response.text.replace("result: ", "").split(",")
    parsing_resp = list(map(lambda x: x.strip(), parsing_resp))
    if isinstance(parsing_resp, list):
        return parsing_resp
    else:
        return "Failed to Parsing Entity from Resume..."

def youtube_search(query, max_results=10) -> List[str]:
    search_response = youtube.search().list(
        q=query,
        part='id,snippet',
        maxResults=max_results
    ).execute()

    # Store and print the results
    videos = []
    for item in search_response['items']:
        if item['id']['kind'] == 'youtube#video':
            video_data = {
                'title': item['snippet']['title'],
                'videoId': item['id']['videoId'],
                'description': item['snippet']['description'],
            }
            videos.append(video_data)
    
    return videos
 
def extract_skill(text_resume: str) -> List[str]:
    response = llm.complete(prompt=prompt_extract.format(text=text_resume))
    parsing_resp = response.text.replace("result: ", "").split(",")
    parsing_resp = list(map(lambda x: x.strip(), parsing_resp))
    if isinstance(parsing_resp, list):
        return parsing_resp
    else:
        return "Failed to Parsing Entity from Resume..."


@app.get("/")
async def root():
    response = ResponseSchema(message="Success")
    return response

@app.post("/get-recommendation")
async def get_recommendation(file: UploadFile = File(...)):

    file_path = os.path.join("core/temporary", file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    skill = extract_skill(text)
    missing = misssing_skill(text)
    course = course_suggest(missing)
    arrayCourse = []
    
    for keyword in course:
        results = youtube_search(keyword, max_results=5)
        arrayCourse.append(results)
    
    print(f"{arrayCourse}")
    # remove pdf from temp
    os.remove(file_path)
    # todo put `arrayCourse` into result alif :p
    response = ResponseSchema(message="Success", result=[skill, missing, course, arrayCourse])
    
    return response