import PropTypes from 'prop-types';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';

/**
 * Login/Logout button component that uses react-oidc-context for authentication
 * @param {Object} props Component props
 * @param {Object} props.translations Translations for UI elements
 * @param {boolean} props.isApiOperationInProgress Whether any API operation is in progress
 * @returns {JSX.Element} Login/Logout button
 */
const AuthButton = ({ translations, isApiOperationInProgress }) => {
  const auth = useAuth();

  // Automatically handle auth errors by logging out
  useEffect(() => {
    if (auth.error) {
      console.warn('Authentication error detected, logging out:', auth.error.message);
      auth.removeUser();
    }
  }, [auth.error, auth]);

  if (auth.isLoading) {
    return (
      <button className="auth-button loading" disabled aria-busy="true">
        <span className="auth-icon">⌛</span>
      </button>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <button
        className={`auth-button logged-in ${isApiOperationInProgress ? 'disabled' : ''}`}
        onClick={() => !isApiOperationInProgress && auth.removeUser()}
        title={translations.logout}
        disabled={isApiOperationInProgress}
      >
        <span className="auth-icon">✓</span>
      </button>
    );
  }

  return (
    <button
      className={`auth-button ${isApiOperationInProgress ? 'disabled' : ''}`}
      onClick={() => !isApiOperationInProgress && auth.signinRedirect()}
      title={translations.login}
      disabled={isApiOperationInProgress}
    >
      <span className="auth-icon">🔑</span>
    </button>
  );
};

AuthButton.propTypes = {
  translations: PropTypes.object.isRequired,
  isApiOperationInProgress: PropTypes.bool
};

export default AuthButton; 