from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

# Load model and tokenizer
model_path = "roberta-base-openai-detector"
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

app = FastAPI()

# Allow frontend extension to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can later restrict this to your extension URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input format
class InputText(BaseModel):
    text: str

@app.post("/detect")
async def detect_text(data: InputText):
    inputs = tokenizer(data.text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    scores = torch.softmax(outputs.logits, dim=1)
    fake_score = scores[0][1].item()
    result = {
        "verdict": "AI-generated" if fake_score > 0.5 else "Human-written",
        "confidence": round(fake_score * 100, 2)
    }
    return result
