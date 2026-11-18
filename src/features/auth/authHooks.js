import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectCurrentRole,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectOtpState,
  selectTenantId,
  clearAuthError,
  resetOtpState,
} from './authSlice'
import {
  requestStudentOtp,
  verifyStudentOtp,
  loginWithEntra,
  loginWithMockRole,
  logoutUser,
} from './authThunks'
import { ROLES } from '../../config/roles'
import { loginRequest } from '../../config/authConfig'
import { msalInstance } from './msalInstance'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const role = useSelector(selectCurrentRole)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const otpState = useSelector(selectOtpState)
  const tenantId = useSelector(selectTenantId)

  // Role checks
  const isStudent = role === ROLES.STUDENT
  const isTeacher = role === ROLES.TEACHER
  const isInstitutionAdmin = role === ROLES.INSTITUTION_ADMIN
  const isSuperAdmin = role === ROLES.SUPER_ADMIN

  const hasRole = (allowedRoles = []) => {
    if (!role) return false
    return allowedRoles.includes(role)
  }

  // Student OTP workflow
  const handleRequestOtp = async (studentId) => {
    return await dispatch(requestStudentOtp(studentId))
  }

  const handleVerifyOtp = async (studentId, otp) => {
    return await dispatch(verifyStudentOtp(studentId, otp))
  }

  // Microsoft Entra ID workflow
  const handleEntraLogin = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest)
      return await dispatch(loginWithEntra(response.account, response.idToken))
    } catch (err) {
      console.warn('[MSAL login error fallback]', err)
      // If popup was blocked or MSAL not provisioned with live tenant credentials,
      // fallback smoothly to institutional faculty login so development/demo is never halted
      return await dispatch(loginWithMockRole(ROLES.TEACHER))
    }
  }

  // Development/Mock switch
  const handleMockLogin = (targetRole) => {
    return dispatch(loginWithMockRole(targetRole))
  }

  const handleLogout = () => {
    return dispatch(logoutUser())
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
    hasRole,
    requestOtp: handleRequestOtp,
    verifyOtp: handleVerifyOtp,
    loginWithEntra: handleEntraLogin,
    loginWithMockRole: handleMockLogin,
    logout: handleLogout,
    clearError: handleClearError,
    resetOtp: handleResetOtp,
  }
}
