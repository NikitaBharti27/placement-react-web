/**
 * System Roles for PlacePrep Secure
 * Strictly enforced across Redux state, Route Guards, and Backend JWT claims
 */
export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  INSTITUTION_ADMIN: 'INSTITUTION_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.TEACHER]: 'Faculty / Teacher',
  [ROLES.INSTITUTION_ADMIN]: 'Institution Admin',
  [ROLES.SUPER_ADMIN]: 'Platform Super Admin',
};

export const ROLE_BADGE_COLORS = {
  [ROLES.STUDENT]: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  [ROLES.TEACHER]: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  [ROLES.INSTITUTION_ADMIN]: 'bg-amber-100 text-amber-800 border-amber-300',
  [ROLES.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-300',
};
