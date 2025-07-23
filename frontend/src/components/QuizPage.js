import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const QuizPage = ({ quizData, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizData || !quizData.questions) {
      navigate('/');
    }
  }, [quizData, navigate]);

  if (!quizData || !quizData.questions) {
    return (
      <div className="text-center">
        <p>No quiz data found. Please start a new quiz.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const submittedAnswer = submittedAnswers[currentQuestion.id];

  const handleAnswerSelect = (answer) => {
    if (submittedAnswer) return; // Prevent changing after submission
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer
    });
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;
    
    setLoading(true);
    try {
      const result = await quizAPI.submitAnswer(currentQuestion.id, selectedAnswer);
      setSubmittedAnswers({
        ...submittedAnswers,
        [currentQuestion.id]: result
      });
      setShowExplanation(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      handleCompleteQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleCompleteQuiz = async () => {
    setLoading(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        selected_answer: answer
      }));
      
      const results = await quizAPI.completeQuiz(answers);
      onQuizComplete(results);
      navigate('/results');
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      alert('Failed to complete quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOptionClass = (option) => {
    const baseClass = 'question-option';
    const optionLetter = option.charAt(0);
    
    if (!submittedAnswer) {
      return selectedAnswer === optionLetter ? `${baseClass} selected` : baseClass;
    }
    
    // After submission, show correct/incorrect
    if (submittedAnswer.correct_answer === optionLetter) {
      return `${baseClass} correct`;
    } else if (selectedAnswer === optionLetter) {
      return `${baseClass} incorrect`;
    }
    
    return baseClass;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Domain: {currentQuestion.domain}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option.charAt(0))}
              disabled={submittedAnswer}
              className={getOptionClass(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && submittedAnswer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-start mb-2">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                 submittedAnswer.is_correct 
                   ? 'bg-green-100 text-green-800' 
                   : 'bg-red-100 text-red-800'
               }`}>
                {submittedAnswer.is_correct ? '✓ Correct' : '✗ Incorrect'}
              </span>
              <span className="ml-3 text-sm text-gray-600">
                Correct answer: {submittedAnswer.correct_answer}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Explanation:</strong> {submittedAnswer.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
            disabled={loading}
          >
            Exit Quiz
          </button>
          
          <div className="space-x-3">
            {!submittedAnswer ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Answer'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Please wait...' : (isLastQuestion ? 'Complete Quiz' : 'Next Question')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Question Progress</h3>
        <div className="grid grid-cols-10 gap-2">
          {quizData.questions.map((_, index) => (
            <div
              key={index}
                             className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                 index < currentQuestionIndex
                   ? 'bg-green-100 border-green-300 text-green-800'
                   : index === currentQuestionIndex
                   ? 'bg-blue-100 border-blue-300 text-blue-800'
                   : 'bg-gray-100 border-gray-300 text-gray-600'
               }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 