import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLE_LABELS } from '../../config/roles'
import { getDefaultRouteForRole } from '../../utils/roleUtils'
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react'

export const UnauthorizedPage = () => {
  const { role, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const attemptedPath = location.state?.from || 'Restricted Area'
  const requiredRoles = location.state?.requiredRoles || []

  const handleReturnToDashboard = () => {
    navigate(getDefaultRouteForRole(role), { replace: true })
  }

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-slate-900/90 border border-red-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
        {/* Warning Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800 text-red-400 mb-4 shadow-lg shadow-red-900/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">403 — Access Denied</h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Role-Based Access Control (RBAC) Policy Violation
        </p>

        {/* Security Incident Breakdown */}
        <div className="my-6 p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Attempted Resource:</span>
            <span className="font-mono text-amber-300 font-medium px-2 py-0.5 bg-amber-950/50 rounded border border-amber-900/40">
              {attemptedPath}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Your Current Role:</span>
            <span className="font-semibold text-white px-2 py-0.5 bg-slate-800 rounded">
              {role ? ROLE_LABELS[role] || role : 'Guest / Unauthenticated'}
            </span>
          </div>

          {requiredRoles.length > 0 && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Required Role(s):</span>
              <span className="font-mono text-emerald-400 px-2 py-0.5 bg-emerald-950/50 rounded border border-emerald-900/40">
                {requiredRoles.join(', ')}
              </span>
            </div>
          )}

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            As per PlacePrep Secure institutional guidelines, student accounts are restricted from
            accessing teacher grading dashboards and administrative configuration panels.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReturnToDashboard}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            onClick={handleSignOut}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Role / Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
