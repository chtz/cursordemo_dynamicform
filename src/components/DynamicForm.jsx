import PropTypes from 'prop-types';
import { useRef } from 'react';
import FormItem from './FormItem';

/**
 * Dynamic form component that renders form items and handles submission
 * @param {Object} props Component props
 * @param {Array} props.formItems List of form items to render
 * @param {Object} props.userAnswers User answers data
 * @param {Object} props.validationErrors Any validation error messages
 * @param {string} props.saveStatus Status message for save operations
 * @param {string} props.language Current language code
 * @param {Object} props.uiTranslations Translations for UI elements
 * @param {Function} props.handleSubmit Form submission handler
 * @param {Function} props.handleLoadAnswers Handler for loading answers
 * @param {Function} props.handleTextChange Handler for text input changes
 * @param {Function} props.handleChoiceChange Handler for choice selection changes
 * @param {Function} props.getText Helper to get text in current language
 * @param {boolean} props.isLoadingQuestions Whether questions are being loaded
 * @param {boolean} props.isLoadingAnswers Whether answers are being loaded
 * @param {boolean} props.isSavingAnswers Whether answers are being saved
 * @param {boolean} props.isApiOperationInProgress Whether any API operation is in progress
 * @returns {JSX.Element} Dynamic form UI
 */
const DynamicForm = ({
  formItems,
  userAnswers,
  validationErrors,
  saveStatus,
  language,
  uiTranslations,
  handleSubmit,
  handleLoadAnswers,
  handleTextChange,
  handleChoiceChange,
  getText,
  isLoadingQuestions,
  isLoadingAnswers,
  isSavingAnswers,
  isApiOperationInProgress
}) => {
  const formRef = useRef(null);

  // Determine loading state classes
  const formClass = isApiOperationInProgress ? "loading-state form-component" : "";

  return (
    <form onSubmit={handleSubmit} ref={formRef} noValidate className={formClass}>
      {formItems.map((item, index) => (
        <FormItem
          key={item.id || index}
          item={item}
          index={index}
          language={language}
          userAnswers={userAnswers}
          validationErrors={validationErrors}
          handleTextChange={handleTextChange}
          handleChoiceChange={handleChoiceChange}
          getText={getText}
          uiTranslations={uiTranslations}
          isApiOperationInProgress={isApiOperationInProgress}
        />
      ))}

      <div className="button-group">
        <button 
          type="submit" 
          className="primary-button"
          disabled={isApiOperationInProgress}
        >
          {isSavingAnswers ? '...' : uiTranslations[language].saveAnswers}
        </button>
        <button 
          type="button" 
          className="primary-button" 
          onClick={handleLoadAnswers}
          disabled={isApiOperationInProgress}
        >
          {isLoadingAnswers ? '...' : uiTranslations[language].loadAnswers}
        </button>
      </div>

      {saveStatus && (
        <div className={`status-message ${saveStatus.includes('Please') ? 'error-status' : ''}`}>
          {saveStatus}
        </div>
      )}
    </form>
  );
};

DynamicForm.propTypes = {
  formItems: PropTypes.array.isRequired,
  userAnswers: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  saveStatus: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  uiTranslations: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleLoadAnswers: PropTypes.func.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  handleChoiceChange: PropTypes.func.isRequired,
  getText: PropTypes.func.isRequired,
  isLoadingQuestions: PropTypes.bool,
  isLoadingAnswers: PropTypes.bool,
  isSavingAnswers: PropTypes.bool,
  isApiOperationInProgress: PropTypes.bool
};

export default DynamicForm; 