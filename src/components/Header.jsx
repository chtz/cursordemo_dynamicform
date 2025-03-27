import PropTypes from 'prop-types';
import LanguageSelector from './LanguageSelector';
import AuthButton from './AuthButton';

/**
 * Header component with title, debug toggle, and language selector
 * @param {Object} props Component props
 * @param {string} props.title Title text for the header
 * @param {boolean} props.debugMode Current Debug state
 * @param {Function} props.toggleDebugMode Handler for toggling Debug
 * @param {string} props.language Current language code
 * @param {Object} props.uiTranslations Translations for UI elements
 * @param {Function} props.handleLanguageChange Handler for language changes
 * @param {boolean} props.isAuthenticated Whether the user is authenticated
 * @param {boolean} props.isApiOperationInProgress Whether any API operation is in progress
 * @returns {JSX.Element} Header UI
 */
const Header = ({ 
  title, 
  debugMode, 
  toggleDebugMode, 
  language, 
  uiTranslations, 
  handleLanguageChange, 
  isAuthenticated,
  isApiOperationInProgress
}) => {
  return (
    <header>
      <div className="header-content">
        <h1>{title}</h1>
        <div className="header-controls">
          <div className="debug-control">
            <label htmlFor="debug-toggle" className="debug-label">
              {uiTranslations[language].debugMode}
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="debug-toggle"
                  checked={debugMode}
                  onChange={toggleDebugMode}
                  disabled={isApiOperationInProgress}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>
          <LanguageSelector 
            currentLanguage={language} 
            translations={uiTranslations[language]} 
            onChange={handleLanguageChange}
            disabled={isApiOperationInProgress}
          />
          <AuthButton 
            translations={uiTranslations[language]} 
            isApiOperationInProgress={isApiOperationInProgress}
          />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  debugMode: PropTypes.bool.isRequired,
  toggleDebugMode: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  uiTranslations: PropTypes.object.isRequired,
  handleLanguageChange: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isApiOperationInProgress: PropTypes.bool
};

export default Header; 