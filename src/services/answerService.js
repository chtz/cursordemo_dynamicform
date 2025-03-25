// Answer Service - handles saving and loading form answers
// Currently uses localStorage, can be replaced with REST API calls later

const ANSWERS_STORAGE_KEY = 'dynamicform_answers';
const QUESTIONS_STORAGE_KEY = 'dynamicform_questions';

/**
 * Save answers to storage
 * @param {Object} answers - Object containing question-answer pairs
 * @returns {Promise} - Promise resolving to the saved answers
 */
export const saveAnswers = async (answers) => {
  try {
    // Store in localStorage for now
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));

    console.log('Saving answers:', answers);

    return answers;

    // When switching to REST API, replace with:
    // const response = await fetch('/api/answers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(answers),
    // });
    // return response.json();
  } catch (error) {
    console.error('Error saving answers:', error);
    throw error;
  }
};

/**
 * Load answers from storage
 * @returns {Promise} - Promise resolving to the loaded answers or null if none exist
 */
export const loadAnswers = async () => {
  try {
    // Get from localStorage for now
    const storedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
    return storedAnswers ? JSON.parse(storedAnswers) : null;

    // When switching to REST API, replace with:
    // const response = await fetch('/api/answers');
    // return response.json();
  } catch (error) {
    console.error('Error loading answers:', error);
    return null;
  }
};

/**
 * Save questions to storage
 * @param {Array} questions - Array of question objects
 * @returns {Promise} - Promise resolving to the saved questions
 */
export const saveQuestions = async (questions) => {
  try {
    // Store in localStorage for now
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    return questions;

    // When switching to REST API, replace with:
    // const response = await fetch('/api/questions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(questions),
    // });
    // return response.json();
  } catch (error) {
    console.error('Error saving questions:', error);
    throw error;
  }
};

/**
 * Load questions from storage
 * @returns {Promise} - Promise resolving to the loaded questions or null if none exist
 */
export const loadQuestions = async () => {
  try {
    // Get from localStorage for now
    const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    return storedQuestions ? JSON.parse(storedQuestions) : null;

    // When switching to REST API, replace with:
    // const response = await fetch('/api/questions');
    // return response.json();
  } catch (error) {
    console.error('Error loading questions:', error);
    return null;
  }
};

/**
 * Clear all stored data (questions and answers)
 * @returns {Promise} - Promise resolving when clear is complete
 */
export const clearAllStoredData = async () => {
  try {
    // Remove from localStorage for now
    localStorage.removeItem(QUESTIONS_STORAGE_KEY);
    localStorage.removeItem(ANSWERS_STORAGE_KEY);
    return true;
    
    // When switching to REST API, replace with:
    // const response = await fetch('/api/clear', { method: 'DELETE' });
    // return response.ok;
  } catch (error) {
    console.error('Error clearing stored data:', error);
    throw error;
  }
}; 