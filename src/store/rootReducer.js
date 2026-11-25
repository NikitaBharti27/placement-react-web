import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import examReducer from '../features/exam/examSlice'

/**
 * Root Reducer combining all domain feature slices:
 * - auth: Session, Entra ID, Student OTP, Tenant ID
 * - exam: Active assessment engine, Monaco editor state, multi-format questions, server timers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  exam: examReducer,
})
