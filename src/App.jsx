import { useState } from 'react'
import './App.css'

function App() {
  // Define questions and their possible answers
  const questionsAndAnswers = [
    {"Your favourite color?": ["blue", "green", "red", "yellow"]},
    {"Your beloved pet?": ["cat", "dog", "fish", "bird"]},
    {"Your preferred season?": ["spring", "summer", "fall", "winter"]}
  ];

  // State to store user's answers
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState(null);

  // Handle radio button change
  const handleAnswerChange = (question, answer) => {
    setUserAnswers({
      ...userAnswers,
      [question]: answer
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedAnswers(userAnswers);
  };

  return (
    <div className="container">
      <header>
        <h1>Welcome to Dynamic Form</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
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
                        required
                      />
                      <label htmlFor={`q${qIndex}-a${aIndex}`}>{answer}</label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <button type="submit" className="primary-button">Submit Answers</button>
        </form>

        {submittedAnswers && (
          <div className="results-container">
            <h2>Your Answers</h2>
            <pre>{JSON.stringify(submittedAnswers, null, 2)}</pre>
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
