import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // commenting this out for now - StrictMode is for development but it is getting in the way of some of the Authentication flow for now
  // <StrictMode>
    <App />
  // </StrictMode>,
)
