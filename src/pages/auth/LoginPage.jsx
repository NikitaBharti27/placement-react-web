import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLES } from '../../config/roles'
import { getDefaultRouteForRole } from '../../utils/roleUtils'
import {
  GraduationCap,
  Building,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student') // 'student' | 'institutional'
  const [studentId, setStudentId] = useState('')
  const [otp, setOtp] = useState('')

  const {
    isLoading,
    error,
    otpState,
    requestOtp,
    verifyOtp,
    loginWithEntra,
    loginWithMockRole,
    clearError,
    resetOtp,
  } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  // Determine redirection destination
  const redirectAfterLogin = (userRole) => {
    const fromPath = location.state?.from?.pathname
    if (fromPath && fromPath !== '/login' && fromPath !== '/unauthorized') {
      navigate(fromPath, { replace: true })
    } else {
      navigate(getDefaultRouteForRole(userRole), { replace: true })
    }
  }

  // Handle Student Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    clearError()
    const result = await requestOtp(studentId)
    if (result.success && result.mockOtp) {
      setOtp(result.mockOtp) // Pre-fill mock OTP in development
    }
  }

  // Handle Student Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    clearError()
    const result = await verifyOtp(studentId, otp)
    if (result.success) {
      redirectAfterLogin(result.user.role)
    }
  }

  // Handle Institutional Entra ID Login
  const handleEntraLogin = async () => {
    clearError()
    const result = await loginWithEntra()
    if (result.success) {
      redirectAfterLogin(result.user.role)
    }
  }

  // Quick Demo Access
  const handleQuickDemo = (role) => {
    clearError()
    const result = loginWithMockRole(role)
    if (result.success) {
      redirectAfterLogin(role)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card container */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Identity & Access</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your secure assessment workspace
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student')
              clearError()
              resetOtp()
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student (OTP)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('institutional')
              clearError()
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'institutional'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Faculty & Admin (Entra ID)</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Tab 1: Student ID + OTP Flow */}
        {activeTab === 'student' && (
          <div>
            {!otpState.sent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    College Student Registration ID
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU-2024-8891"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    No password required. A 6-digit one-time passkey will be generated.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
                >
                  <span>{isLoading ? 'Sending Passkey...' : 'Request One-Time Passkey'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    Passkey sent for <strong className="text-white">{otpState.studentId}</strong>.
                    {otpState.mockHint && (
                      <span className="block text-[11px] text-emerald-400 font-mono mt-0.5">
                        Test passkey: {otpState.mockHint}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Enter 6-Digit Passkey
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full tracking-widest text-center font-mono text-lg px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={resetOtp}
                    className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
                  >
                    Change ID
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify & Enter Exam Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Institutional Sign In (Microsoft Entra ID) */}
        {activeTab === 'institutional' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-400 leading-relaxed">
              Institutional single sign-on protects live proctoring feeds, AI draft curation, and
              departmental analytics. Protected by Microsoft Entra ID (OAuth2 + PKCE with MFA).
            </div>

            <button
              type="button"
              onClick={handleEntraLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2.5 transition"
            >
              <Building className="w-4 h-4" />
              <span>{isLoading ? 'Connecting to Entra ID...' : 'Sign in with Microsoft Entra ID'}</span>
            </button>
          </div>
        )}

        {/* Rapid Test Bench - Nikita's quick tester for pair programming & grading */}
        <div className="mt-8 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Instant Role Simulators
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Phase 1 Demo</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo(ROLES.STUDENT)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg border border-slate-700 flex items-center space-x-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.TEACHER)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 flex items-center space-x-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Faculty View</span>
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.INSTITUTION_ADMIN)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 flex items-center space-x-1.5"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Admin (HOD)</span>
            </button>
            <button
              onClick={() => handleQuickDemo(ROLES.SUPER_ADMIN)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-slate-700 flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
