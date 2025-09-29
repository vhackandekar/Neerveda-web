import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Import the i18next configuration

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);