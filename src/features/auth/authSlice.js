import { createSlice } from '@reduxjs/toolkit'
import { tokenStorage } from '../../utils/tokenStorage'

// Validate persisted session integrity on startup
const rawToken = tokenStorage.getToken()
const rawUser = tokenStorage.getUser()
const hasValidSession = Boolean(rawToken && rawUser && typeof rawUser === 'object' && rawUser.role)

if ((rawToken || rawUser) && !hasValidSession) {
  tokenStorage.clear()
}

const emptyOtpState = {
  sent: false,
  studentId: null,
  message: null,
  maskedContact: null,
  expiresAt: null,
  resendAvailableAt: null,
  mockHint: null,
}

const initialState = {
  user: hasValidSession ? rawUser : null,
  token: hasValidSession ? rawToken : null,
  isAuthenticated: hasValidSession,
  isLoading: false,
  error: null,
  otpState: { ...emptyOtpState },
  authMethod: hasValidSession ? 'persisted' : null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    authSuccess: (state, action) => {
      const { user, token, authMethod = 'standard', remember = true } = action.payload
      state.isLoading = false
      state.error = null
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.authMethod = authMethod
      state.otpState = { ...emptyOtpState }

      tokenStorage.setToken(token, remember)
      tokenStorage.setUser(user, remember)
      if (user?.tenantId) {
        tokenStorage.setTenantId(user.tenantId, remember)
      }
    },
    authFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload || 'Authentication failed'
    },
    otpRequestedSuccess: (state, action) => {
      const {
        studentId,
        message,
        mockOtp,
        maskedContact,
        expiresInSeconds = 300,
      } = action.payload
      const now = Date.now()
      state.isLoading = false
      state.error = null
      state.otpState = {
        sent: true,
        studentId,
        message,
        maskedContact: maskedContact || null,
        expiresAt: now + expiresInSeconds * 1000,
        resendAvailableAt: now + 30 * 1000,
        mockHint: mockOtp || null,
      }
    },
    resetOtpState: (state) => {
      state.otpState = { ...emptyOtpState }
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      state.authMethod = null
      state.otpState = { ...emptyOtpState }
      tokenStorage.clear()
    },
    switchRoleDev: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      state.authMethod = 'dev_mock'
      state.otpState = { ...emptyOtpState }

      tokenStorage.setToken(token, true)
      tokenStorage.setUser(user, true)
      if (user?.tenantId) {
        tokenStorage.setTenantId(user.tenantId, true)
      }
    },
  },
})

export const {
  authStart,
  authSuccess,
  authFailure,
  otpRequestedSuccess,
  resetOtpState,
  clearAuthError,
  logout,
  switchRoleDev,
} = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentRole = (state) => state.auth.user?.role || null
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectOtpState = (state) => state.auth.otpState
export const selectTenantId = (state) => state.auth.user?.tenantId || null

export default authSlice.reducer
