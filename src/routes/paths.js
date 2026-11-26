/**
 * Centralized Route Paths for PlacePrep Secure
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',

  // Student Routes
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    ASSESSMENTS: '/student/assessments',
    ASSESSMENT_PLAYER: '/student/assessment/:assessmentId',
    GAMES: '/student/cognitive-games',
    GAMES_COMPANY: '/student/cognitive-games/:companyId',
    STUDY_PLAN: '/student/study-plan',
    LEADERBOARD: '/student/leaderboard',
  },

  // Teacher Routes
  TEACHER: {
    ROOT: '/teacher',
    DASHBOARD: '/teacher/dashboard',
    AI_DRAFTS: '/teacher/ai-drafts',
    PROCTORING: '/teacher/live-proctoring',
    ANALYTICS: '/teacher/analytics-heatmap',
    TRACKS: '/teacher/tracks',
  },

  // Institution Admin Routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    STUDENT_ONBOARDING: '/admin/students-csv',
    TEACHER_MANAGEMENT: '/admin/faculty',
    DEPARTMENT_READINESS: '/admin/readiness',
    TRACK_ASSIGNMENT: '/admin/tracks',
  },

  // Platform Super Admin Routes
  SUPER_ADMIN: {
    ROOT: '/super-admin',
    DASHBOARD: '/super-admin/dashboard',
    TENANTS: '/super-admin/tenants',
    GLOBAL_CONFIG: '/super-admin/system-config',
  },
}
