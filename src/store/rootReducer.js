import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import examReducer from '../features/exam/examSlice'
import gamifiedReducer from '../features/gamified/gamifiedSlice'

const appReducer = combineReducers({
  auth: authReducer,
  exam: examReducer,
  gamified: gamifiedReducer,
})

/**
 * Root Reducer combining all domain feature slices:
 * - auth: Session, Entra ID, Student OTP, Tenant ID
 * - exam: Active assessment engine, Monaco editor state, multi-format questions, server timers
 * - gamified: Company-specific cognitive rounds, raw anti-tamper events, proctoring alerts
 *
 * Clears ephemeral exam & gamified slices cleanly whenever a user logs out.
 */
export const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    return appReducer(
      {
        auth: state?.auth,
        exam: undefined,
        gamified: undefined,
      },
      action,
    )
  }
  return appReducer(state, action)
}
