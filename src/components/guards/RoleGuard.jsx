import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROUTES } from '../../routes/paths'

/**
 * Role-Based Access Control (RBAC) Guard.
 * Restricts route access to specific roles (e.g. STUDENT cannot access TEACHER or ADMIN).
 * Redirects unauthorized attempts to /unauthorized with context.
 */
export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { role, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  const isAllowed = allowedRoles.length === 0 || (role && allowedRoles.includes(role))

  if (!isAllowed) {
    return (
      <Navigate
        to={ROUTES.UNAUTHORIZED}
        state={{
          from: location.pathname,
          requiredRoles: allowedRoles,
          currentRole: role,
        }}
        replace
      />
    )
  }

  return children ? children : <Outlet />
}

export default RoleGuard
