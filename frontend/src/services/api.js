import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizAPI = {
  // Start a new quiz
  startQuiz: async (numQuestions = 20) => {
    const response = await api.get(`/quiz/start?num_questions=${numQuestions}`);
    return response.data;
  },

  // Submit an answer for a question
  submitAnswer: async (questionId, selectedAnswer) => {
    const response = await api.post('/quiz/submit', {
      question_id: questionId,
      selected_answer: selectedAnswer,
    });
    return response.data;
  },

  // Complete the quiz and get results
  completeQuiz: async (answers) => {
    const response = await api.post('/quiz/complete', answers);
    return response.data;
  },

  // Get question details for review mode
  reviewQuestion: async (questionId) => {
    const response = await api.get(`/quiz/review/${questionId}`);
    return response.data;
  },

  // Get all questions
  getAllQuestions: async () => {
    const response = await api.get('/questions');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 