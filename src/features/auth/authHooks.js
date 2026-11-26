import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectCurrentRole,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectOtpState,
  selectTenantId,
  authStart,
  authFailure,
  clearAuthError,
  resetOtpState,
} from './authSlice'
import {
  requestStudentOtp,
  verifyStudentOtp,
  registerStudentAccount,
  registerInstitutionalAccount,
  loginWithEntra,
  loginWithMockRole,
  logoutUser,
} from './authThunks'
import { ROLES } from '../../config/roles'
import { isEntraConfigured, loginRequest } from '../../config/authConfig'
import { msalInstance } from './msalInstance'
import { MOCK_USERS } from '../../api/authApi'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const role = useSelector(selectCurrentRole)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const otpState = useSelector(selectOtpState)
  const tenantId = useSelector(selectTenantId)

  const isStudent = role === ROLES.STUDENT
  const isTeacher = role === ROLES.TEACHER
  const isInstitutionAdmin = role === ROLES.INSTITUTION_ADMIN
  const isSuperAdmin = role === ROLES.SUPER_ADMIN

  const hasRole = (allowedRoles = []) => {
    if (!role) return false
    return allowedRoles.includes(role)
  }

  const handleRequestOtp = async (studentId) => {
    return await dispatch(requestStudentOtp(studentId))
  }

  const handleVerifyOtp = async (studentId, otp, remember = true) => {
    return await dispatch(verifyStudentOtp(studentId, otp, remember))
  }

  const handleRegisterStudent = async (payload) => {
    return await dispatch(registerStudentAccount(payload))
  }

  const handleRegisterInstitutional = async (payload) => {
    return await dispatch(registerInstitutionalAccount(payload))
  }

  /**
   * Microsoft Entra ID Sign-In (OAuth2 + PKCE).
   * - When VITE_AZURE_CLIENT_ID is configured: opens live MSAL popup and surfaces real errors/cancellations.
   * - When unconfigured (local dev): runs simulated PKCE exchange without triggering broken Azure popups.
   */
  const handleEntraLogin = async ({ role: targetRole = ROLES.TEACHER, emailHint = '' } = {}) => {
    if (!isEntraConfigured) {
      const seed = MOCK_USERS[targetRole] || MOCK_USERS[ROLES.TEACHER]
      const simAccount = {
        username: emailHint?.trim() || seed.email,
        name: seed.name,
      }
      return await dispatch(loginWithEntra(simAccount, `sim_pkce_id_token_${Date.now()}`, targetRole))
    }

    try {
      dispatch(authStart())
      const response = await msalInstance.loginPopup({
        ...loginRequest,
        ...(emailHint ? { loginHint: emailHint } : {}),
      })
      if (response?.account) {
        msalInstance.setActiveAccount(response.account)
      }
      return await dispatch(loginWithEntra(response.account, response.idToken, targetRole))
    } catch (err) {
      const code = err?.errorCode || ''
      const friendlyMessage =
        code === 'user_cancelled'
          ? 'Microsoft Entra ID sign-in was cancelled before completion.'
          : code === 'popup_window_error'
          ? 'Browser blocked the Microsoft sign-in popup. Please allow popups and try again.'
          : err?.message || 'Microsoft Entra ID authentication failed.'
      dispatch(authFailure(friendlyMessage))
      return { success: false, error: friendlyMessage }
    }
  }

  const handleMockLogin = (targetRole) => {
    return dispatch(loginWithMockRole(targetRole))
  }

  const handleLogout = async () => {
    return await dispatch(logoutUser())
  }

  const handleClearError = () => {
    dispatch(clearAuthError())
  }

  const handleResetOtp = () => {
    dispatch(resetOtpState())
  }

  return {
    user,
    role,
    tenantId,
    isAuthenticated,
    isLoading,
    error,
    otpState,
    isStudent,
    isTeacher,
    isInstitutionAdmin,
    isSuperAdmin,
    isEntraConfigured,
    hasRole,
    requestOtp: handleRequestOtp,
    verifyOtp: handleVerifyOtp,
    registerStudent: handleRegisterStudent,
    registerInstitutional: handleRegisterInstitutional,
    loginWithEntra: handleEntraLogin,
    loginWithMockRole: handleMockLogin,
    logout: handleLogout,
    clearError: handleClearError,
    resetOtp: handleResetOtp,
  }
}
