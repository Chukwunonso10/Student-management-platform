import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeToggle from './components/themeToggle'

createRoot(document.getElementById('root')).render(

   <StrictMode>
    <ThemeToggle />
    <App />
  </StrictMode>,
 
)
