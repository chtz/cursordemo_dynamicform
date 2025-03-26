import { useRef } from 'react';
import './App.css';
import { useFormState } from './hooks/useFormState';
import { uiTranslations } from './translations';
import Header from './components/Header';
import Footer from './components/Footer';
import DynamicForm from './components/DynamicForm';
import DebugEditor from './components/DebugEditor';
import DebugResults from './components/DebugResults';

/**
 * Main application component
 * @returns {JSX.Element} The entire application UI
 */
function App() {
  const formRef = useRef(null);
  const {
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
  } = useFormState();

  return (
    <div id="app-wrapper">
      <Header
        title={uiTranslations[language].title}
        debugMode={debugMode}
        toggleDebugMode={toggleDebugMode}
        language={language}
        uiTranslations={uiTranslations}
        handleLanguageChange={handleLanguageChange}
      />
      
      <div className="container">
        <main>
          {debugMode && (
            <DebugEditor
              questionsJson={questionsJson}
              jsonError={jsonError}
              questionsStatus={questionsStatus}
              handleQuestionsJsonChange={handleQuestionsJsonChange}
              formatJson={formatJson}
              handleSaveQuestions={handleSaveQuestions}
              handleLoadQuestions={handleLoadQuestions}
              handleResetQuestions={handleResetQuestions}
              uiTranslations={uiTranslations}
              language={language}
            />
          )}

          <DynamicForm
            formItems={formItems}
            userAnswers={userAnswers}
            validationErrors={validationErrors}
            saveStatus={saveStatus}
            language={language}
            uiTranslations={uiTranslations}
            handleSubmit={handleSubmit}
            handleLoadAnswers={handleLoadAnswers}
            handleTextChange={handleTextChange}
            handleChoiceChange={handleChoiceChange}
            getText={getText}
          />

          {debugMode && (
            <DebugResults
              userAnswers={userAnswers}
              uiTranslations={uiTranslations}
              language={language}
            />
          )}
        </main>
      </div>
      
      <Footer
        footerText={uiTranslations[language].footer}
      />
    </div>
  );
}

export default App;
