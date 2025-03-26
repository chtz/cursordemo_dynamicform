import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
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
 * - Debug with JSON editing
 * - Internationalization
 * - Persistence through localStorage
 * - Authentication integration
 * 
 * @returns {Object} Form state and handlers
 */
export const useFormState = () => {
  // Authentication state
  const auth = useAuth();
  
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
  
  // Track if we've already fetched data to avoid duplicate fetches
  const dataFetched = useRef(false);

  /**
   * Helper function to get text in current language with fallback to English
   * @param {Object} textObj - Object containing translations keyed by language code
   * @returns {string} Text in the current language or fallback
   */
  const getText = useCallback((textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.en || '';
  }, [language]);

  // Get access token when authenticated
  const getAccessToken = useCallback(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      return auth.user.access_token;
    }
    return null;
  }, [auth.isAuthenticated, auth.user]);

  // Check if auth is ready (not loading)
  const isAuthReady = useCallback(() => {
    return !auth.isLoading;
  }, [auth.isLoading]);

  // Load questions and answers from storage when authentication is ready
  useEffect(() => {
    // Only proceed if auth state is fully initialized (not loading)
    if (!isAuthReady() || dataFetched.current) {
      return;
    }

    const fetchData = async () => {
      try {
        // Only fetch data if authenticated and we have a token
        if (auth.isAuthenticated) {
          const accessToken = getAccessToken();
          if (!accessToken) {
            return;
          }

          console.log('Fetching data with access token');
          dataFetched.current = true;
          
          // Load questions
          const savedQuestions = await loadQuestions(accessToken);
          if (savedQuestions) {
            setFormItems(savedQuestions);
          }

          // Load answers
          const savedAnswers = await loadAnswers(accessToken);
          if (savedAnswers) {
            // Check if answers are in the new format (with language)
            if (savedAnswers.language && savedAnswers.answers) {
              setUserAnswers(savedAnswers);
              // Set the language based on saved preference
              setLanguage(savedAnswers.language);
            } else {
              // Handle legacy format
              setUserAnswers(prev => ({ ...prev, answers: savedAnswers }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };

    fetchData();
  }, [auth.isAuthenticated, getAccessToken, isAuthReady]);
  
  // Reset the dataFetched flag when auth state changes 
  // This allows refetching data when user logs in
  useEffect(() => {
    if (!auth.isAuthenticated) {
      dataFetched.current = false;
    }
  }, [auth.isAuthenticated]);

  // Set initial questions JSON when entering Debug
  useEffect(() => {
    if (debugMode && !questionsJson) {
      setQuestionsJson(JSON.stringify(formItems, null, 2));
    }
  }, [debugMode, questionsJson, formItems]);

  // Update questions JSON when form items change but only if not editing
  useEffect(() => {
    if (debugMode && !isEditing.current && questionsJson) {
      setQuestionsJson(JSON.stringify(formItems, null, 2));
    }
  }, [debugMode, formItems]);

  /**
   * Handle language change
   * @param {Object} e - Event object containing the selected language
   */
  const handleLanguageChange = useCallback((e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);

    // Update the language in the userAnswers object
    setUserAnswers(prev => ({
      ...prev,
      language: newLanguage
    }));
  }, []);

  /**
   * Handle choice/radio button change
   * @param {string} questionId - ID of the question being answered
   * @param {string} optionId - ID of the selected option
   */
  const handleChoiceChange = useCallback((questionId, optionId) => {
    setUserAnswers(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionId
      }
    }));

    // Clear validation error for this question when answered
    setValidationErrors(prev => {
      if (!prev[questionId]) return prev;
      
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  }, []);

  /**
   * Handle text input change
   * @param {string} questionId - ID of the question being answered
   * @param {string} value - Text value entered by the user
   */
  const handleTextChange = useCallback((questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));

    // Clear validation error for this question if it has content
    if (value.trim()) {
      setValidationErrors(prev => {
        if (!prev[questionId]) return prev;
        
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }, []);

  /**
   * Validate the form to ensure all questions have answers
   * @returns {boolean} True if the form is valid, false otherwise
   */
  const validateFormData = useCallback(() => {
    const { isValid, errors } = validateForm(formItems, userAnswers, uiTranslations, language);
    setValidationErrors(errors);
    return isValid;
  }, [formItems, userAnswers, language]);

  /**
   * Handle saving answers to storage
   */
  const handleSaveAnswers = useCallback(async () => {
    try {
      // Check if auth is loading or not authenticated
      if (auth.isLoading) {
        setTimedStatus(setSaveStatus, uiTranslations[language].authLoading);
        return;
      }
      
      // Check if user is authenticated
      if (!auth.isAuthenticated) {
        setTimedStatus(setSaveStatus, uiTranslations[language].authRequired);
        return;
      }
      
      const accessToken = getAccessToken();
      if (!accessToken) {
        setTimedStatus(setSaveStatus, uiTranslations[language].tokenMissing);
        return;
      }
      
      // Save both the answers and the current language
      await saveAnswers(userAnswers, accessToken);
      setTimedStatus(setSaveStatus, uiTranslations[language].savedSuccessfully);
    } catch (error) {
      setTimedStatus(setSaveStatus, uiTranslations[language].errorSaving);
    }
  }, [userAnswers, language, auth.isAuthenticated, auth.isLoading, getAccessToken]);

  /**
   * Handle form submission
   * @param {Object} e - Form submission event
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Check if auth is loading
    if (auth.isLoading) {
      setTimedStatus(setSaveStatus, uiTranslations[language].authLoading);
      return;
    }

    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      setTimedStatus(setSaveStatus, uiTranslations[language].authRequired);
      return;
    }

    // Check for access token
    const accessToken = getAccessToken();
    if (!accessToken) {
      setTimedStatus(setSaveStatus, uiTranslations[language].tokenMissing);
      return;
    }

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
  }, [validateFormData, validationErrors, language, auth.isAuthenticated, auth.isLoading, getAccessToken, handleSaveAnswers]);

  /**
   * Handle loading answers from storage
   */
  const handleLoadAnswers = useCallback(async () => {
    try {
      // Check if auth is loading or not authenticated
      if (auth.isLoading) {
        setTimedStatus(setSaveStatus, uiTranslations[language].authLoading);
        return;
      }
      
      if (!auth.isAuthenticated) {
        setTimedStatus(setSaveStatus, uiTranslations[language].authRequired);
        return;
      }
      
      const accessToken = getAccessToken();
      if (!accessToken) {
        setTimedStatus(setSaveStatus, uiTranslations[language].tokenMissing);
        return;
      }
      
      const savedAnswers = await loadAnswers(accessToken);
      if (savedAnswers) {
        // Check if answers are in the new format
        if (savedAnswers.language && savedAnswers.answers) {
          setUserAnswers(savedAnswers);
          // Set the language based on saved preference
          setLanguage(savedAnswers.language);
        } else {
          // Handle legacy format
          setUserAnswers(prev => ({ ...prev, answers: savedAnswers }));
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
  }, [language, getAccessToken, auth.isAuthenticated, auth.isLoading]);

  /**
   * Handle changes to the JSON editor
   * Updates form items when JSON is valid, but preserves user formatting
   * @param {Object} e - Change event from the textarea
   */
  const handleQuestionsJsonChange = useCallback((e) => {
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
  }, []);

  /**
   * Format JSON in the textarea (explicit user action)
   * Only formats when the user clicks the button
   */
  const formatJson = useCallback(() => {
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
  }, [questionsJson]);

  /**
   * Handle saving questions to storage
   * Parses and validates JSON before saving
   */
  const handleSaveQuestions = useCallback(async () => {
    // Check if auth is loading or not authenticated
    if (auth.isLoading) {
      setTimedStatus(setQuestionsStatus, uiTranslations[language].authLoading);
      return;
    }
    
    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      setTimedStatus(setQuestionsStatus, uiTranslations[language].authRequired);
      return;
    }
    
    safeParseJSON(
      questionsJson,
      // On success
      async (parsedQuestions) => {
        try {
          const accessToken = getAccessToken();
          if (!accessToken) {
            setTimedStatus(setQuestionsStatus, uiTranslations[language].tokenMissing);
            return;
          }
          
          // Update form items and save them
          setFormItems(parsedQuestions);
          await saveQuestions(parsedQuestions, accessToken);
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
  }, [questionsJson, language, auth.isAuthenticated, auth.isLoading, getAccessToken]);

  /**
   * Handle loading questions from localStorage
   */
  const handleLoadQuestions = useCallback(async () => {
    try {
      // Check if auth is loading or not authenticated
      if (auth.isLoading) {
        setTimedStatus(setQuestionsStatus, uiTranslations[language].authLoading);
        return;
      }
      
      if (!auth.isAuthenticated) {
        setTimedStatus(setQuestionsStatus, uiTranslations[language].authRequired);
        return;
      }
      
      const accessToken = getAccessToken();
      if (!accessToken) {
        setTimedStatus(setQuestionsStatus, uiTranslations[language].tokenMissing);
        return;
      }
      
      const savedQuestions = await loadQuestions(accessToken);
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
  }, [language, getAccessToken, auth.isAuthenticated, auth.isLoading]);

  /**
   * Reset questions and answers to initial default and clear storage
   */
  const handleResetQuestions = useCallback(async () => {
    // Check if auth is loading or not authenticated
    if (auth.isLoading) {
      setTimedStatus(setQuestionsStatus, uiTranslations[language].authLoading);
      return;
    }
    
    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      setTimedStatus(setQuestionsStatus, uiTranslations[language].authRequired);
      return;
    }
    
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setTimedStatus(setQuestionsStatus, uiTranslations[language].tokenMissing);
        return;
      }
      
      // Clear all data from storage
      await clearAllStoredData(accessToken);

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
  }, [language, auth.isAuthenticated, auth.isLoading, getAccessToken]);

  /**
   * Toggle Debug on/off
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prevMode => {
      // When turning Debug on, update the JSON display
      if (!prevMode) {
        withEditingState(isEditing, () => {
          setQuestionsJson(JSON.stringify(formItems, null, 2));
        });
      }
      return !prevMode;
    });
  }, [formItems]);

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
    isAuthenticated: auth.isAuthenticated,
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