import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/silkscreen/400.css'
import './index.css'
import App from './App'

const Admin = lazy(() => import('./admin/Admin'))
const isAdmin = /\/admin\/?$/.test(window.location.pathname)
if (isAdmin) {
  document.title = 'Admin | Crown'
  const robots = document.querySelector('meta[name="robots"]')
  if (robots) robots.setAttribute('content', 'noindex, nofollow')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
