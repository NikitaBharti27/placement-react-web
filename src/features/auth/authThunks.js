import {
  authStart,
  authSuccess,
  authFailure,
  otpRequestedSuccess,
  logout,
  switchRoleDev,
} from './authSlice'
import { authApi } from '../../api/authApi'
import { msalInstance } from './msalInstance'
import { isEntraConfigured } from '../../config/authConfig'

/**
 * Thunk: Student ID + OTP Step 1 (Request OTP)
 */
export const requestStudentOtp = (studentId) => async (dispatch) => {
  if (!studentId || !studentId.trim()) {
    const msg = 'Please enter a valid Student Registration ID.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }

  try {
    dispatch(authStart())
    const response = await authApi.requestStudentOtp(studentId.trim())
    dispatch(
      otpRequestedSuccess({
        studentId: response.studentId || studentId.trim().toUpperCase(),
        message: response.message,
        maskedContact: response.maskedContact,
        expiresInSeconds: response.expiresInSeconds,
        mockOtp: response.mockOtp,
      }),
    )
    return { success: true, mockOtp: response.mockOtp }
  } catch (err) {
    const msg = err.message || 'Failed to request passkey.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }
}

/**
 * Thunk: Student ID + OTP Step 2 (Verify OTP & Sign In)
 */
export const verifyStudentOtp = (studentId, otp, remember = true) => async (dispatch) => {
  const cleanedOtp = (otp || '').replace(/\s+/g, '').trim()
  if (cleanedOtp.length !== 6) {
    const msg = 'Please enter the complete 6-digit verification passkey.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }

  try {
    dispatch(authStart())
    const response = await authApi.verifyStudentOtp(studentId, cleanedOtp)
    dispatch(
      authSuccess({
        user: response.user,
        token: response.token,
        authMethod: 'student_otp',
        remember,
      }),
    )
    return { success: true, user: response.user }
  } catch (err) {
    const msg = err.message || 'Failed to verify passkey.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }
}

/**
 * Thunk: Register Student Account & Dispatch OTP
 */
export const registerStudentAccount = (payload) => async (dispatch) => {
  try {
    dispatch(authStart())
    const response = await authApi.registerStudent(payload)
    dispatch(
      otpRequestedSuccess({
        studentId: response.studentId,
        message: response.message,
        maskedContact: response.maskedContact,
        expiresInSeconds: response.expiresInSeconds,
        mockOtp: response.mockOtp,
      }),
    )
    return { success: true, studentId: response.studentId, mockOtp: response.mockOtp }
  } catch (err) {
    const msg = err.message || 'Student registration failed.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }
}

/**
 * Thunk: Register Institutional Faculty / Admin Account
 */
export const registerInstitutionalAccount = (payload) => async (dispatch) => {
  try {
    dispatch(authStart())
    const response = await authApi.registerInstitutional(payload)
    dispatch(
      authSuccess({
        user: response.user,
        token: response.token,
        authMethod: isEntraConfigured ? 'entra' : 'entra_dev_sim',
        remember: true,
      }),
    )
    return { success: true, user: response.user }
  } catch (err) {
    const msg = err.message || 'Institutional onboarding failed.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }
}

/**
 * Thunk: Microsoft Entra ID Authentication (Real PKCE or Dev Simulator)
 */
export const loginWithEntra = (account, idToken, preferredRole = null) => async (dispatch) => {
  try {
    dispatch(authStart())
    const response = await authApi.verifyEntraToken(account, idToken, preferredRole)
    dispatch(
      authSuccess({
        user: response.user,
        token: response.token,
        authMethod: isEntraConfigured ? 'entra' : 'entra_dev_sim',
        remember: true,
      }),
    )
    return { success: true, user: response.user }
  } catch (err) {
    const msg = err.message || 'Failed to authenticate with Microsoft Entra ID.'
    dispatch(authFailure(msg))
    return { success: false, error: msg }
  }
}

/**
 * Thunk: Quick Role Switcher for local development/testing
 */
export const loginWithMockRole = (role) => (dispatch) => {
  const { user, token } = authApi.getMockUserForRole(role)
  dispatch(switchRoleDev({ user, token }))
  return { success: true, user }
}

/**
 * Thunk: Logout User & Purge Session cleanly
 */
export const logoutUser = () => async (dispatch) => {
  try {
    if (isEntraConfigured) {
      const activeAccount = msalInstance.getActiveAccount()
      if (activeAccount) {
        await msalInstance.logoutPopup().catch(() => {})
      }
    }
  } finally {
    dispatch(logout())
  }
}
