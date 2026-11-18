import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from '../../config/authConfig'

export const msalInstance = new PublicClientApplication(msalConfig)

// Ensure MSAL is initialized asynchronously before handling redirect or login
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize()
  } catch (error) {
    console.warn('[MSAL] Failed to initialize PublicClientApplication:', error)
  }
}
