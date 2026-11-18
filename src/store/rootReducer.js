import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

/**
 * Root Reducer combining all domain feature slices.
 * Future phases will plug examSlice, proctorSlice, analyticsSlice here.
 */
export const rootReducer = combineReducers({
  auth: authReducer,
})
