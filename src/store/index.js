import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific MSAL account objects if cached in state
        ignoredActionPaths: ['payload.account'],
        ignoredPaths: ['auth.msalAccount'],
      },
    }),
  devTools: import.meta.env.DEV,
})

