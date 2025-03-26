import ReactMarkdown from 'react-markdown';

/**
 * Renders markdown text with proper formatting and safe external links
 * @param {Object} props Component props
 * @param {string} props.text The markdown text to render
 * @param {string} [props.className] Optional CSS class to apply to the wrapper div
 * @param {boolean} [props.noParagraph] If true, renders inline without paragraph wrapping
 * @returns {JSX.Element} Rendered markdown content
 */
const MarkdownText = ({ text, className, noParagraph }) => {
  // Define components object based on noParagraph prop
  const components = {
    // Set up custom components for links to open in new tab
    a: ({node, ...props}) => (
      <a {...props} target="_blank" rel="noopener noreferrer" />
    )
  };
  
  // Only add paragraph component replacement if noParagraph is true
  if (noParagraph) {
    components.p = ({node, children, ...props}) => <span {...props}>{children}</span>;
  }
  
  // When noParagraph is true, don't wrap in a div to avoid nesting div inside p
  if (noParagraph) {
    return (
      <ReactMarkdown components={components}>
        {text || ''}
      </ReactMarkdown>
    );
  }
  
  // Otherwise, use a div wrapper with the className
  return (
    <div className={className}>
      <ReactMarkdown components={components}>
        {text || ''}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownText; 