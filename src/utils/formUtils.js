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