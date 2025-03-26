// Answer Service - handles saving and loading form answers
// Now uses HTTP API with Bearer authentication

const API_BASE_URL = 'https://mykvstoredev.unliked.in/api/values';
const ANSWERS_STORAGE_KEY = 'dynamicform_answers';
const QUESTIONS_STORAGE_KEY = 'dynamicform_questions';

/**
 * Save answers to storage
 * @param {Object} answers - Object containing question-answer pairs
 * @param {string} [accessToken] - Access token for authenticated operations
 * @returns {Promise} - Promise resolving to the saved answers
 */
export const saveAnswers = async (answers, accessToken) => {
  try {
    if (!accessToken) {
      console.error('No access token provided for saving answers');
      throw new Error('Authentication required');
    }

    // Convert answers object to string for storage
    const answersString = JSON.stringify(answers);
    
    // Save to API
    const response = await fetch(`${API_BASE_URL}/${ANSWERS_STORAGE_KEY}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/text',
        'Authorization': `Bearer ${accessToken}`
      },
      body: answersString
    });

    if (!response.ok) {
      throw new Error(`Failed to save answers: ${response.status} ${response.statusText}`);
    }

    return answers;
  } catch (error) {
    console.error('Error saving answers:', error);
    throw error;
  }
};

/**
 * Load answers from storage
 * @param {string} [accessToken] - Access token for authenticated operations
 * @returns {Promise} - Promise resolving to the loaded answers or null if none exist
 */
export const loadAnswers = async (accessToken) => {
  try {
    if (!accessToken) {
      console.warn('No access token provided for loading answers');
      return null;
    }

    // Load from API
    const response = await fetch(`${API_BASE_URL}/${ANSWERS_STORAGE_KEY}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Handle 404 for missing data
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to load answers: ${response.status} ${response.statusText}`);
    }

    // Get text response and parse as JSON
    const answersText = await response.text();
    return JSON.parse(answersText);
  } catch (error) {
    console.error('Error loading answers:', error);
    return null;
  }
};

/**
 * Save questions to storage
 * @param {Array} questions - Array of question objects
 * @param {string} [accessToken] - Access token for authenticated operations
 * @returns {Promise} - Promise resolving to the saved questions
 */
export const saveQuestions = async (questions, accessToken) => {
  try {
    if (!accessToken) {
      console.error('No access token provided for saving questions');
      throw new Error('Authentication required');
    }

    // Convert questions array to string for storage
    const questionsString = JSON.stringify(questions);
    
    // Save to API
    const response = await fetch(`${API_BASE_URL}/${QUESTIONS_STORAGE_KEY}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/text',
        'Authorization': `Bearer ${accessToken}`
      },
      body: questionsString
    });

    if (!response.ok) {
      throw new Error(`Failed to save questions: ${response.status} ${response.statusText}`);
    }

    return questions;
  } catch (error) {
    console.error('Error saving questions:', error);
    throw error;
  }
};

/**
 * Load questions from storage
 * @param {string} [accessToken] - Access token for authenticated operations
 * @returns {Promise} - Promise resolving to the loaded questions or null if none exist
 */
export const loadQuestions = async (accessToken) => {
  try {
    if (!accessToken) {
      console.warn('No access token provided for loading questions');
      return null;
    }

    // Load from API
    const response = await fetch(`${API_BASE_URL}/${QUESTIONS_STORAGE_KEY}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Handle 404 for missing data
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.status} ${response.statusText}`);
    }

    // Get text response and parse as JSON
    const questionsText = await response.text();
    return JSON.parse(questionsText);
  } catch (error) {
    console.error('Error loading questions:', error);
    return null;
  }
};

/**
 * Clear all stored data (questions and answers)
 * @param {string} [accessToken] - Access token for authenticated operations
 * @returns {Promise} - Promise resolving when clear is complete
 */
export const clearAllStoredData = async (accessToken) => {
  try {
    if (!accessToken) {
      console.error('No access token provided for clearing data');
      throw new Error('Authentication required');
    }

    // Delete data using the DELETE endpoints
    const deleteAnswersPromise = fetch(`${API_BASE_URL}/${ANSWERS_STORAGE_KEY}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const deleteQuestionsPromise = fetch(`${API_BASE_URL}/${QUESTIONS_STORAGE_KEY}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Wait for both delete operations to complete
    const [answersResponse, questionsResponse] = await Promise.all([
      deleteAnswersPromise, 
      deleteQuestionsPromise
    ]);

    // Check for errors
    if (!answersResponse.ok && answersResponse.status !== 404) {
      throw new Error(`Failed to delete answers: ${answersResponse.status} ${answersResponse.statusText}`);
    }

    if (!questionsResponse.ok && questionsResponse.status !== 404) {
      throw new Error(`Failed to delete questions: ${questionsResponse.status} ${questionsResponse.statusText}`);
    }

    console.log('All data successfully cleared from API storage');
    return true;
  } catch (error) {
    console.error('Error clearing stored data:', error);
    throw error;
  }
}; 