import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, isEntraConfigured } from '../../config/authConfig'

export const msalInstance = new PublicClientApplication(msalConfig)

/**
 * Ensure MSAL is initialized asynchronously before handling redirect or login.
 * Only processes Entra redirect tokens when real Azure credentials are provisioned.
 */
export const initializeMsal = async () => {
  try {
    await msalInstance.initialize()
    if (isEntraConfigured) {
      const redirectResponse = await msalInstance.handleRedirectPromise()
      if (redirectResponse?.account) {
        msalInstance.setActiveAccount(redirectResponse.account)
      }
    }
  } catch (error) {
    console.warn('[MSAL] Failed to initialize PublicClientApplication:', error)
  }
}
