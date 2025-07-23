import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const ReviewPage = ({ incorrectQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!incorrectQuestions || incorrectQuestions.length === 0) {
      navigate('/');
      return;
    }

    const loadQuestions = async () => {
      setLoading(true);
      try {
        const questionPromises = incorrectQuestions.map(id => 
          quizAPI.reviewQuestion(id)
        );
        const loadedQuestions = await Promise.all(questionPromises);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Failed to load review questions:', error);
        alert('Failed to load questions for review.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [incorrectQuestions, navigate]);

  if (loading) {
    return (
      <div className="text-center">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading questions for review...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p>No questions to review.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      navigate('/results');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    }
  };

  const getOptionClass = (option) => {
    const baseClass = 'question-option';
    const optionLetter = option.charAt(0);
    
    if (!showAnswer) {
      return selectedAnswer === optionLetter ? `${baseClass} selected` : baseClass;
    }
    
    // After showing answer, highlight correct and incorrect
    if (currentQuestion.correct_answer === optionLetter) {
      return `${baseClass} correct`;
    } else if (selectedAnswer === optionLetter) {
      return `${baseClass} incorrect`;
    }
    
    return baseClass;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Review Mode
          </h1>
          <button
            onClick={() => navigate('/results')}
            className="btn-secondary"
          >
            Back to Results
          </button>
        </div>
        <p className="text-gray-600">
          Review the questions you got wrong to improve your understanding.
        </p>
      </div>

      {/* Progress */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            Domain: {currentQuestion.domain}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
              disabled={showAnswer}
              className={getOptionClass(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Show Answer Button */}
        {!showAnswer && (
          <div className="text-center mb-6">
            <button
              onClick={handleShowAnswer}
              disabled={!selectedAnswer}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Show Answer & Explanation
            </button>
          </div>
        )}

        {/* Explanation */}
        {showAnswer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-start mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Correct Answer: {currentQuestion.correct_answer}
              </span>
              {selectedAnswer && (
                                 <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                   selectedAnswer === currentQuestion.correct_answer
                     ? 'bg-green-100 text-green-800'
                     : 'bg-red-100 text-red-800'
                 }`}>
                  Your Answer: {selectedAnswer} {selectedAnswer === currentQuestion.correct_answer ? '✓' : '✗'}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-700 mt-3">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </div>
            {currentQuestion.documentation_link && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <a
                  href={currentQuestion.documentation_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  📚 Read Official Documentation
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {showAnswer && (
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              {isLastQuestion ? 'Back to Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Review Progress</h3>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setSelectedAnswer('');
                setShowAnswer(false);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage; 