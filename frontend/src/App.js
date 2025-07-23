import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import ReviewPage from './components/ReviewPage';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏗️</span>
                <h1 className="text-2xl font-bold text-gray-900">
                  Terraform Cert Prep
                </h1>
              </div>
              <div className="text-sm text-gray-600">
                HashiCorp Certified: Terraform Associate
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  onQuizStart={(data) => setQuizData(data)}
                />
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <QuizPage 
                  quizData={quizData}
                  onQuizComplete={(results) => setQuizResults(results)}
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                <ResultsPage 
                  results={quizResults}
                />
              } 
            />
            <Route 
              path="/review" 
              element={
                <ReviewPage 
                  incorrectQuestions={quizResults?.summary?.incorrect_answers || []}
                />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>Practice exam for HashiCorp Certified: Terraform Associate</p>
              <p className="mt-1">This is not an official HashiCorp product</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 