import { ROLES } from '../config/roles'
import { ROUTES } from '../routes/paths'

/**
 * Returns the default authorized landing route for a specific user role.
 * Used for post-login redirect and unauthorized navigation fallback.
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
