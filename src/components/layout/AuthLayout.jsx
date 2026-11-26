import { Outlet, Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { ROUTES } from '../../routes/paths'
import RoleSwitcherDev from '../common/RoleSwitcherDev'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col justify-between p-4 sm:p-6 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-3">
        <Link to={ROUTES.HOME} className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              PlacePrep <span className="text-cyan-400 font-extrabold">Secure</span>
            </span>
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400">
              Enterprise Placement Platform
            </span>
          </div>
        </Link>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-3">
          <span>Zero-Trust • OAuth2 + PKCE • Automated Anti-Cheat</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center py-6">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 py-4 border-t border-slate-800/80">
        <p>© 2026 PlacePrep Secure Ecosystem. Multi-Tenant SaaS • React + Redux Toolkit.</p>
      </footer>

      <RoleSwitcherDev />
    </div>
  )
}

export default AuthLayout
