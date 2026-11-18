import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROUTES } from '../../routes/paths'
import LoadingSpinner from '../common/LoadingSpinner'

/**
 * Route guard that requires the user to be authenticated.
 * Preserves the attempted destination in location.state for post-login redirect.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner text="Verifying authentication session..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute
