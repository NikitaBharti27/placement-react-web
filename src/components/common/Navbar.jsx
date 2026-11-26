import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../config/roles'
import { ROUTES } from '../../routes/paths'
import { getDefaultRouteForRole } from '../../utils/roleUtils'
import { LogOut, Building2, Shield, User, Menu, X } from 'lucide-react'

export const Navbar = ({ isMobileNavOpen = false, onToggleMobileNav }) => {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Left: Mobile Menu Button + Brand Logo & Tenant Badge */}
          <div className="flex items-center space-x-3 min-w-0">
            {onToggleMobileNav && (
              <button
                type="button"
                onClick={onToggleMobileNav}
                aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileNavOpen}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to={getDefaultRouteForRole(role)} className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  PlacePrep <span className="text-indigo-600 font-extrabold">Secure</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  AI Placement Ecosystem
                </span>
              </div>
            </Link>

            {user?.tenantName && (
              <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[210px]">{user.tenantName}</span>
              </div>
            )}
          </div>

          {/* Right: Role Pill, User Profile, Sign Out */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            {role && (
              <span
                className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  ROLE_BADGE_COLORS[role] || 'bg-slate-100 text-slate-800'
                }`}
              >
                {ROLE_LABELS[role] || role}
              </span>
            )}

            <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 ring-2 ring-indigo-50"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name[0] : <User className="w-4 h-4" />}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-slate-500 truncate max-w-[150px]">
                  {user?.studentId ? `ID: ${user.studentId}` : user?.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
