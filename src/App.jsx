import { useState, useEffect } from 'react'
import './App.css'
import { saveAnswers, loadAnswers, saveQuestions, loadQuestions, clearAllStoredData } from './services/answerService'

function App() {
  // Define initial form items with different types
  const initialFormItems = [
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
      type: "text",
      question: "Tell us about your hobbies",
      placeholder: "I enjoy..."
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
  };

  // Handle text input change
  const handleTextChange = (question, value) => {
    setUserAnswers({
      ...userAnswers,
      [question]: value
    });
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
    switch (item.type) {
      case 'choice':
        return (
          <div key={index} className="question-container">
            <p className="question-label">{item.question}</p>
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
                  />
                  <label htmlFor={`q${index}-a${optionIndex}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div key={index} className="question-container">
            <p className="question-label">{item.question}</p>
            <textarea
              className="text-input"
              placeholder={item.placeholder || "Enter your answer..."}
              value={userAnswers[item.question] || ''}
              onChange={(e) => handleTextChange(item.question, e.target.value)}
              rows={4}
            />
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

        <form>
          {formItems.map((item, index) => renderFormItem(item, index))}
          
          <div className="button-group">
            <button type="button" className="primary-button" onClick={handleSaveAnswers}>Save Answers</button>
            <button type="button" className="primary-button" onClick={handleLoadAnswers}>Load Answers</button>
          </div>
          
          {saveStatus && <div className="status-message">{saveStatus}</div>}
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
