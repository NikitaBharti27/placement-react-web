const TOKEN_KEY = 'placeprep_auth_token'
const USER_KEY = 'placeprep_auth_user'
const TENANT_KEY = 'placeprep_tenant_id'
const DEV_REGISTRY_KEY = 'placeprep_dev_registered_users'

const getTargetStorage = (remember = true) => (remember ? localStorage : sessionStorage)
const getOtherStorage = (remember = true) => (remember ? sessionStorage : localStorage)

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
      getTargetStorage(remember).setItem(TOKEN_KEY, token)
      getOtherStorage(remember).removeItem(TOKEN_KEY)
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
      getTargetStorage(remember).setItem(USER_KEY, serialized)
      getOtherStorage(remember).removeItem(USER_KEY)
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

  setTenantId: (tenantId, remember = true) => {
    try {
      getTargetStorage(remember).setItem(TENANT_KEY, tenantId)
      getOtherStorage(remember).removeItem(TENANT_KEY)
    } catch (e) {
      console.warn('Unable to persist tenantId:', e)
    }
  },

  clear: () => {
    try {
      ;[TOKEN_KEY, USER_KEY, TENANT_KEY].forEach((key) => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    } catch (e) {
      console.warn('Unable to clear token storage:', e)
    }
  },

  getDevRegisteredUsers: () => {
    try {
      const raw = localStorage.getItem(DEV_REGISTRY_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  },

  saveDevRegisteredUser: (user) => {
    try {
      const existing = tokenStorage.getDevRegisteredUsers()
      const filtered = existing.filter(
        (u) =>
          (user.studentId && u.studentId?.toUpperCase() !== user.studentId.toUpperCase()) ||
          (!user.studentId && u.email?.toLowerCase() !== user.email?.toLowerCase()),
      )
      localStorage.setItem(DEV_REGISTRY_KEY, JSON.stringify([...filtered, user]))
    } catch (e) {
      console.warn('Unable to save dev registered user:', e)
    }
  },
}
