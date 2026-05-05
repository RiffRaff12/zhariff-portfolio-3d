import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

function showFatalError(msg) {
  document.body.style.cssText = 'margin:0;background:#0a0a0f;color:#f8f9fa;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;padding:32px;box-sizing:border-box'
  document.body.innerHTML = `<div style="max-width:700px"><div style="font-size:36px;margin-bottom:12px">💥</div><div style="color:#e63946;font-size:18px;margin-bottom:16px">Fatal error (pre-React)</div><pre style="white-space:pre-wrap;color:#4da6ff;font-size:13px">${msg}</pre></div>`
}

window.addEventListener('error', (e) => showFatalError(e.message + '\n' + (e.error?.stack ?? '')))
window.addEventListener('unhandledrejection', (e) => showFatalError(String(e.reason?.stack ?? e.reason)))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
