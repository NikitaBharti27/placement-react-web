const TOKEN_KEY = 'placeprep_auth_token'
const USER_KEY = 'placeprep_auth_user'
const TENANT_KEY = 'placeprep_tenant_id'

export const tokenStorage = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  setToken: (token, remember = true) => {
    try {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token)
      } else {
        sessionStorage.setItem(TOKEN_KEY, token)
      }
    } catch (e) {
      console.warn('Unable to persist token:', e)
    }
  },

  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  setUser: (user, remember = true) => {
    try {
      const serialized = JSON.stringify(user)
      if (remember) {
        localStorage.setItem(USER_KEY, serialized)
      } else {
        sessionStorage.setItem(USER_KEY, serialized)
      }
    } catch (e) {
      console.warn('Unable to persist user:', e)
    }
  },

  getTenantId: () => {
    try {
      return localStorage.getItem(TENANT_KEY) || sessionStorage.getItem(TENANT_KEY)
    } catch {
      return null
    }
  },

  setTenantId: (tenantId) => {
    try {
      localStorage.setItem(TENANT_KEY, tenantId)
    } catch (e) {
      console.warn('Unable to persist tenantId:', e)
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TENANT_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
      sessionStorage.removeItem(TENANT_KEY)
    } catch (e) {
      console.warn('Unable to clear token storage:', e)
    }
  },
}
