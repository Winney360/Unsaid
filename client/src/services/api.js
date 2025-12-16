import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const translateEmotion = async (text, sessionId = 'default') => {
  try {
    const response = await api.post('/translate', { text, sessionId });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    throw error.response?.data || { error: 'Network error' };
  }
};

export const getTranslationHistory = async (sessionId = 'default') => {
  try {
    const response = await api.get(`/history?sessionId=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('History fetch error:', error);
    throw error.response?.data || { error: 'Network error' };
  }
};

export default api;