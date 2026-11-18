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

/**
 * Thunk: Student ID + OTP Step 1 (Request OTP)
 */
export const requestStudentOtp = (studentId) => async (dispatch) => {
  if (!studentId || !studentId.trim()) {
    dispatch(authFailure('Please enter a valid Student ID'))
    return { success: false }
  }

  try {
    dispatch(authStart())
    const response = await authApi.requestStudentOtp(studentId.trim())
    dispatch(
      otpRequestedSuccess({
        studentId: studentId.trim(),
        message: response.message,
        mockOtp: response.mockOtp,
      }),
    )
    return { success: true, mockOtp: response.mockOtp }
  } catch (err) {
    dispatch(authFailure(err.message || 'Failed to request OTP'))
    return { success: false, error: err.message }
  }
}

/**
 * Thunk: Student ID + OTP Step 2 (Verify OTP & Sign In)
 */
export const verifyStudentOtp = (studentId, otp) => async (dispatch) => {
  if (!otp || otp.length < 4) {
    dispatch(authFailure('Please enter the verification OTP'))
    return { success: false }
  }

  try {
    dispatch(authStart())
    const response = await authApi.verifyStudentOtp(studentId, otp)
    dispatch(
      authSuccess({
        user: response.user,
        token: response.token,
        authMethod: 'student_otp',
      }),
    )
    return { success: true, user: response.user }
  } catch (err) {
    dispatch(authFailure(err.message || 'Failed to verify OTP'))
    return { success: false, error: err.message }
  }
}

/**
 * Thunk: Microsoft Entra ID Authentication
 */
export const loginWithEntra = (account, idToken) => async (dispatch) => {
  try {
    dispatch(authStart())
    const response = await authApi.verifyEntraToken(account, idToken)
    dispatch(
      authSuccess({
        user: response.user,
        token: response.token,
        authMethod: 'entra',
      }),
    )
    return { success: true, user: response.user }
  } catch (err) {
    dispatch(authFailure(err.message || 'Failed to authenticate with Microsoft Entra ID'))
    return { success: false, error: err.message }
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
 * Thunk: Logout User & Purge Session
 */
export const logoutUser = () => async (dispatch) => {
  try {
    // Attempt MSAL logout if active account exists
    const activeAccount = msalInstance.getActiveAccount()
    if (activeAccount) {
      await msalInstance.logoutPopup().catch(() => {})
    }
  } finally {
    dispatch(logout())
  }
}
