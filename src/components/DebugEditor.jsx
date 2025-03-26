import PropTypes from 'prop-types';

/**
 * Debug editor component for modifying form JSON in Debug
 * @param {Object} props Component props
 * @param {string} props.questionsJson The form JSON as a string
 * @param {string} props.jsonError Any JSON parsing error messages
 * @param {string} props.questionsStatus Status message for question operations
 * @param {Function} props.handleQuestionsJsonChange Handler for JSON text changes
 * @param {Function} props.formatJson Handler for formatting JSON
 * @param {Function} props.handleSaveQuestions Handler for saving questions
 * @param {Function} props.handleLoadQuestions Handler for loading questions
 * @param {Function} props.handleResetQuestions Handler for resetting all data
 * @param {Object} props.uiTranslations Translations for UI elements
 * @param {string} props.language Current language code
 * @returns {JSX.Element} Debug editor UI
 */
const DebugEditor = ({
  questionsJson,
  jsonError,
  questionsStatus,
  handleQuestionsJsonChange,
  formatJson,
  handleSaveQuestions,
  handleLoadQuestions,
  handleResetQuestions,
  uiTranslations,
  language
}) => {
  return (
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
  );
};

DebugEditor.propTypes = {
  questionsJson: PropTypes.string.isRequired,
  jsonError: PropTypes.string.isRequired,
  questionsStatus: PropTypes.string.isRequired,
  handleQuestionsJsonChange: PropTypes.func.isRequired,
  formatJson: PropTypes.func.isRequired,
  handleSaveQuestions: PropTypes.func.isRequired,
  handleLoadQuestions: PropTypes.func.isRequired,
  handleResetQuestions: PropTypes.func.isRequired,
  uiTranslations: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired
};

export default DebugEditor; 