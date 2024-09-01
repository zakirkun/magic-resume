import os
# import typesense
from typing import List
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from llama_index.llms.groq import Groq
from core.utils.prompt import prompt_extract
from core.utils.schema import ResponseSchema
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY", None)
MODEL_NAME = os.getenv("MODEL_NAME", None)
llm = Groq(model=MODEL_NAME, api_key=API_KEY)

origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=origins,
    allow_headers=origins,
)

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
    response = ResponseSchema(message="Success...")
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
    response = ResponseSchema(message="Success...", result=skill)

    return response