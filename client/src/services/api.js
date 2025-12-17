import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const translateEmotion = async (text, sessionId = 'default') => {
  try {
    console.log('🌐 Calling endpoint:', `${API_BASE_URL}/api/translate`);
    console.log('📤 Request data:', { text, sessionId });
    
    // Change from '/translate' to '/api/translate'
    const response = await api.post('/api/translate', { text, sessionId });
    
    console.log('✅ Response received:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Translation error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Return error object instead of throwing
    return {
      success: false,
      error: error.response?.data?.error || 
             `API Error: ${error.response?.status || 'No response'} - ${error.message}`
    };
  }
};

export const getTranslationHistory = async (sessionId = 'default') => {
  try {
    // Change from '/history' to '/api/history'
    const response = await api.get(`/api/history?sessionId=${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('History fetch error:', error);
    // Return error object instead of throwing
    return {
      success: false,
      error: error.response?.data?.error || 'Network error'
    };
  }
};

export default api;