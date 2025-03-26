/**
 * Find a question item by its ID
 * @param {Array} formItems - The list of form items
 * @param {string} questionId - The ID of the question to find
 * @returns {Object|undefined} The question item or undefined if not found
 */
export const findQuestionById = (formItems, questionId) => {
  return formItems.find(item => item.id === questionId);
};

/**
 * Find option object by its ID
 * @param {Object} item - The question item containing options
 * @param {string} optionId - The ID of the option to find
 * @returns {Object|null} The option object or null if not found
 */
export const findOptionById = (item, optionId) => {
  if (!item || !item.options) return null;
  return item.options.find(option => option.id === optionId);
};

/**
 * Validates the form to ensure all questions have answers
 * @param {Array} formItems - The list of form items
 * @param {Object} userAnswers - Object containing user answers
 * @param {Object} translations - Translations for error messages
 * @param {string} language - Current language code
 * @returns {Object} Object with isValid boolean and errors object
 */
export const validateForm = (formItems, userAnswers, translations, language) => {
  const errors = {};
  let isValid = true;

  formItems.forEach(item => {
    // Skip validation for non-input items
    if (item.type === 'title' || (item.type === 'text' && !item.question)) {
      return;
    }

    const answer = userAnswers.answers[item.id];

    // Check if answer exists and is not empty
    if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
      errors[item.id] = translations[language].answerRequired;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {Function} onSuccess - Callback when parsing succeeds with parsed result
 * @param {Function} onError - Callback when parsing fails with error message
 * @param {Function} onNotArray - Callback when result is not an array (optional)
 * @returns {boolean} True if parsing succeeded, false otherwise
 */
export const safeParseJSON = (jsonString, onSuccess, onError, onNotArray) => {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (Array.isArray(parsed)) {
      onSuccess(parsed);
      return true;
    } else if (onNotArray) {
      onNotArray('JSON data must be an array');
      return false;
    } else {
      onError('JSON data must be an array');
      return false;
    }
  } catch (error) {
    onError('Invalid JSON format');
    return false;
  }
};

/**
 * Manages the editing state to prevent circular updates
 * @param {Object} editingRef - useRef object to track editing state
 * @param {Function} action - Function to execute while editing state is active
 */
export const withEditingState = (editingRef, action) => {
  // Set editing flag to prevent effects from overriding
  editingRef.current = true;
  
  // Execute the action
  action();
  
  // Clear the editing flag after a short delay
  // This allows React to complete the current render cycle
  setTimeout(() => {
    editingRef.current = false;
  }, 0);
}; 