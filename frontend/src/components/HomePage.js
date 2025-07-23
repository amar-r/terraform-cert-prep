import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const HomePage = ({ onQuizStart }) => {
  const [loading, setLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(20);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const quizData = await quizAPI.startQuiz(numQuestions);
      onQuizStart(quizData);
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert('Failed to start quiz. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="card max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Terraform Cert Prep
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Practice for the HashiCorp Certified: Terraform Associate exam with 
            realistic multiple-choice questions covering all exam domains.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Exam Domains Covered</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Infrastructure as Code (IaC) concepts</li>
              <li>• Terraform CLI usage</li>
              <li>• State management</li>
              <li>• Variables and outputs</li>
              <li>• Modules and providers</li>
              <li>• Terraform Cloud/Enterprise</li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Multiple-choice questions (A-D format)</li>
              <li>• Instant feedback with explanations</li>
              <li>• Score tracking and results</li>
              <li>• Review mode for missed questions</li>
              <li>• Realistic exam simulation</li>
            </ul>
          </div>
        </div>

        {/* Quiz Configuration */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value={10}>10 Questions (Quick Practice)</option>
            <option value={20}>20 Questions (Recommended)</option>
            <option value={30}>30 Questions (Extended Practice)</option>
            <option value={55}>🎯 Full Exam Simulation (55 Questions - 1 Hour)</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          disabled={loading}
          className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Starting Quiz...
            </span>
          ) : (
            'Start Quiz'
          )}
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-sm text-gray-500">
        <p>💡 Tip: This practice exam simulates the real HashiCorp Terraform Associate certification exam format.</p>
        <p className="mt-2">⏱️ Take your time to read each question carefully and review explanations.</p>
        <p className="mt-2">🔀 Questions are randomized each time you take a quiz for better practice variety.</p>
        <p className="mt-2">🎯 Full Exam Simulation provides a realistic 1-hour exam experience with 55 questions.</p>
      </div>
    </div>
  );
};

export default HomePage; 