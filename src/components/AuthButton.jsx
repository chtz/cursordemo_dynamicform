import PropTypes from 'prop-types';
import { useAuth } from 'react-oidc-context';

/**
 * Login/Logout button component that uses react-oidc-context for authentication
 * @param {Object} props Component props
 * @param {Object} props.translations Translations for UI elements
 * @returns {JSX.Element} Login/Logout button
 */
const AuthButton = ({ translations }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <button className="auth-button loading" disabled aria-busy="true">
        <span className="auth-icon">⌛</span>
      </button>
    );
  }

  if (auth.error) {
    return (
      <button
        className="auth-button error"
        onClick={() => auth.signoutRedirect()}
        title={auth.error.message}
      >
        <span className="auth-icon">❌</span>
      </button>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <button
        className="auth-button logged-in"
        onClick={() => auth.removeUser()}
        title={translations.logout}
      >
        <span className="auth-icon">✓</span>
      </button>
    );
  }

  return (
    <button
      className="auth-button"
      onClick={() => auth.signinRedirect()}
      title={translations.login}
    >
      <span className="auth-icon">🔑</span>
    </button>
  );
};

AuthButton.propTypes = {
  translations: PropTypes.object.isRequired
};

export default AuthButton; 