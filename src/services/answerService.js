// Answer Service - handles saving and loading form answers
// Currently uses localStorage, can be replaced with REST API calls later

const ANSWERS_STORAGE_KEY = 'dynamicform_answers';
const QUESTIONS_STORAGE_KEY = 'dynamicform_questions';

/**
 * Save answers to storage
 * @param {Object} answers - Object containing question-answer pairs
 * @param {string} [accessToken] - Optional access token for authenticated operations
 * @returns {Promise} - Promise resolving to the saved answers
 */
export const saveAnswers = async (answers, accessToken) => {
  try {
    // Store in localStorage for now
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));

    console.log('Saving answers:', JSON.stringify(answers));

    // When we have a token and implement API integration:
    // if (accessToken) {
    //   const response = await fetch('/api/answers', {
    //     method: 'POST',
    //     headers: { 
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${accessToken}`
    //     },
    //     body: JSON.stringify(answers),
    //   });
    //   return response.json();
    // }

    return answers;
  } catch (error) {
    console.error('Error saving answers:', error);
    throw error;
  }
};

/**
 * Load answers from storage
 * @param {string} [accessToken] - Optional access token for authenticated operations
 * @returns {Promise} - Promise resolving to the loaded answers or null if none exist
 */
export const loadAnswers = async (accessToken) => {
  try {
    // Get from localStorage for now
    const storedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
    return storedAnswers ? JSON.parse(storedAnswers) : null;

    // When we have a token and implement API integration:
    // if (accessToken) {
    //   const response = await fetch('/api/answers', {
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`
    //     }
    //   });
    //   return response.json();
    // }
    // return null;
  } catch (error) {
    console.error('Error loading answers:', error);
    return null;
  }
};

/**
 * Save questions to storage
 * @param {Array} questions - Array of question objects
 * @param {string} [accessToken] - Optional access token for authenticated operations
 * @returns {Promise} - Promise resolving to the saved questions
 */
export const saveQuestions = async (questions, accessToken) => {
  try {
    // Store in localStorage for now
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    
    // When we have a token and implement API integration:
    // if (accessToken) {
    //   const response = await fetch('/api/questions', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${accessToken}`
    //     },
    //     body: JSON.stringify(questions),
    //   });
    //   return response.json();
    // }

    return questions;
  } catch (error) {
    console.error('Error saving questions:', error);
    throw error;
  }
};

/**
 * Load questions from storage
 * @param {string} [accessToken] - Optional access token for authenticated operations
 * @returns {Promise} - Promise resolving to the loaded questions or null if none exist
 */
export const loadQuestions = async (accessToken) => {
  try {
    // Get from localStorage for now
    const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    return storedQuestions ? JSON.parse(storedQuestions) : null;

    // When we have a token and implement API integration:
    // if (accessToken) {
    //   const response = await fetch('/api/questions', {
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`
    //     }
    //   });
    //   return response.json();
    // }
    // return null;
  } catch (error) {
    console.error('Error loading questions:', error);
    return null;
  }
};

/**
 * Clear all stored data (questions and answers)
 * @param {string} [accessToken] - Optional access token for authenticated operations
 * @returns {Promise} - Promise resolving when clear is complete
 */
export const clearAllStoredData = async (accessToken) => {
  try {
    // Remove from localStorage for now
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    localStorage.removeItem(ANSWERS_STORAGE_KEY);
    
    // When we have a token and implement API integration:
    // if (accessToken) {
    //   const response = await fetch('/api/clear', {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': `Bearer ${accessToken}`
    //     }
    //   });
    //   return response.ok;
    // }
    
    return true;
  } catch (error) {
    console.error('Error clearing stored data:', error);
    throw error;
  }
}; 