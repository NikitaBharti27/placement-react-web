import { LogLevel } from '@azure/msal-browser'

/**
 * Microsoft Entra ID (Azure AD) MSAL Configuration
 * Configured for SPA OAuth2 + PKCE
 */
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || '00000000-0000-0000-0000-000000000000'
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || 'common'
const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin

export const msalConfig = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: redirectUri,
    postLogoutRedirectUri: redirectUri,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return
        switch (level) {
          case LogLevel.Error:
            console.error('[MSAL Error]', message)
            break
          case LogLevel.Warning:
            console.warn('[MSAL Warning]', message)
            break
          default:
            break
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
}
