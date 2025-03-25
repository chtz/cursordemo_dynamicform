// Answer Service - handles saving and loading form answers
// Currently uses localStorage, can be replaced with REST API calls later

const STORAGE_KEY = 'dynamicform_answers';

/**
 * Save answers to storage
 * @param {Object} answers - Object containing question-answer pairs
 * @returns {Promise} - Promise resolving to the saved answers
 */
export const saveAnswers = async (answers) => {
  try {
    // Store in localStorage for now
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
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
    const storedAnswers = localStorage.getItem(STORAGE_KEY);
    return storedAnswers ? JSON.parse(storedAnswers) : null;
    
    // When switching to REST API, replace with:
    // const response = await fetch('/api/answers');
    // return response.json();
  } catch (error) {
    console.error('Error loading answers:', error);
    return null;
  }
}; 