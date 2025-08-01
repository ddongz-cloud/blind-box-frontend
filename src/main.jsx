import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            border: '2px solid #1f2937',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
