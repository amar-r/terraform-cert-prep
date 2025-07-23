import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsPage = ({ results }) => {
  const navigate = useNavigate();

  if (!results) {
    return (
      <div className="text-center">
        <p>No results found. Please complete a quiz first.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const { summary, results: questionResults } = results;
  const passThreshold = 70;
  const passed = summary.score_percentage >= passThreshold;

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 80) return 'bg-blue-100';
    if (percentage >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Score Summary */}
      <div className="card text-center mb-8">
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(summary.score_percentage)} mb-4`}>
            <span className={`text-3xl font-bold ${getScoreColor(summary.score_percentage)}`}>
              {Math.round(summary.score_percentage)}%
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h2>
          <p className={`text-xl font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? '🎉 Congratulations! You passed!' : '📚 Keep studying! You need 70% to pass.'}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{summary.total_questions}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.correct_answers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {summary.total_questions - summary.correct_answers}
            </div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Take Another Quiz
          </button>
          {summary.incorrect_answers.length > 0 && (
            <button
              onClick={() => navigate('/review')}
              className="btn-secondary"
            >
              Review Missed Questions ({summary.incorrect_answers.length})
            </button>
          )}
        </div>
      </div>

      {/* Domain Performance */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance by Domain</h3>
        <p className="text-gray-600">
          Domain breakdown would be shown here in a full implementation.
          This requires additional data from the backend about question domains.
        </p>
      </div>

      {/* Question Review */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h3>
        <div className="space-y-4">
          {questionResults.map((result, index) => (
            <div
              key={result.question_id}
              className={`p-4 rounded-lg border-l-4 ${
                result.is_correct 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${
                      result.is_correct 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Question {index + 1}
                    </span>
                    <span className={`text-sm font-medium ${
                      result.is_correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.is_correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Your answer:</strong> {result.selected_answer} • <strong>Correct answer:</strong> {result.correct_answer}
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      {!passed && (
        <div className="card mt-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Study Tips</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Review the official Terraform documentation and tutorials</li>
            <li>• Practice with hands-on labs and real Terraform configurations</li>
            <li>• Focus on areas where you got questions wrong</li>
            <li>• Take practice exams regularly to track your progress</li>
            <li>• Join the HashiCorp community forums for additional help</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsPage; 