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
  getText
}) => {
  const formRef = useRef(null);

  return (
    <form onSubmit={handleSubmit} ref={formRef} noValidate>
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
        />
      ))}

      <div className="button-group">
        <button type="submit" className="primary-button">
          {uiTranslations[language].saveAnswers}
        </button>
        <button type="button" className="primary-button" onClick={handleLoadAnswers}>
          {uiTranslations[language].loadAnswers}
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
  getText: PropTypes.func.isRequired
};

export default DynamicForm; 