import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/authHooks'
import { ROUTES } from '../routes/paths'
import { getDefaultRouteForRole } from '../utils/roleUtils'
import {
  Shield,
  GraduationCap,
  Building,
  Cpu,
  BarChart3,
  Lock,
  ArrowRight,
  Terminal,
} from 'lucide-react'
import RoleSwitcherDev from '../components/common/RoleSwitcherDev'

export const HomePage = () => {
  const { isAuthenticated, role } = useAuth()

  // If already logged in, automatically dispatch to assigned role dashboard
  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                PlacePrep <span className="text-cyan-400 font-extrabold">Secure</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                AI-Powered Placement Preparedness
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={ROUTES.LOGIN}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
            >
              <span>Candidate & Faculty Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-medium mb-6">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Phase 1 Architecture Complete: Identity, RBAC & State</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Bridge the Gap to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300">Modern MNC Corporate Tests</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          The next-generation SaaS assessment ecosystem. Gamified cognitive rounds (Grid Memory &
          Path-finding), Dockerized code execution sandbox, real-time proctoring, and granular
          diagnostic skill heatmaps.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Link
            to={ROUTES.LOGIN}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Student Login (OTP)</span>
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="flex-1 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <Building className="w-5 h-5 text-indigo-400" />
            <span>Institutional SSO</span>
          </Link>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 text-left w-full">
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <Cpu className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="font-bold text-white text-sm">Agentic AI Researcher</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              LangChain ReAct agents synthesize trending MNC question patterns from Reddit and
              GeeksforGeeks into curated drafts.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <Lock className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="font-bold text-white text-sm">Docker Sandbox</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ephemeral isolated containers on Azure Container Apps with zero internet access,
              memory limits, and &lt;2s execution.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <Shield className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white text-sm">Digital Proctor</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Socket.io tab-switch and copy/paste detection with server-side anti-tamper click
              recalculations for gamified rounds.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <BarChart3 className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="font-bold text-white text-sm">Granular Heatmaps</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Actionable topic-level failure analytics (Graphs, SQL Joins, Spatial Memory) driving
              LLaMA 3 personalized study plans.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        PlacePrep Secure • Senior Frontend Architecture by Nikita Bharti • Multi-Tenant SaaS
      </footer>

      {/* Dev Role Switcher */}
      <RoleSwitcherDev />
    </div>
  )
}

export default HomePage
