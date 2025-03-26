import PropTypes from 'prop-types';

/**
 * Footer component with copyright and attribution
 * @param {Object} props Component props
 * @param {string} props.footerText Text to display in the footer
 * @returns {JSX.Element} Footer UI
 */
const Footer = ({ footerText }) => {
  return (
    <footer>
      <div className="footer-content">
        <p>{footerText}</p>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  footerText: PropTypes.string.isRequired
};

export default Footer; 