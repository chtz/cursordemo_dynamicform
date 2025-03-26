import PropTypes from 'prop-types';

/**
 * Debug results component to display user answers in debug mode
 * @param {Object} props Component props
 * @param {Object} props.userAnswers User answers data
 * @param {Object} props.uiTranslations Translations for UI elements
 * @param {string} props.language Current language code
 * @returns {JSX.Element} Debug results UI
 */
const DebugResults = ({ userAnswers, uiTranslations, language }) => {
  if (Object.keys(userAnswers.answers).length === 0) {
    return null;
  }
  
  return (
    <div className="results-container">
      <h2>{uiTranslations[language].yourAnswers}</h2>
      <pre>{JSON.stringify(userAnswers, null, 2)}</pre>
    </div>
  );
};

DebugResults.propTypes = {
  userAnswers: PropTypes.object.isRequired,
  uiTranslations: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired
};

export default DebugResults; 