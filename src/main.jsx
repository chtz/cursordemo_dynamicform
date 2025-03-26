import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import './index.css'
import App from './App.jsx'

// Determine if the app is running locally or deployed
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Configure OIDC based on environment
const oidcConfig = {
  authority: "https://myidpdev.unliked.in",
  // Set different client ID depending on environment
  client_id: isLocalhost ? "dynamicform.local" : "dynamicform.ghpages", 
  redirect_uri: window.location.origin + "/cursordemo_dynamicform/",
  automaticSilentRenew: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
