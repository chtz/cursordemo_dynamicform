import { useState, useEffect, useRef } from 'react'
import './App.css'
import { saveAnswers, loadAnswers, saveQuestions, loadQuestions, clearAllStoredData } from './services/answerService'

function App() {
  // Define initial form items with different types
  const initialFormItems = [
    {
      type: "title",
      content: "Personal Preferences"
    },
    {
      type: "text",
      content: "Please tell us about your preferences to help us personalize your experience."
    },
    {
      type: "choice",
      question: "Your favourite color?",
      options: ["blue", "green", "red", "yellow"]
    },
    {
      type: "choice",
      question: "Your beloved pet?",
      options: ["cat", "dog", "fish", "bird"]
    },
    {
      type: "title",
      content: "About You"
    },
    {
      type: "text",
      content: "We'd like to know more about your interests and experiences."
    },
    {
      type: "text",
      question: "Tell us about your hobbies",
      placeholder: "I enjoy..."
    },
    {
      type: "title",
      content: "Travel & Seasons"
    },
    {
      type: "choice",
      question: "Your preferred season?",
      options: ["spring", "summer", "fall", "winter"]
    },
    {
      type: "text",
      question: "What's your favorite travel destination?",
      placeholder: "Enter destination and why you love it..."
    }
  ];
  
  const [formItems, setFormItems] = useState(initialFormItems);
  const [questionsJson, setQuestionsJson] = useState('');

  // State to store user's answers
  const [userAnswers, setUserAnswers] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [questionsStatus, setQuestionsStatus] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  // Reference to the form element
  const formRef = useRef(null);

  // Load questions and answers from storage when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load questions
        const savedQuestions = await loadQuestions();
        if (savedQuestions) {
          console.log('Loaded questions from localStorage:', savedQuestions);
          setFormItems(savedQuestions);
          setQuestionsStatus('Questions loaded successfully from localStorage');
        } else {
          console.log('No saved questions found, using initial questions');
          // No saved questions, use initial questions
          setFormItems(initialFormItems);
        }

        // Load answers
        const savedAnswers = await loadAnswers();
        if (savedAnswers) {
          setUserAnswers(savedAnswers);
          setSaveStatus('Answers loaded successfully');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
        setQuestionsStatus('Error loading questions: ' + error.message);
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

  // Handle choice/radio button change
  const handleChoiceChange = (question, answer) => {
    setUserAnswers({
      ...userAnswers,
      [question]: answer
    });
    
    // Clear validation error for this question when answered
    if (validationErrors[question]) {
      const newErrors = { ...validationErrors };
      delete newErrors[question];
      setValidationErrors(newErrors);
    }
  };

  // Handle text input change
  const handleTextChange = (question, value) => {
    setUserAnswers({
      ...userAnswers,
      [question]: value
    });
    
    // Clear validation error for this question if it has content
    if (value.trim() && validationErrors[question]) {
      const newErrors = { ...validationErrors };
      delete newErrors[question];
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
      
      const answer = userAnswers[item.question];
      
      // Check if answer exists and is not empty
      if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
        errors[item.question] = 'This question requires an answer';
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
      setSaveStatus('Please answer all questions before saving');
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
      await saveAnswers(userAnswers);
      setSaveStatus('Answers saved successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving answers');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Handle loading answers
  const handleLoadAnswers = async () => {
    try {
      const savedAnswers = await loadAnswers();
      if (savedAnswers) {
        setUserAnswers(savedAnswers);
        setSaveStatus('Answers loaded successfully');
      } else {
        setSaveStatus('No saved answers found');
      }
      setTimeout(() => setSaveStatus(''), 3000);
      
      // Clear validation errors when loading new answers
      setValidationErrors({});
    } catch (error) {
      setSaveStatus('Error loading answers');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Handle saving questions
  const handleSaveQuestions = async () => {
    try {
      await saveQuestions(formItems);
      setQuestionsStatus('Questions saved successfully');
      setTimeout(() => setQuestionsStatus(''), 3000);
    } catch (error) {
      setQuestionsStatus('Error saving questions: ' + error.message);
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
        setQuestionsStatus('Questions loaded successfully');
      } else {
        setQuestionsStatus('No saved questions found, using initial questions');
        setFormItems(initialFormItems);
        setQuestionsJson(JSON.stringify(initialFormItems, null, 2));
      }
      setTimeout(() => setQuestionsStatus(''), 3000);
      
      // Reset validation errors when questions change
      setValidationErrors({});
    } catch (error) {
      setQuestionsStatus('Error loading questions: ' + error.message);
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
      setUserAnswers({});
      
      // Clear validation errors
      setValidationErrors({});
      
      // Update status messages
      setQuestionsStatus('All data reset to default and cleared from storage');
      setSaveStatus('Answers have been cleared');
      
      // Clear status messages after delay
      setTimeout(() => {
        setQuestionsStatus('');
        setSaveStatus('');
      }, 3000);
    } catch (error) {
      setQuestionsStatus('Error resetting data: ' + error.message);
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

  // Render a form item based on its type
  const renderFormItem = (item, index) => {
    const hasError = item.question && validationErrors[item.question];
    
    switch (item.type) {
      case 'title':
        return (
          <div key={index} className="form-title">
            <h2>{item.content}</h2>
          </div>
        );
        
      case 'text':
        // If it has a question property, it's an input field
        if (item.question) {
          return (
            <div 
              key={index} 
              className={`question-container ${hasError ? 'has-error' : ''}`}
              data-question={item.question}
            >
              <p className="question-label">
                {item.question}
                <span className="required-indicator">*</span>
              </p>
              <textarea
                className="text-input"
                placeholder={item.placeholder || "Enter your answer..."}
                value={userAnswers[item.question] || ''}
                onChange={(e) => handleTextChange(item.question, e.target.value)}
                rows={4}
                required
                minLength={1}
              />
              {hasError && <div className="validation-error">{validationErrors[item.question]}</div>}
            </div>
          );
        } else {
          // If it only has content, it's a display paragraph
          return (
            <div key={index} className="form-paragraph">
              <p>{item.content}</p>
            </div>
          );
        }
      
      case 'choice':
        return (
          <div 
            key={index} 
            className={`question-container ${hasError ? 'has-error' : ''}`}
            data-question={item.question}
          >
            <p className="question-label">
              {item.question}
              <span className="required-indicator">*</span>
            </p>
            <div className="answer-options">
              {item.options.map((option, optionIndex) => (
                <div key={optionIndex} className="radio-option">
                  <input
                    type="radio"
                    id={`q${index}-a${optionIndex}`}
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswers[item.question] === option}
                    onChange={() => handleChoiceChange(item.question, option)}
                    required
                  />
                  <label htmlFor={`q${index}-a${optionIndex}`}>{option}</label>
                </div>
              ))}
            </div>
            {hasError && <div className="validation-error">{validationErrors[item.question]}</div>}
          </div>
        );
      
      default:
        return <div key={index}>Unsupported item type: {item.type}</div>;
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Welcome to Dynamic Form</h1>
      </header>
      <main>
        <div className="debug-control">
          <label htmlFor="debug-toggle" className="debug-label">
            Debug Mode
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
            <h2>Form Items (Debug Mode)</h2>
            <div className="editor-controls">
              <button type="button" className="secondary-button" onClick={formatJson}>Format JSON</button>
              <button type="button" className="secondary-button" onClick={handleSaveQuestions}>Save Questions</button>
              <button type="button" className="secondary-button" onClick={handleLoadQuestions}>Load Questions</button>
              <button type="button" className="secondary-button danger-button" onClick={handleResetQuestions}>Reset All Data</button>
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
            <button type="submit" className="primary-button">Save Answers</button>
            <button type="button" className="primary-button" onClick={handleLoadAnswers}>Load Answers</button>
          </div>
          
          {saveStatus && <div className={`status-message ${saveStatus.includes('Please') ? 'error-status' : ''}`}>{saveStatus}</div>}
        </form>

        {debugMode && Object.keys(userAnswers).length > 0 && (
          <div className="results-container">
            <h2>Your Answers (Debug Mode)</h2>
            <pre>{JSON.stringify(userAnswers, null, 2)}</pre>
          </div>
        )}
      </main>
      <footer>
        <p>© 2024 Dynamic Form. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
