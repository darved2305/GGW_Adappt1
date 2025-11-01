import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Ensure the medium background variant is applied by default in the browser build
try {
  if (typeof document !== 'undefined') document.body.classList.add('bg-variant-medium')
} catch (e) {
  // noop
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

