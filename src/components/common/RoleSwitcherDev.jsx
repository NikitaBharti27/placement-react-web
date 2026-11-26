import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLES, ROLE_LABELS } from '../../config/roles'
import { ROUTES } from '../../routes/paths'
import { getDefaultRouteForRole } from '../../utils/roleUtils'
import { ShieldCheck, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react'

const SHOW_DEV_SANDBOX =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_SANDBOX === 'true'

export const RoleSwitcherDev = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { user, role, isAuthenticated, loginWithMockRole, logout } = useAuth()
  const navigate = useNavigate()

  if (!SHOW_DEV_SANDBOX) return null

  const handleRoleSelect = (targetRole) => {
    loginWithMockRole(targetRole)
    navigate(getDefaultRouteForRole(targetRole))
  }

  return (
    <aside aria-label="Development Role Sandbox" className="fixed bottom-3 right-3 z-50 font-sans text-xs">
      <div className="flex items-center space-x-2 bg-slate-900/95 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-700 backdrop-blur-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold tracking-wide text-slate-300">RBAC Dev Sandbox</span>
        {isAuthenticated && (
          <span className="px-1.5 py-0.5 rounded bg-indigo-600/80 text-white text-[11px] font-mono">
            {role}
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-slate-800 rounded transition cursor-pointer"
          title="Toggle RBAC Dev Sandbox"
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 w-80 bg-slate-900 text-slate-200 rounded-xl p-4 shadow-2xl border border-slate-700 space-y-3 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-medium text-slate-400">Simulate Identity &amp; Role</span>
            <span className="text-[10px] text-slate-500 font-mono">Dev Bypass</span>
          </div>

          <button
            type="button"
            onClick={() => {
              loginWithMockRole(ROLES.STUDENT)
              navigate('/student/assessment/tcs-nqt-tech-01')
            }}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-lg text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <span>⚡ Launch Phase 2 Assessment Engine</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {Object.values(ROLES).map((r) => {
              const active = role === r && isAuthenticated
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium border transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-semibold truncate">{ROLE_LABELS[r]}</div>
                  <div className="text-[10px] opacity-75">{r}</div>
                </button>
              )
            })}
          </div>

          <div className="border-t border-slate-800 pt-2 space-y-1.5">
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Test Security Boundary Violation:</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
                className="px-2 py-1 bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/80 rounded text-[11px] cursor-pointer"
              >
                Go to /admin
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.TEACHER.DASHBOARD)}
                className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900 text-amber-200 border border-amber-800/80 rounded text-[11px] cursor-pointer"
              >
                Go to /teacher
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.SUPER_ADMIN.DASHBOARD)}
                className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-800/80 rounded text-[11px] cursor-pointer"
              >
                Go to /super-admin
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-[11px]">
            {isAuthenticated ? (
              <>
                <span className="text-slate-400 truncate max-w-[170px]">{user?.name}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    navigate(ROUTES.LOGIN)
                  }}
                  className="text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex w-full justify-between">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  Go to Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}

export default RoleSwitcherDev
