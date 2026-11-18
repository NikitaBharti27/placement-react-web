import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { store } from './store'
import { msalInstance, initializeMsal } from './features/auth/msalInstance'
import AppRoutes from './routes/AppRoutes'
import LoadingSpinner from './components/common/LoadingSpinner'

export function App() {
  const [msalReady, setMsalReady] = useState(false)

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      try {
        await initializeMsal()
      } catch (err) {
        console.warn('MSAL initialization warning:', err)
      } finally {
        if (isMounted) {
          setMsalReady(true)
        }
      }
    }
    init()

    return () => {
      isMounted = false
    }
  }, [])

  if (!msalReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <LoadingSpinner text="Initializing PlacePrep Secure Authentication Engine..." />
      </div>
    )
  }

  return (
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MsalProvider>
    </Provider>
  )
}

export default App
