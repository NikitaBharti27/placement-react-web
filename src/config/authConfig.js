import { LogLevel } from '@azure/msal-browser'

/**
 * Microsoft Entra ID (Azure AD) MSAL Configuration
 * Configured for SPA OAuth2 + PKCE (zero stored passwords).
 */
const rawClientId = (import.meta.env.VITE_AZURE_CLIENT_ID || '').trim()
const PLACEHOLDER_CLIENT_IDS = new Set([
  '',
  '00000000-0000-0000-0000-000000000000',
  'your-azure-app-client-id-here',
])

export const isEntraConfigured = Boolean(
  rawClientId && !PLACEHOLDER_CLIENT_IDS.has(rawClientId.toLowerCase()),
)

const clientId = isEntraConfigured ? rawClientId : '00000000-0000-0000-0000-000000000000'
const tenantId = (import.meta.env.VITE_AZURE_TENANT_ID || 'common').trim()
const redirectUri = (import.meta.env.VITE_REDIRECT_URI || window.location.origin).trim()

export const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
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
        if (level === LogLevel.Error) {
          console.error('[MSAL Error]', message)
        } else if (level === LogLevel.Warning && isEntraConfigured) {
          console.warn('[MSAL Warning]', message)
        }
      },
      logLevel: isEntraConfigured ? LogLevel.Warning : LogLevel.Error,
    },
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
}

/**
 * Multi-Tenant Institution Directory (SaaS Tenants)
 * Shared across Login, Registration, and Admin governance views.
 */
export const INSTITUTION_TENANTS = [
  {
    id: 'tenant_mit_pune',
    name: 'MIT Academy of Engineering',
    domain: 'mitaoe.ac.in',
    city: 'Pune',
  },
  {
    id: 'tenant_coep_tech',
    name: 'COEP Technological University',
    domain: 'coep.ac.in',
    city: 'Pune',
  },
  {
    id: 'tenant_vit_vellore',
    name: 'Vellore Institute of Technology',
    domain: 'vit.ac.in',
    city: 'Vellore',
  },
]

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
]
