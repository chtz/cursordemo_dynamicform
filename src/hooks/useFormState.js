import { useState, useEffect, useRef } from 'react';
import { loadAnswers, saveAnswers, loadQuestions, saveQuestions, clearAllStoredData } from '../services/answerService';
import { initialFormItems, DEFAULT_LANGUAGE } from '../constants';
import { validateForm } from '../utils/formUtils';
import { uiTranslations } from '../translations';
import { setTimedStatus } from '../utils/timerUtils';

/**
 * Custom hook for managing form state, answers, and validation
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

  // Helper function to get text in current language
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

  // Handle language change
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

  // Handle choice/radio button change
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

  // Handle text input change
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

  // Validate the form to ensure all questions have answers
  const validateFormData = () => {
    const { isValid, errors } = validateForm(formItems, userAnswers, uiTranslations, language);
    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission
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

  // Handle saving answers
  const handleSaveAnswers = async () => {
    try {
      // Save both the answers and the current language
      await saveAnswers(userAnswers);
      setTimedStatus(setSaveStatus, uiTranslations[language].savedSuccessfully);
    } catch (error) {
      setTimedStatus(setSaveStatus, uiTranslations[language].errorSaving);
    }
  };

  // Handle loading answers
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

  // Handle questions JSON edit
  const handleQuestionsJsonChange = (e) => {
    // Set editing flag to prevent the effect from overriding
    isEditing.current = true;
    
    const newValue = e.target.value;
    // Always update the displayed JSON text with exactly what user typed
    setQuestionsJson(newValue);

    try {
      // Try to parse the JSON
      const parsedQuestions = JSON.parse(newValue);
      
      // If valid JSON array, update form items silently
      if (Array.isArray(parsedQuestions)) {
        setFormItems(parsedQuestions);
        setJsonError('');
      } else {
        setJsonError('Questions data must be an array');
      }
    } catch (error) {
      // Only show error, don't update the form if JSON is invalid
      setJsonError('Invalid JSON format');
    }
    
    // Clear the editing flag after a short delay
    // This allows React to complete the current render cycle
    setTimeout(() => {
      isEditing.current = false;
    }, 0);
  };

  // Format JSON in the textarea (explicit user action)
  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(questionsJson);
      
      // Only format on explicit user action
      isEditing.current = true;
      setQuestionsJson(JSON.stringify(parsedJson, null, 2));
      setJsonError('');
      
      // Clear the editing flag after this operation
      setTimeout(() => {
        isEditing.current = false;
      }, 0);
    } catch (error) {
      setJsonError('Cannot format: Invalid JSON');
    }
  };

  // Handle saving questions
  const handleSaveQuestions = async () => {
    try {
      // First try to ensure we have valid JSON
      const parsedQuestions = JSON.parse(questionsJson);
      if (!Array.isArray(parsedQuestions)) {
        setJsonError('Questions data must be an array');
        return;
      }
      
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
  };

  // Handle loading questions
  const handleLoadQuestions = async () => {
    try {
      const savedQuestions = await loadQuestions();
      if (savedQuestions) {
        // Set editing flag to prevent effect from overriding
        isEditing.current = true;
        
        setFormItems(savedQuestions);
        setQuestionsJson(JSON.stringify(savedQuestions, null, 2));
        setTimedStatus(setQuestionsStatus, uiTranslations[language].loadedSuccessfully);
        
        // Clear the editing flag after operation
        setTimeout(() => {
          isEditing.current = false;
        }, 0);
      } else {
        setTimedStatus(setQuestionsStatus, uiTranslations[language].noSavedAnswers);
        
        isEditing.current = true;
        setFormItems(initialFormItems);
        setQuestionsJson(JSON.stringify(initialFormItems, null, 2));
        
        setTimeout(() => {
          isEditing.current = false;
        }, 0);
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

  // Reset questions and answers to initial default and clear localStorage
  const handleResetQuestions = async () => {
    try {
      // Clear all data from localStorage
      await clearAllStoredData();

      // Reset questions to initial state
      isEditing.current = true;
      setFormItems(initialFormItems);
      setQuestionsJson(JSON.stringify(initialFormItems, null, 2));
      
      setTimeout(() => {
        isEditing.current = false;
      }, 0);

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

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      // When turning debug mode on, update the JSON display
      isEditing.current = true;
      setQuestionsJson(JSON.stringify(formItems, null, 2));
      
      setTimeout(() => {
        isEditing.current = false;
      }, 0);
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