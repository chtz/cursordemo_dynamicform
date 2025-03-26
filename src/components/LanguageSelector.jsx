import PropTypes from 'prop-types';

/**
 * Language selector component for switching between languages
 * @param {Object} props Component props
 * @param {string} props.currentLanguage The currently active language code
 * @param {Object} props.translations UI translations for the component
 * @param {Function} props.onChange Callback when language is changed
 * @returns {JSX.Element} Language selector UI
 */
const LanguageSelector = ({ currentLanguage, translations, onChange }) => {
  const handleLanguageChange = (langCode) => {
    onChange({ target: { value: langCode } });
  };
  
  return (
    <div className="language-selector">
      <span>{translations.language}:</span>
      <div className="language-links">
        <a 
          href="#" 
          className={`language-link ${currentLanguage === 'en' ? 'active' : ''}`}
          onClick={(e) => { 
            e.preventDefault(); 
            handleLanguageChange('en'); 
          }}
        >
          EN
        </a>
        <span>|</span>
        <a 
          href="#" 
          className={`language-link ${currentLanguage === 'de' ? 'active' : ''}`}
          onClick={(e) => { 
            e.preventDefault(); 
            handleLanguageChange('de'); 
          }}
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
  onChange: PropTypes.func.isRequired
};

export default LanguageSelector; 