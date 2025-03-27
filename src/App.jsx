import { useRef, memo } from 'react';
import './App.css';
import { useFormState } from './hooks/useFormState';
import { uiTranslations } from './translations';
import Header from './components/Header';
import Footer from './components/Footer';
import DynamicForm from './components/DynamicForm';
import DebugEditor from './components/DebugEditor';
import DebugResults from './components/DebugResults';

// Memoize components to prevent unnecessary re-renders
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer);
const MemoizedDynamicForm = memo(DynamicForm);
const MemoizedDebugEditor = memo(DebugEditor);
const MemoizedDebugResults = memo(DebugResults);

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
    isAuthenticated,
    isLoadingQuestions,
    isLoadingAnswers,
    isSavingQuestions,
    isSavingAnswers,
    isResettingData,
    isApiOperationInProgress,
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
      <MemoizedHeader
        title={uiTranslations[language].title}
        debugMode={debugMode}
        toggleDebugMode={toggleDebugMode}
        language={language}
        uiTranslations={uiTranslations}
        handleLanguageChange={handleLanguageChange}
        isAuthenticated={isAuthenticated}
        isApiOperationInProgress={isApiOperationInProgress}
      />
      
      <div className="container">
        <main>
          {debugMode && (
            <MemoizedDebugEditor
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
              isAuthenticated={isAuthenticated}
              isLoadingQuestions={isLoadingQuestions}
              isSavingQuestions={isSavingQuestions}
              isResettingData={isResettingData}
              isApiOperationInProgress={isApiOperationInProgress}
            />
          )}

          <MemoizedDynamicForm
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
            isAuthenticated={isAuthenticated}
            isLoadingQuestions={isLoadingQuestions}
            isLoadingAnswers={isLoadingAnswers}
            isSavingAnswers={isSavingAnswers}
            isApiOperationInProgress={isApiOperationInProgress}
          />

          {debugMode && (
            <MemoizedDebugResults
              userAnswers={userAnswers}
              uiTranslations={uiTranslations}
              language={language}
            />
          )}
        </main>
      </div>
      
      <MemoizedFooter
        footerText={uiTranslations[language].footer}
      />
    </div>
  );
}

export default App;
