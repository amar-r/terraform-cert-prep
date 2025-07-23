from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import random
from pathlib import Path

app = FastAPI(title="Terraform Cert Prep API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    domain: str

class QuizAnswer(BaseModel):
    question_id: int
    selected_answer: str

class QuizResult(BaseModel):
    question_id: int
    selected_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str

class QuizSession(BaseModel):
    total_questions: int
    correct_answers: int
    incorrect_answers: List[int]
    score_percentage: float

# Load questions from JSON file
def load_questions() -> List[Question]:
    questions_file = Path(__file__).parent / "data" / "questions.json"
    try:
        with open(questions_file, 'r') as f:
            questions_data = json.load(f)
        return [Question(**q) for q in questions_data]
    except FileNotFoundError:
        return []

# Global questions storage
questions_db = load_questions()

@app.get("/")
async def root():
    return {"message": "Terraform Cert Prep API", "version": "1.0.0"}

@app.get("/questions", response_model=List[Question])
async def get_all_questions():
    """Get all available questions"""
    return questions_db

@app.get("/questions/{question_id}", response_model=Question)
async def get_question(question_id: int):
    """Get a specific question by ID"""
    question = next((q for q in questions_db if q.id == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@app.get("/quiz/start")
async def start_quiz(num_questions: Optional[int] = 20):
    """Start a new quiz session with specified number of questions"""
    if num_questions > len(questions_db):
        num_questions = len(questions_db)
    
    # Shuffle questions to avoid repeating the same order
    shuffled_questions = random.sample(questions_db, num_questions)
    
    # Return shuffled questions (without answers for security)
    quiz_questions = []
    for q in shuffled_questions:
        quiz_questions.append({
            "id": q.id,
            "question": q.question,
            "options": q.options,
            "domain": q.domain
        })
    
    return {
        "questions": quiz_questions,
        "total_questions": num_questions,
        "message": "Quiz started successfully"
    }

@app.post("/quiz/submit", response_model=QuizResult)
async def submit_answer(answer: QuizAnswer):
    """Submit an answer for a specific question"""
    question = next((q for q in questions_db if q.id == answer.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = answer.selected_answer.upper() == question.correct_answer.upper()
    
    return QuizResult(
        question_id=answer.question_id,
        selected_answer=answer.selected_answer,
        correct_answer=question.correct_answer,
        is_correct=is_correct,
        explanation=question.explanation
    )

@app.post("/quiz/complete")
async def complete_quiz(answers: List[QuizAnswer]):
    """Complete the quiz and get final results"""
    results = []
    correct_count = 0
    incorrect_questions = []
    
    for answer in answers:
        question = next((q for q in questions_db if q.id == answer.question_id), None)
        if question:
            is_correct = answer.selected_answer.upper() == question.correct_answer.upper()
            if is_correct:
                correct_count += 1
            else:
                incorrect_questions.append(answer.question_id)
            
            results.append(QuizResult(
                question_id=answer.question_id,
                selected_answer=answer.selected_answer,
                correct_answer=question.correct_answer,
                is_correct=is_correct,
                explanation=question.explanation
            ))
    
    total_questions = len(answers)
    score_percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0
    
    return {
        "results": results,
        "summary": QuizSession(
            total_questions=total_questions,
            correct_answers=correct_count,
            incorrect_answers=incorrect_questions,
            score_percentage=round(score_percentage, 2)
        )
    }

@app.get("/quiz/review/{question_id}", response_model=Question)
async def review_question(question_id: int):
    """Get question details for review mode"""
    question = next((q for q in questions_db if q.id == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@app.get("/health")
async def health_check():
    return {"status": "healthy", "questions_loaded": len(questions_db)} 