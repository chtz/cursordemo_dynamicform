import PropTypes from 'prop-types';
import MarkdownText from './MarkdownText';

/**
 * Renders a form item based on its type
 * @param {Object} props Component props
 * @param {Object} props.item The form item to render
 * @param {number} props.index The index of the item in the form
 * @param {string} props.language The current language code
 * @param {Object} props.userAnswers The user's answers data
 * @param {Object} props.validationErrors Any validation errors
 * @param {Function} props.handleTextChange Handler for text input changes
 * @param {Function} props.handleChoiceChange Handler for choice selection changes
 * @param {Function} props.getText Helper to get text in current language
 * @param {Object} props.uiTranslations Translations for UI elements
 * @returns {JSX.Element} The rendered form item
 */
const FormItem = ({ 
  item, 
  index, 
  language, 
  userAnswers, 
  validationErrors, 
  handleTextChange, 
  handleChoiceChange,
  getText,
  uiTranslations
}) => {
  const hasError = validationErrors[item.id];
  
  switch (item.type) {
    case 'title':
      return (
        <div key={index} className="form-title">
          <h2>
            <MarkdownText text={getText(item.content)} />
          </h2>
        </div>
      );
      
    case 'text':
      // If it has a question property, it's an input field
      if (item.question) {
        return (
          <div 
            className={`question-container ${hasError ? 'has-error' : ''}`}
            data-question={item.id}
          >
            <p className="question-label">
              <MarkdownText text={getText(item.question)} noParagraph={true} />
              <span className="required-indicator">{uiTranslations[language].required}</span>
            </p>
            <textarea
              className="text-input"
              placeholder={getText(item.placeholder)}
              value={userAnswers.answers[item.id] || ''}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              rows={4}
              required
              minLength={1}
            />
            {hasError && <div className="validation-error">{validationErrors[item.id]}</div>}
          </div>
        );
      } else {
        // If it only has content, it's a display paragraph
        return (
          <div className="form-paragraph">
            <MarkdownText 
              text={getText(item.content)} 
              className="form-paragraph-content"
            />
          </div>
        );
      }
    
    case 'choice':
      return (
        <div 
          className={`question-container ${hasError ? 'has-error' : ''}`}
          data-question={item.id}
        >
          <p className="question-label">
            <MarkdownText text={getText(item.question)} noParagraph={true} />
            <span className="required-indicator">{uiTranslations[language].required}</span>
          </p>
          <div className="answer-options">
            {item.options.map((option, optionIndex) => {
              const optionValue = getText(option);
              const optionId = option.id;
              
              return (
                <div key={optionIndex} className="radio-option">
                  <input
                    type="radio"
                    id={`q${index}-a${optionIndex}`}
                    name={`question-${index}`}
                    value={optionId}
                    checked={userAnswers.answers[item.id] === optionId}
                    onChange={() => handleChoiceChange(item.id, optionId)}
                    required
                  />
                  <label htmlFor={`q${index}-a${optionIndex}`}>
                    <MarkdownText text={optionValue} noParagraph={true} />
                  </label>
                </div>
              );
            })}
          </div>
          {hasError && <div className="validation-error">{validationErrors[item.id]}</div>}
        </div>
      );
    
    default:
      return <div>Unsupported item type: {item.type}</div>;
  }
};

FormItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  userAnswers: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  handleChoiceChange: PropTypes.func.isRequired,
  getText: PropTypes.func.isRequired,
  uiTranslations: PropTypes.object.isRequired
};

export default FormItem; 