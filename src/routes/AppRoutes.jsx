import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './paths'
import { ROLES } from '../config/roles'

// Layouts
import AppLayout from '../components/layout/AppLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Route Guards
import ProtectedRoute from '../components/guards/ProtectedRoute'
import RoleGuard from '../components/guards/RoleGuard'
import PublicOnlyRoute from '../components/guards/PublicOnlyRoute'

// Pages
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import UnauthorizedPage from '../pages/auth/UnauthorizedPage'
import NotFoundPage from '../pages/NotFoundPage'

// Dashboards
import StudentDashboard from '../pages/dashboards/StudentDashboard'
import TeacherDashboard from '../pages/dashboards/TeacherDashboard'
import AdminDashboard from '../pages/dashboards/AdminDashboard'
import SuperAdminDashboard from '../pages/dashboards/SuperAdminDashboard'

// Phase 2 Assessment Engine Pages
import AssessmentsListPage from '../pages/assessment/AssessmentsListPage'
import AssessmentPlayerPage from '../pages/assessment/AssessmentPlayerPage'

// Phase 3 Gamified Cognitive Rounds Page
import GamifiedRoundsPage from '../pages/gamified/GamifiedRoundsPage'

// Phase Handover Placeholder for upcoming sub-routes
const UpcomingPhasePlaceholder = ({ phase, title, roleName }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold">
      {phase} Handover
    </span>
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    <p className="text-xs text-slate-500 max-w-md mx-auto">
      Role Guard validated for <strong>{roleName}</strong>. The specialized workspace components will be
      connected in {phase} as planned in the development roadmap.
    </p>
  </div>
)

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home & Landing */}
      <Route path={ROUTES.HOME} element={<HomePage />} />

      {/* Auth Routes with AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      </Route>

      {/* Protected Authenticated Zone */}
      <Route element={<ProtectedRoute />}>
        {/* Full-Screen Distraction-Free Assessment Engine (Student Only) */}
        <Route element={<RoleGuard allowedRoles={[ROLES.STUDENT]} />}>
          <Route
            path={ROUTES.STUDENT.ASSESSMENT_PLAYER}
            element={<AssessmentPlayerPage />}
          />
        </Route>

        {/* Standard Application Shell with Navbar & Sidebar */}
        <Route element={<AppLayout />}>
          {/* STUDENT ZONE (Role: STUDENT) */}
          <Route element={<RoleGuard allowedRoles={[ROLES.STUDENT]} />}>
            <Route path={ROUTES.STUDENT.ROOT} element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
            <Route path={ROUTES.STUDENT.DASHBOARD} element={<StudentDashboard />} />
            <Route path={ROUTES.STUDENT.ASSESSMENTS} element={<AssessmentsListPage />} />
            <Route path={ROUTES.STUDENT.GAMES} element={<GamifiedRoundsPage />} />
            <Route path={ROUTES.STUDENT.GAMES_COMPANY} element={<GamifiedRoundsPage />} />
            <Route
              path={ROUTES.STUDENT.STUDY_PLAN}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 4"
                  title="LLaMA 3 AI Remediation & Personalized Study Plans"
                  roleName="Student"
                />
              }
            />
            <Route
              path={ROUTES.STUDENT.LEADERBOARD}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 3"
                  title="Gamified Cohort Leaderboard (Redis-Cached)"
                  roleName="Student"
                />
              }
            />
          </Route>

          {/* TEACHER / FACULTY ZONE (Role: TEACHER) */}
          <Route element={<RoleGuard allowedRoles={[ROLES.TEACHER]} />}>
            <Route path={ROUTES.TEACHER.ROOT} element={<Navigate to={ROUTES.TEACHER.DASHBOARD} replace />} />
            <Route path={ROUTES.TEACHER.DASHBOARD} element={<TeacherDashboard />} />
            <Route
              path={ROUTES.TEACHER.AI_DRAFTS}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 3"
                  title="Agentic AI Draft Review & Approval Console"
                  roleName="Teacher"
                />
              }
            />
            <Route
              path={ROUTES.TEACHER.PROCTORING}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 3"
                  title="Live Socket.io Digital Proctoring Feed"
                  roleName="Teacher"
                />
              }
            />
            <Route
              path={ROUTES.TEACHER.ANALYTICS}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 4"
                  title="Granular Recharts Analytics Heatmap (Weak Sub-Topics)"
                  roleName="Teacher"
                />
              }
            />
            <Route
              path={ROUTES.TEACHER.TRACKS}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 5"
                  title="Company-Specific Track Builder (TCS / Accenture)"
                  roleName="Teacher"
                />
              }
            />
          </Route>

          {/* INSTITUTION ADMIN ZONE (Role: INSTITUTION_ADMIN) */}
          <Route element={<RoleGuard allowedRoles={[ROLES.INSTITUTION_ADMIN]} />}>
            <Route path={ROUTES.ADMIN.ROOT} element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route
              path={ROUTES.ADMIN.STUDENT_ONBOARDING}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 5"
                  title="Bulk Student Onboarding via CSV (5,000+ Students)"
                  roleName="Institution Admin"
                />
              }
            />
            <Route
              path={ROUTES.ADMIN.TEACHER_MANAGEMENT}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 5"
                  title="Faculty Invitation & Scope Management"
                  roleName="Institution Admin"
                />
              }
            />
            <Route
              path={ROUTES.ADMIN.DEPARTMENT_READINESS}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 4"
                  title="Departmental Placement Readiness Analytics"
                  roleName="Institution Admin"
                />
              }
            />
            <Route
              path={ROUTES.ADMIN.TRACK_ASSIGNMENT}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 5"
                  title="Institutional Company Track Governance"
                  roleName="Institution Admin"
                />
              }
            />
          </Route>

          {/* PLATFORM SUPER ADMIN ZONE (Role: SUPER_ADMIN) */}
          <Route element={<RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} />}>
            <Route
              path={ROUTES.SUPER_ADMIN.ROOT}
              element={<Navigate to={ROUTES.SUPER_ADMIN.DASHBOARD} replace />}
            />
            <Route path={ROUTES.SUPER_ADMIN.DASHBOARD} element={<SuperAdminDashboard />} />
            <Route
              path={ROUTES.SUPER_ADMIN.TENANTS}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 5"
                  title="Multi-Tenant Provisioning & Tenant CRUD"
                  roleName="Super Admin"
                />
              }
            />
            <Route
              path={ROUTES.SUPER_ADMIN.GLOBAL_CONFIG}
              element={
                <UpcomingPhasePlaceholder
                  phase="Phase 5"
                  title="Global AI Prompt Policies & Platform Settings"
                  roleName="Super Admin"
                />
              }
            />
          </Route>
        </Route>
      </Route>

      {/* Catch-All 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
