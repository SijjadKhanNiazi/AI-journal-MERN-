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

template = PromptTemplate(
    template="""
    Summarize the following text in short and simple points:

    Text:
    {text}
    """,
    input_variables=["text"]
)

parser = StrOutputParser()


chain = template | model | parser


@app.post("/summarize")
async def summarize(data: TextData):

    result = chain.invoke({
        "text": data.text
    })

    return {
        "summary": result
    }