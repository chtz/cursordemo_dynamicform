import { useState, useEffect, useRef } from 'react'
import './App.css'
import { saveAnswers, loadAnswers, saveQuestions, loadQuestions, clearAllStoredData } from './services/answerService'

function App() {
  // Define initial form items with different types, language support, and identifiers
  const initialFormItems = [
    {
      id: "section-preferences",
      type: "title",
      content: {
        en: "Personal Preferences",
        de: "Persönliche Präferenzen"
      }
    },
    {
      id: "text-preferences-intro",
      type: "text",
      content: {
        en: "Please tell us about your preferences to help us personalize your experience.",
        de: "Bitte teilen Sie uns Ihre Präferenzen mit, damit wir Ihr Erlebnis personalisieren können."
      }
    },
    {
      id: "q-color",
      type: "choice",
      question: {
        en: "Your favourite color?",
        de: "Deine Lieblingsfarbe?"
      },
      options: [
        { id: "color-blue", en: "blue", de: "blau" },
        { id: "color-green", en: "green", de: "grün" },
        { id: "color-red", en: "red", de: "rot" },
        { id: "color-yellow", en: "yellow", de: "gelb" }
      ]
    },
    {
      id: "section-travel",
      type: "title",
      content: {
        en: "Travel & Seasons",
        de: "Reisen & Jahreszeiten"
      }
    },
    {
      id: "q-travel",
      type: "text",
      question: {
        en: "What's your favorite travel destination?",
        de: "Was ist dein Lieblings-Reiseziel?"
      },
      placeholder: {
        en: "Enter destination and why you love it...",
        de: "Geben Sie das Reiseziel ein und warum Sie es lieben..."
      }
    }
  ];

  // App state
  const [formItems, setFormItems] = useState(initialFormItems);
  const [questionsJson, setQuestionsJson] = useState('');
  const [userAnswers, setUserAnswers] = useState({ language: 'en', answers: {} });
  const [saveStatus, setSaveStatus] = useState('');
  const [questionsStatus, setQuestionsStatus] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [language, setLanguage] = useState('en'); // Default language is English

  // Reference to the form element
  const formRef = useRef(null);

  // Translations for UI elements
  const uiTranslations = {
    en: {
      title: "Welcome to Dynamic Form",
      debugMode: "Debug Mode",
      formItems: "Form Items (Debug Mode)",
      formatJson: "Format JSON",
      saveQuestions: "Save Questions",
      loadQuestions: "Load Questions",
      resetAllData: "Reset All Data",
      saveAnswers: "Save Answers",
      loadAnswers: "Load Answers",
      yourAnswers: "Your Answers (Debug Mode)",
      required: "*",
      answerRequired: "This question requires an answer",
      pleaseAnswerAll: "Please answer all questions before saving",
      savedSuccessfully: "Answers saved successfully",
      loadedSuccessfully: "Answers loaded successfully",
      noSavedAnswers: "No saved answers found",
      errorSaving: "Error saving answers",
      errorLoading: "Error loading answers",
      questionsReset: "All data reset to default and cleared from storage",
      answersCleared: "Answers have been cleared",
      footer: "© 2024 Dynamic Form. All rights reserved.",
      language: "Language"
    },
    de: {
      title: "Willkommen beim dynamischen Formular",
      debugMode: "Debug-Modus",
      formItems: "Formularelemente (Debug-Modus)",
      formatJson: "JSON formatieren",
      saveQuestions: "Fragen speichern",
      loadQuestions: "Fragen laden",
      resetAllData: "Alle Daten zurücksetzen",
      saveAnswers: "Antworten speichern",
      loadAnswers: "Antworten laden",
      yourAnswers: "Deine Antworten (Debug-Modus)",
      required: "*",
      answerRequired: "Diese Frage erfordert eine Antwort",
      pleaseAnswerAll: "Bitte beantworte alle Fragen, bevor du speicherst",
      savedSuccessfully: "Antworten erfolgreich gespeichert",
      loadedSuccessfully: "Antworten erfolgreich geladen",
      noSavedAnswers: "Keine gespeicherten Antworten gefunden",
      errorSaving: "Fehler beim Speichern der Antworten",
      errorLoading: "Fehler beim Laden der Antworten",
      questionsReset: "Alle Daten auf Standardwerte zurückgesetzt und aus dem Speicher gelöscht",
      answersCleared: "Antworten wurden gelöscht",
      footer: "© 2024 Dynamisches Formular. Alle Rechte vorbehalten.",
      language: "Sprache"
    }
  };

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
          setSaveStatus(uiTranslations[language].loadedSuccessfully);
          setTimeout(() => setSaveStatus(''), 3000);
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
        setQuestionsStatus(`Error loading questions: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  // Update questions JSON when debug mode is toggled
  useEffect(() => {
    if (debugMode) {
      setQuestionsJson(JSON.stringify(formItems, null, 2));
    }
  }, [debugMode]);

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

  // Find a question item by its ID
  const findQuestionById = (questionId) => {
    return formItems.find(item => item.id === questionId);
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
  const validateForm = () => {
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
        errors[item.id] = uiTranslations[language].answerRequired;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      handleSaveAnswers();
    } else {
      setSaveStatus(uiTranslations[language].pleaseAnswerAll);
      setTimeout(() => setSaveStatus(''), 3000);

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
      setSaveStatus(uiTranslations[language].savedSuccessfully);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus(uiTranslations[language].errorSaving);
      setTimeout(() => setSaveStatus(''), 3000);
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
        setSaveStatus(uiTranslations[language].loadedSuccessfully);
      } else {
        setSaveStatus(uiTranslations[language].noSavedAnswers);
      }
      setTimeout(() => setSaveStatus(''), 3000);

      // Clear validation errors when loading new answers
      setValidationErrors({});
    } catch (error) {
      setSaveStatus(uiTranslations[language].errorLoading);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Handle saving questions
  const handleSaveQuestions = async () => {
    try {
      await saveQuestions(formItems);
      setQuestionsStatus(uiTranslations[language].savedSuccessfully);
      setTimeout(() => setQuestionsStatus(''), 3000);
    } catch (error) {
      setQuestionsStatus(`${uiTranslations[language].errorSaving}: ${error.message}`);
      setTimeout(() => setQuestionsStatus(''), 3000);
    }
  };

  // Handle loading questions
  const handleLoadQuestions = async () => {
    try {
      const savedQuestions = await loadQuestions();
      if (savedQuestions) {
        setFormItems(savedQuestions);
        setQuestionsJson(JSON.stringify(savedQuestions, null, 2));
        setQuestionsStatus(uiTranslations[language].loadedSuccessfully);
      } else {
        setQuestionsStatus(uiTranslations[language].noSavedAnswers);
        setFormItems(initialFormItems);
        setQuestionsJson(JSON.stringify(initialFormItems, null, 2));
      }
      setTimeout(() => setQuestionsStatus(''), 3000);

      // Reset validation errors when questions change
      setValidationErrors({});
    } catch (error) {
      setQuestionsStatus(`${uiTranslations[language].errorLoading}: ${error.message}`);
      setTimeout(() => setQuestionsStatus(''), 3000);
    }
  };

  // Reset questions and answers to initial default and clear localStorage
  const handleResetQuestions = async () => {
    try {
      // Clear all data from localStorage
      await clearAllStoredData();

      // Reset questions to initial state
      setFormItems(initialFormItems);
      setQuestionsJson(JSON.stringify(initialFormItems, null, 2));

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
      setQuestionsStatus(`Error resetting data: ${error.message}`);
      setTimeout(() => setQuestionsStatus(''), 3000);
    }
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      // When turning debug mode on, update the JSON display
      setQuestionsJson(JSON.stringify(formItems, null, 2));
    }
  };

  // Handle questions JSON edit
  const handleQuestionsJsonChange = (e) => {
    const newValue = e.target.value;
    setQuestionsJson(newValue);

    try {
      const parsedQuestions = JSON.parse(newValue);
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
  };

  // Format JSON in the textarea
  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(questionsJson);
      setQuestionsJson(JSON.stringify(parsedJson, null, 2));
      setJsonError('');
    } catch (error) {
      setJsonError('Cannot format: Invalid JSON');
    }
  };

  // Find option object by its ID
  const findOptionById = (item, optionId) => {
    if (!item.options) return null;
    return item.options.find(option => option.id === optionId);
  };

  // Render a form item based on its type
  const renderFormItem = (item, index) => {
    const hasError = validationErrors[item.id];

    switch (item.type) {
      case 'title':
        return (
          <div key={index} className="form-title">
            <h2>{getText(item.content)}</h2>
          </div>
        );

      case 'text':
        // If it has a question property, it's an input field
        if (item.question) {
          return (
            <div
              key={index}
              className={`question-container ${hasError ? 'has-error' : ''}`}
              data-question={item.id}
            >
              <p className="question-label">
                {getText(item.question)}
                <span className="required-indicator">{uiTranslations[language].required}</span>
              </p>
              <textarea
                className="text-input"
                placeholder={getText(item.placeholder)}
                value={userAnswers.answers[item.id] || ''}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                rows={4}
                required
                minLength={1}
              />
              {hasError && <div className="validation-error">{validationErrors[item.id]}</div>}
            </div>
          );
        } else {
          // If it only has content, it's a display paragraph
          return (
            <div key={index} className="form-paragraph">
              <p>{getText(item.content)}</p>
            </div>
          );
        }

      case 'choice':
        return (
          <div
            key={index}
            className={`question-container ${hasError ? 'has-error' : ''}`}
            data-question={item.id}
          >
            <p className="question-label">
              {getText(item.question)}
              <span className="required-indicator">{uiTranslations[language].required}</span>
            </p>
            <div className="answer-options">
              {item.options.map((option, optionIndex) => {
                const optionValue = getText(option);
                const optionId = option.id;

                return (
                  <div key={optionIndex} className="radio-option">
                    <input
                      type="radio"
                      id={`q${index}-a${optionIndex}`}
                      name={`question-${index}`}
                      value={optionId}
                      checked={userAnswers.answers[item.id] === optionId}
                      onChange={() => handleChoiceChange(item.id, optionId)}
                      required
                    />
                    <label htmlFor={`q${index}-a${optionIndex}`}>{optionValue}</label>
                  </div>
                );
              })}
            </div>
            {hasError && <div className="validation-error">{validationErrors[item.id]}</div>}
          </div>
        );

      default:
        return <div key={index}>Unsupported item type: {item.type}</div>;
    }
  };

  return (
    <div className="container">
      <header>
        <h1>{uiTranslations[language].title}</h1>
        <div className="language-selector">
          <label htmlFor="language-select">{uiTranslations[language].language}:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </header>
      <main>
        <div className="debug-control">
          <label htmlFor="debug-toggle" className="debug-label">
            {uiTranslations[language].debugMode}
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="debug-toggle"
                checked={debugMode}
                onChange={toggleDebugMode}
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>

        {debugMode && (
          <div className="debug-editor">
            <h2>{uiTranslations[language].formItems}</h2>
            <div className="editor-controls">
              <button type="button" className="secondary-button" onClick={formatJson}>
                {uiTranslations[language].formatJson}
              </button>
              <button type="button" className="secondary-button" onClick={handleSaveQuestions}>
                {uiTranslations[language].saveQuestions}
              </button>
              <button type="button" className="secondary-button" onClick={handleLoadQuestions}>
                {uiTranslations[language].loadQuestions}
              </button>
              <button type="button" className="secondary-button danger-button" onClick={handleResetQuestions}>
                {uiTranslations[language].resetAllData}
              </button>
            </div>
            <textarea
              className={`json-editor ${jsonError ? 'json-error' : ''}`}
              value={questionsJson}
              onChange={handleQuestionsJsonChange}
              rows={10}
            />
            {jsonError && <div className="error-message">{jsonError}</div>}
            {questionsStatus && <div className="status-message">{questionsStatus}</div>}
          </div>
        )}

        <form onSubmit={handleSubmit} ref={formRef} noValidate>
          {formItems.map((item, index) => renderFormItem(item, index))}

          <div className="button-group">
            <button type="submit" className="primary-button">
              {uiTranslations[language].saveAnswers}
            </button>
            <button type="button" className="primary-button" onClick={handleLoadAnswers}>
              {uiTranslations[language].loadAnswers}
            </button>
          </div>

          {saveStatus && <div className={`status-message ${saveStatus.includes('Please') ? 'error-status' : ''}`}>{saveStatus}</div>}
        </form>

        {debugMode && Object.keys(userAnswers.answers).length > 0 && (
          <div className="results-container">
            <h2>{uiTranslations[language].yourAnswers}</h2>
            <pre>{JSON.stringify(userAnswers, null, 2)}</pre>
          </div>
        )}
      </main>
      <footer>
        <p>{uiTranslations[language].footer}</p>
      </footer>
    </div>
  )
}

export default App
