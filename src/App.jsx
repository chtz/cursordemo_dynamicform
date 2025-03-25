import { useState, useEffect } from 'react'
import './App.css'
import { saveAnswers, loadAnswers } from './services/answerService'

function App() {
  // Define questions and their possible answers
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([
    {"Your favourite color?": ["blue", "green", "red", "yellow"]},
    {"Your beloved pet?": ["cat", "dog", "fish", "bird"]},
    {"Your preferred season?": ["spring", "summer", "fall", "winter"]}
  ]);
  const [questionsJson, setQuestionsJson] = useState('');

  // State to store user's answers
  const [userAnswers, setUserAnswers] = useState({});
  const [saveStatus, setSaveStatus] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [jsonError, setJsonError] = useState('');

  // Load answers from storage when component mounts
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const savedAnswers = await loadAnswers();
        if (savedAnswers) {
          setUserAnswers(savedAnswers);
          setSaveStatus('Answers loaded successfully');
          setTimeout(() => setSaveStatus(''), 3000);
        }
      } catch (error) {
        console.error('Failed to load saved answers:', error);
      }
    };
    
    fetchAnswers();
  }, []);

  // Update questions JSON when debug mode is enabled
  useEffect(() => {
    if (debugMode) {
      setQuestionsJson(JSON.stringify(questionsAndAnswers, null, 2));
    }
  }, [debugMode, questionsAndAnswers]);

  // Handle radio button change
  const handleAnswerChange = (question, answer) => {
    setUserAnswers({
      ...userAnswers,
      [question]: answer
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

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  // Handle questions JSON edit
  const handleQuestionsJsonChange = (e) => {
    const newValue = e.target.value;
    setQuestionsJson(newValue);
    
    try {
      const parsedQuestions = JSON.parse(newValue);
      if (Array.isArray(parsedQuestions)) {
        setQuestionsAndAnswers(parsedQuestions);
        setJsonError('');
      } else {
        setJsonError('Questions data must be an array');
      }
    } catch (error) {
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
            <h2>Questions and Answers (Debug Mode)</h2>
            <div className="editor-controls">
              <button type="button" className="secondary-button" onClick={formatJson}>Format JSON</button>
            </div>
            <textarea 
              className={`json-editor ${jsonError ? 'json-error' : ''}`}
              value={questionsJson}
              onChange={handleQuestionsJsonChange}
              rows={10}
            />
            {jsonError && <div className="error-message">{jsonError}</div>}
          </div>
        )}

        <form>
          {questionsAndAnswers.map((questionObj, qIndex) => {
            const question = Object.keys(questionObj)[0];
            const answers = questionObj[question];
            
            return (
              <div key={qIndex} className="question-container">
                <p className="question-label">{question}</p>
                <div className="answer-options">
                  {answers.map((answer, aIndex) => (
                    <div key={aIndex} className="radio-option">
                      <input
                        type="radio"
                        id={`q${qIndex}-a${aIndex}`}
                        name={`question-${qIndex}`}
                        value={answer}
                        checked={userAnswers[question] === answer}
                        onChange={() => handleAnswerChange(question, answer)}
                      />
                      <label htmlFor={`q${qIndex}-a${aIndex}`}>{answer}</label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
