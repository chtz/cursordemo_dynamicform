import PropTypes from 'prop-types';

/**
 * Language selector component for switching between languages
 * @param {Object} props Component props
 * @param {string} props.currentLanguage The currently active language code
 * @param {Object} props.translations UI translations for the component
 * @param {Function} props.onChange Callback when language is changed
 * @param {boolean} props.disabled Whether the selector is disabled 
 * @returns {JSX.Element} Language selector UI
 */
const LanguageSelector = ({ currentLanguage, translations, onChange, disabled }) => {
  const handleLanguageChange = (langCode) => {
    if (disabled) return;
    onChange({ target: { value: langCode } });
  };
  
  return (
    <div className={`language-selector ${disabled ? 'disabled' : ''}`}>
      { /* <span>{translations.language}:</span> */ }
      <div className="language-links">
        <a 
          href="#" 
          className={`language-link ${currentLanguage === 'en' ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={(e) => { 
            e.preventDefault(); 
            handleLanguageChange('en'); 
          }}
          aria-disabled={disabled}
        >EN</a>
        { /* <span>|</span> */ }
        <a 
          href="#" 
          className={`language-link ${currentLanguage === 'de' ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={(e) => { 
            e.preventDefault(); 
            handleLanguageChange('de'); 
          }}
          aria-disabled={disabled}
        >
          DE
        </a>
      </div>
    </div>
  );
};

LanguageSelector.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default LanguageSelector; 