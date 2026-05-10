from fastapi import FastAPI
from pydantic import BaseModel
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class TextData(BaseModel):
    text: str


llm = HuggingFaceEndpoint(
    repo_id="MiniMaxAI/MiniMax-M2.7",
    task="text-generation",
)
model = ChatHuggingFace(llm=llm)
parser = StrOutputParser()


summary_template = PromptTemplate(
    template="Summarize the following text in short and simple points:\n\nText:\n{text}",
    input_variables=["text"]
)
summary_chain = summary_template | model | parser


quiz_template = PromptTemplate(
    template="""
    Based on the text provided, create a 3-question multiple-choice quiz. 
    Include the correct answers at the end.

    Text:
    {text}
    """,
    input_variables=["text"]
)
quiz_chain = quiz_template | model | parser



@app.post("/summarize")
async def summarize(data: TextData):
    result = summary_chain.invoke({"text": data.text})
    return {"summary": result}

@app.post("/generate-quiz")
async def generate_quiz(data: TextData):
    # This is the functionality for when the user clicks 'Quiz Generation'
    result = quiz_chain.invoke({"text": data.text})
    return {
        "quiz": result
    }