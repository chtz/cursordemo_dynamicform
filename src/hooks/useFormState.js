import { useState, useEffect, useRef } from 'react';
import { loadAnswers, saveAnswers, loadQuestions, saveQuestions, clearAllStoredData } from '../services/answerService';
import { initialFormItems, DEFAULT_LANGUAGE } from '../constants';
import { validateForm, safeParseJSON, withEditingState } from '../utils/formUtils';
import { uiTranslations } from '../translations';
import { setTimedStatus } from '../utils/timerUtils';

/**
 * Custom hook for managing form state, answers, and validation
 * 
 * This hook encapsulates all the state and logic for the dynamic form:
 * - Form items definition and rendering
 * - User answers management
 * - Validation
 * - Debug mode with JSON editing
 * - Internationalization
 * - Persistence through localStorage
 * 
 * @returns {Object} Form state and handlers
 */
export const useFormState = () => {
  // Form state
  const [formItems, setFormItems] = useState(initialFormItems);
  const [questionsJson, setQuestionsJson] = useState('');
  const [userAnswers, setUserAnswers] = useState({ language: DEFAULT_LANGUAGE, answers: {} });
  const [saveStatus, setSaveStatus] = useState('');
  const [questionsStatus, setQuestionsStatus] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  
  // Flag to prevent form items from updating the JSON text 
  // This breaks the circular dependency between form items and JSON text
  const isEditing = useRef(false);

  /**
   * Helper function to get text in current language with fallback to English
   * @param {Object} textObj - Object containing translations keyed by language code
   * @returns {string} Text in the current language or fallback
   */
  const getText = (textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.en || '';
  };

  // Load questions and answers from storage when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load questions
        const savedQuestions = await loadQuestions();
        if (savedQuestions) {
          console.log('Loaded questions from localStorage:', JSON.stringify(savedQuestions));
          setFormItems(savedQuestions);
          setQuestionsStatus(getText(uiTranslations[language].loadedSuccessfully));
        } else {
          console.log('No saved questions found, using initial questions');
          // No saved questions, use initial questions
          setFormItems(initialFormItems);
        }

        // Load answers
        const savedAnswers = await loadAnswers();
        if (savedAnswers) {
          // Check if answers are in the new format (with language)
          if (savedAnswers.language && savedAnswers.answers) {
            setUserAnswers(savedAnswers);
            // Set the language based on saved preference
            setLanguage(savedAnswers.language);
          } else {
            // Handle legacy format (just answers object)
            setUserAnswers({ language, answers: savedAnswers });
          }
          setTimedStatus(setSaveStatus, uiTranslations[language].loadedSuccessfully);
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
        setQuestionsStatus(`Error loading questions: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  // Update questions JSON when debug mode is toggled or when form items change,
  // but only if we're not actively editing
  useEffect(() => {
    if (debugMode && !isEditing.current) {
      setQuestionsJson(JSON.stringify(formItems, null, 2));
    }
  }, [debugMode, formItems]);

  /**
   * Handle language change
   * @param {Object} e - Event object containing the selected language
   */
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);

    // Update the language in the userAnswers object
    setUserAnswers(prev => ({
      ...prev,
      language: newLanguage
    }));

    // Update status messages with new language
    if (saveStatus) {
      setSaveStatus(uiTranslations[newLanguage][saveStatus]);
    }
  };

  /**
   * Handle choice/radio button change
   * @param {string} questionId - ID of the question being answered
   * @param {string} optionId - ID of the selected option
   */
  const handleChoiceChange = (questionId, optionId) => {
    setUserAnswers(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionId
      }
    }));

    // Clear validation error for this question when answered
    if (validationErrors[questionId]) {
      const newErrors = { ...validationErrors };
      delete newErrors[questionId];
      setValidationErrors(newErrors);
    }
  };

  /**
   * Handle text input change
   * @param {string} questionId - ID of the question being answered
   * @param {string} value - Text value entered by the user
   */
  const handleTextChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));

    // Clear validation error for this question if it has content
    if (value.trim() && validationErrors[questionId]) {
      const newErrors = { ...validationErrors };
      delete newErrors[questionId];
      setValidationErrors(newErrors);
    }
  };

  /**
   * Validate the form to ensure all questions have answers
   * @returns {boolean} True if the form is valid, false otherwise
   */
  const validateFormData = () => {
    const { isValid, errors } = validateForm(formItems, userAnswers, uiTranslations, language);
    setValidationErrors(errors);
    return isValid;
  };

  /**
   * Handle form submission
   * @param {Object} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFormData()) {
      handleSaveAnswers();
    } else {
      setTimedStatus(setSaveStatus, uiTranslations[language].pleaseAnswerAll);

      // Scroll to the first error if any
      const firstErrorQuestion = Object.keys(validationErrors)[0];
      if (firstErrorQuestion) {
        const errorElement = document.querySelector(`[data-question="${firstErrorQuestion}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  /**
   * Handle saving answers to localStorage
   */
  const handleSaveAnswers = async () => {
    try {
      // Save both the answers and the current language
      await saveAnswers(userAnswers);
      setTimedStatus(setSaveStatus, uiTranslations[language].savedSuccessfully);
    } catch (error) {
      setTimedStatus(setSaveStatus, uiTranslations[language].errorSaving);
    }
  };

  /**
   * Handle loading answers from localStorage
   */
  const handleLoadAnswers = async () => {
    try {
      const savedAnswers = await loadAnswers();
      if (savedAnswers) {
        // Check if answers are in the new format
        if (savedAnswers.language && savedAnswers.answers) {
          setUserAnswers(savedAnswers);
          // Set the language based on saved preference
          setLanguage(savedAnswers.language);
        } else {
          // Handle legacy format
          setUserAnswers({ language, answers: savedAnswers });
        }
        setTimedStatus(setSaveStatus, uiTranslations[language].loadedSuccessfully);
      } else {
        setTimedStatus(setSaveStatus, uiTranslations[language].noSavedAnswers);
      }

      // Clear validation errors when loading new answers
      setValidationErrors({});
    } catch (error) {
      setTimedStatus(setSaveStatus, uiTranslations[language].errorLoading);
    }
  };

  /**
   * Handle changes to the JSON editor
   * Updates form items when JSON is valid, but preserves user formatting
   * @param {Object} e - Change event from the textarea
   */
  const handleQuestionsJsonChange = (e) => {
    const newValue = e.target.value;
    
    // Always update the displayed JSON text with exactly what user typed
    withEditingState(isEditing, () => {
      setQuestionsJson(newValue);
      
      // Try to parse the JSON and update form items if valid
      safeParseJSON(
        newValue,
        // On success
        (parsedQuestions) => {
          setFormItems(parsedQuestions);
          setJsonError('');
        },
        // On error
        (errorMsg) => {
          setJsonError(errorMsg);
        }
      );
    });
  };

  /**
   * Format JSON in the textarea (explicit user action)
   * Only formats when the user clicks the button
   */
  const formatJson = () => {
    safeParseJSON(
      questionsJson,
      // On success
      (parsedJson) => {
        withEditingState(isEditing, () => {
          // Only format on explicit user action
          setQuestionsJson(JSON.stringify(parsedJson, null, 2));
          setJsonError('');
        });
      },
      // On error
      (errorMsg) => {
        setJsonError(`Cannot format: ${errorMsg}`);
      }
    );
  };

  /**
   * Handle saving questions to localStorage
   * Parses and validates JSON before saving
   */
  const handleSaveQuestions = async () => {
    safeParseJSON(
      questionsJson,
      // On success
      async (parsedQuestions) => {
        try {
          // Update form items and save them
          setFormItems(parsedQuestions);
          await saveQuestions(parsedQuestions);
          setTimedStatus(setQuestionsStatus, uiTranslations[language].savedSuccessfully);
        } catch (error) {
          setTimedStatus(
            setQuestionsStatus, 
            `${uiTranslations[language].errorSaving}: ${error.message}`
          );
        }
      },
      // On error
      (errorMsg) => {
        setJsonError(errorMsg);
      },
      // On not array
      (errorMsg) => {
        setJsonError(errorMsg);
      }
    );
  };

  /**
   * Handle loading questions from localStorage
   */
  const handleLoadQuestions = async () => {
    try {
      const savedQuestions = await loadQuestions();
      if (savedQuestions) {
        withEditingState(isEditing, () => {
          setFormItems(savedQuestions);
          setQuestionsJson(JSON.stringify(savedQuestions, null, 2));
        });
        setTimedStatus(setQuestionsStatus, uiTranslations[language].loadedSuccessfully);
      } else {
        setTimedStatus(setQuestionsStatus, uiTranslations[language].noSavedAnswers);
        
        withEditingState(isEditing, () => {
          setFormItems(initialFormItems);
          setQuestionsJson(JSON.stringify(initialFormItems, null, 2));
        });
      }

      // Reset validation errors when questions change
      setValidationErrors({});
    } catch (error) {
      setTimedStatus(
        setQuestionsStatus, 
        `${uiTranslations[language].errorLoading}: ${error.message}`
      );
    }
  };

  /**
   * Reset questions and answers to initial default and clear localStorage
   */
  const handleResetQuestions = async () => {
    try {
      // Clear all data from localStorage
      await clearAllStoredData();

      // Reset questions to initial state
      withEditingState(isEditing, () => {
        setFormItems(initialFormItems);
        setQuestionsJson(JSON.stringify(initialFormItems, null, 2));
      });

      // Reset answers
      setUserAnswers({ language, answers: {} });

      // Clear validation errors
      setValidationErrors({});

      // Update status messages
      setQuestionsStatus(uiTranslations[language].questionsReset);
      setSaveStatus(uiTranslations[language].answersCleared);

      // Clear status messages after delay
      setTimeout(() => {
        setQuestionsStatus('');
        setSaveStatus('');
      }, 3000);
    } catch (error) {
      setTimedStatus(setQuestionsStatus, `Error resetting data: ${error.message}`);
    }
  };

  /**
   * Toggle debug mode on/off
   */
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      // When turning debug mode on, update the JSON display
      withEditingState(isEditing, () => {
        setQuestionsJson(JSON.stringify(formItems, null, 2));
      });
    }
  };

  return {
    formItems,
    questionsJson,
    userAnswers,
    saveStatus,
    questionsStatus,
    debugMode,
    jsonError,
    validationErrors,
    language,
    getText,
    handleLanguageChange,
    handleChoiceChange,
    handleTextChange,
    handleSubmit,
    handleSaveAnswers,
    handleLoadAnswers,
    handleSaveQuestions,
    handleLoadQuestions,
    handleResetQuestions,
    toggleDebugMode,
    handleQuestionsJsonChange,
    formatJson
  };
}; 