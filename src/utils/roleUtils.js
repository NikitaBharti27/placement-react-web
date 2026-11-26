import { ROLES } from '../config/roles'
import { ROUTES } from '../routes/paths'

const ROLE_ROUTE_PREFIX = {
  [ROLES.STUDENT]: '/student',
  [ROLES.TEACHER]: '/teacher',
  [ROLES.INSTITUTION_ADMIN]: '/admin',
  [ROLES.SUPER_ADMIN]: '/super-admin',
}

/**
 * Returns the default authorized landing route for a specific user role.
 */
export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case ROLES.STUDENT:
      return ROUTES.STUDENT.DASHBOARD
    case ROLES.TEACHER:
      return ROUTES.TEACHER.DASHBOARD
    case ROLES.INSTITUTION_ADMIN:
      return ROUTES.ADMIN.DASHBOARD
    case ROLES.SUPER_ADMIN:
      return ROUTES.SUPER_ADMIN.DASHBOARD
    default:
      return ROUTES.LOGIN
  }
}

/**
 * Checks if a given role is authorized based on allowed roles list.
 */
export const isRoleAuthorized = (userRole, allowedRoles = []) => {
  if (!userRole) return false
  if (!allowedRoles || allowedRoles.length === 0) return true
  return allowedRoles.includes(userRole)
}

/**
 * Resolves the safe post-login redirect target.
 * Respects deep links (e.g. /student/assessment/tcs-nqt-tech-01) when the
 * signed-in role owns that route prefix; otherwise falls back to the role dashboard.
 */
export const resolvePostAuthDestination = (role, fromLocation) => {
  const fallback = getDefaultRouteForRole(role)
  const pathname = fromLocation?.pathname
  if (!pathname || pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER || pathname === ROUTES.UNAUTHORIZED) {
    return fallback
  }

  const allowedPrefix = ROLE_ROUTE_PREFIX[role]
  if (allowedPrefix && pathname.startsWith(allowedPrefix)) {
    return `${pathname}${fromLocation.search || ''}`
  }

  return fallback
}
