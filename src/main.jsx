import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App.jsx';

// Get Clerk publishable key from environment variables
const clerkPubKey ="pk_test_cmVuZXdpbmctaG9nLTY3LmNsZXJrLmFjY291bnRzLmRldiQ"

// Check if the Clerk key exists
if (!clerkPubKey) {
  throw new Error("Missing Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </StrictMode>
);