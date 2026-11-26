import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { resolvePostAuthDestination } from '../../utils/roleUtils'

/**
 * Route guard for pages accessible only to unauthenticated guests (e.g. /login, /register).
 * Respects deep-link destination if the signed-in role is authorized for it.
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (isAuthenticated && role) {
    const destination = resolvePostAuthDestination(role, location.state?.from)
    return <Navigate to={destination} replace />
  }

  return children ? children : <Outlet />
}

export default PublicOnlyRoute
