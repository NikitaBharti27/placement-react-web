import { createSlice } from '@reduxjs/toolkit'
import { tokenStorage } from '../../utils/tokenStorage'

// Initialize state from persistent storage
const storedToken = tokenStorage.getToken()
const storedUser = tokenStorage.getUser()

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken && storedUser),
  isLoading: false,
  error: null,
  otpState: {
    sent: false,
    studentId: null,
    message: null,
    mockHint: null,
  },
  authMethod: storedToken ? 'persisted' : null,
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
      const { user, token, authMethod = 'standard' } = action.payload
      state.isLoading = false
      state.error = null
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.authMethod = authMethod
      state.otpState = {
        sent: false,
        studentId: null,
        message: null,
        mockHint: null,
      }

      // Persist to storage
      tokenStorage.setToken(token)
      tokenStorage.setUser(user)
      if (user?.tenantId) {
        tokenStorage.setTenantId(user.tenantId)
      }
    },
    authFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload || 'Authentication failed'
    },
    otpRequestedSuccess: (state, action) => {
      const { studentId, message, mockOtp } = action.payload
      state.isLoading = false
      state.error = null
      state.otpState = {
        sent: true,
        studentId,
        message,
        mockHint: mockOtp || null,
      }
    },
    resetOtpState: (state) => {
      state.otpState = {
        sent: false,
        studentId: null,
        message: null,
        mockHint: null,
      }
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
      state.otpState = {
        sent: false,
        studentId: null,
        message: null,
        mockHint: null,
      }
      tokenStorage.clear()
    },
    // Developer helper action for quick role testing during Phase 1 verification
    switchRoleDev: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      state.authMethod = 'dev_mock'

      tokenStorage.setToken(token)
      tokenStorage.setUser(user)
      if (user?.tenantId) {
        tokenStorage.setTenantId(user.tenantId)
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
