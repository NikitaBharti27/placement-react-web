import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLES } from '../../config/roles'
import { ROUTES } from '../../routes/paths'
import {
  LayoutDashboard,
  FileCode,
  Gamepad2,
  Brain,
  Trophy,
  FileCheck2,
  Eye,
  BarChart3,
  GitBranch,
  Users,
  Upload,
  Layers,
  Settings,
  GraduationCap,
} from 'lucide-react'

export const Sidebar = () => {
  const { role } = useAuth()

  const getNavLinks = () => {
    switch (role) {
      case ROLES.STUDENT:
        return [
          { label: 'Overview', to: ROUTES.STUDENT.DASHBOARD, icon: LayoutDashboard },
          { label: 'Assessments', to: ROUTES.STUDENT.ASSESSMENTS, icon: FileCode },
          { label: 'Cognitive Games', to: ROUTES.STUDENT.GAMES, icon: Gamepad2, badge: 'MNC' },
          { label: 'AI Study Plan', to: ROUTES.STUDENT.STUDY_PLAN, icon: Brain },
          { label: 'Leaderboard', to: ROUTES.STUDENT.LEADERBOARD, icon: Trophy },
        ]

      case ROLES.TEACHER:
        return [
          { label: 'Faculty Dashboard', to: ROUTES.TEACHER.DASHBOARD, icon: LayoutDashboard },
          { label: 'AI Draft Reviews', to: ROUTES.TEACHER.AI_DRAFTS, icon: FileCheck2, badge: 'Review' },
          { label: 'Live Proctoring', to: ROUTES.TEACHER.PROCTORING, icon: Eye, badge: 'Live' },
          { label: 'Analytics Heatmap', to: ROUTES.TEACHER.ANALYTICS, icon: BarChart3 },
          { label: 'Company Tracks', to: ROUTES.TEACHER.TRACKS, icon: GitBranch },
        ]

      case ROLES.INSTITUTION_ADMIN:
        return [
          { label: 'Admin Overview', to: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
          { label: 'Bulk Student CSV', to: ROUTES.ADMIN.STUDENT_ONBOARDING, icon: Upload },
          { label: 'Faculty Access', to: ROUTES.ADMIN.TEACHER_MANAGEMENT, icon: Users },
          { label: 'Department Readiness', to: ROUTES.ADMIN.DEPARTMENT_READINESS, icon: BarChart3 },
          { label: 'Track Assignment', to: ROUTES.ADMIN.TRACK_ASSIGNMENT, icon: GitBranch },
        ]

      case ROLES.SUPER_ADMIN:
        return [
          { label: 'Global Console', to: ROUTES.SUPER_ADMIN.DASHBOARD, icon: LayoutDashboard },
          { label: 'Tenants (Colleges)', to: ROUTES.SUPER_ADMIN.TENANTS, icon: Layers },
          { label: 'System Configuration', to: ROUTES.SUPER_ADMIN.GLOBAL_CONFIG, icon: Settings },
        ]

      default:
        return []
    }
  }

  const links = getNavLinks()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation Menu
          </div>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold rounded-md bg-indigo-100 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Security Status Box */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-500">
        <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>PlacePrep Zero-Trust</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          OAuth2 + PKCE secured. Role boundaries strictly enforced on all client routes.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
