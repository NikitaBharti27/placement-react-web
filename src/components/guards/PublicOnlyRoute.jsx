import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { getDefaultRouteForRole } from '../../utils/roleUtils'

/**
 * Route guard for pages accessible only to unauthenticated guests (e.g. /login).
 * If a logged-in user visits, they are redirected to their assigned role dashboard.
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />
  }

  return children ? children : <Outlet />
}

export default PublicOnlyRoute
