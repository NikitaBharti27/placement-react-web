import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLES } from '../../config/roles'
import { ROUTES } from '../../routes/paths'
import { resolvePostAuthDestination } from '../../utils/roleUtils'
import { DEV_TEST_OTP, MOCK_STUDENTS, MOCK_USERS } from '../../api/authApi'
import { OtpInput } from '../../components/ui/OtpInput'
import {
  GraduationCap,
  Building,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Lock,
  Wand2,
  RefreshCw,
  Clock,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'

const INSTITUTIONAL_PRESETS = [
  {
    role: ROLES.TEACHER,
    label: 'Faculty / Teacher',
    name: MOCK_USERS[ROLES.TEACHER].name,
    email: MOCK_USERS[ROLES.TEACHER].email,
  },
  {
    role: ROLES.INSTITUTION_ADMIN,
    label: 'Institution Admin (HOD)',
    name: MOCK_USERS[ROLES.INSTITUTION_ADMIN].name,
    email: MOCK_USERS[ROLES.INSTITUTION_ADMIN].email,
  },
  {
    role: ROLES.SUPER_ADMIN,
    label: 'Platform Super Admin',
    name: MOCK_USERS[ROLES.SUPER_ADMIN].name,
    email: MOCK_USERS[ROLES.SUPER_ADMIN].email,
  },
]

const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student') // 'student' | 'institutional'
  const [studentId, setStudentId] = useState('')
  const [otp, setOtp] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)
  const [selectedEntraRole, setSelectedEntraRole] = useState(ROLES.TEACHER)
  const [institutionalEmail, setInstitutionalEmail] = useState('')
  const [nowMs, setNowMs] = useState(() => Date.now())

  const {
    isLoading,
    error,
    otpState,
    isEntraConfigured,
    requestOtp,
    verifyOtp,
    loginWithEntra,
    loginWithMockRole,
    clearError,
    resetOtp,
  } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  // Live countdown tick for OTP expiry & resend cooldown
  useEffect(() => {
    if (!otpState.sent || !otpState.expiresAt) return
    const interval = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [otpState.sent, otpState.expiresAt])

  const secondsLeft =
    otpState.sent && otpState.expiresAt
      ? Math.max(0, Math.floor((otpState.expiresAt - nowMs) / 1000))
      : 0

  const resendCooldown =
    otpState.sent && otpState.resendAvailableAt
      ? Math.max(0, Math.ceil((otpState.resendAvailableAt - nowMs) / 1000))
      : 0

  const redirectAfterLogin = (userRole) => {
    navigate(resolvePostAuthDestination(userRole, location.state?.from), { replace: true })
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    clearError()
    if (tab !== 'student') {
      resetOtp()
      setOtp('')
    }
  }

  // Dev Autofill for Student Credentials
  const handleAutofillStudent = (presetId = MOCK_STUDENTS[0].studentId) => {
    clearError()
    setStudentId(presetId)
  }

  // Dev Autofill & instant bypass for Student login
  const handleDevBypassStudent = async () => {
    clearError()
    const targetId = studentId.trim() || MOCK_STUDENTS[0].studentId
    setStudentId(targetId)
    const reqResult = await requestOtp(targetId)
    if (reqResult.success) {
      const passkey = reqResult.mockOtp || DEV_TEST_OTP
      setOtp(passkey)
      const verifyResult = await verifyOtp(targetId, passkey, rememberDevice)
      if (verifyResult.success) {
        redirectAfterLogin(verifyResult.user.role)
      }
    }
  }

  // Dev Autofill for Institutional / Entra ID
  const handleAutofillInstitutional = (preset = INSTITUTIONAL_PRESETS[0]) => {
    clearError()
    setSelectedEntraRole(preset.role)
    setInstitutionalEmail(preset.email)
  }

  // Handle Student Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    clearError()
    const result = await requestOtp(studentId)
    if (result.success) {
      setNowMs(Date.now())
      setOtp('')
    }
  }

  // Handle Student Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    clearError()
    const result = await verifyOtp(otpState.studentId || studentId, otp, rememberDevice)
    if (result.success) {
      redirectAfterLogin(result.user.role)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    clearError()
    setOtp('')
    const result = await requestOtp(otpState.studentId || studentId)
    if (result.success) {
      setNowMs(Date.now())
    }
  }

  // Handle Institutional Entra ID Login (Live PKCE or Dev Simulator)
  const handleEntraLogin = async (e) => {
    if (e) e.preventDefault()
    clearError()
    const result = await loginWithEntra({
      role: selectedEntraRole,
      emailHint: institutionalEmail,
    })
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
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header + Sign In / Register Switcher */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Identity &amp; Access</h1>
          <p className="text-xs text-slate-400 mt-1">
            Passwordless OAuth2 + PKCE authentication portal
          </p>

          <div className="mt-4 inline-flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-white font-semibold">
              Sign In
            </span>
            <Link
              to={ROUTES.REGISTER}
              state={location.state}
              className="px-3 py-1 rounded-lg text-slate-400 hover:text-white transition inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register / Activate</span>
            </Link>
          </div>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-5 border border-slate-700">
          <button
            type="button"
            onClick={() => handleTabSwitch('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
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
            onClick={() => handleTabSwitch('institutional')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'institutional'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Faculty &amp; Admin (Entra ID)</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start space-x-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Tab 1: Student ID + OTP Flow */}
        {activeTab === 'student' && (
          <div>
            {!otpState.sent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="student-reg-id"
                      className="block text-xs font-medium text-slate-300"
                    >
                      College Student Registration ID
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutofillStudent(MOCK_STUDENTS[0].studentId)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-[11px] font-medium transition cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Dev Autofill</span>
                    </button>
                  </div>

                  <input
                    id="student-reg-id"
                    type="text"
                    required
                    autoComplete="username"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value)
                      if (error) clearError()
                    }}
                    placeholder="e.g. STU-2024-8891"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />

                  {/* Seeded student presets for rapid testing */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Sample IDs:
                    </span>
                    {MOCK_STUDENTS.map((s) => (
                      <button
                        key={s.studentId}
                        type="button"
                        onClick={() => handleAutofillStudent(s.studentId)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition cursor-pointer ${
                          studentId.trim().toUpperCase() === s.studentId
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                        title={`${s.name} • ${s.tenantName}`}
                      >
                        {s.studentId}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span>Keep session active across page refreshes</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>{isLoading ? 'Dispatching Passkey...' : 'Request One-Time Passkey'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {import.meta.env.DEV && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleDevBypassStudent}
                    className="w-full py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/60 text-emerald-300 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dev Bypass: Autofill &amp; Sign In Instantly</span>
                  </button>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-200 text-xs flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div>
                      Passkey dispatched for <strong className="text-white">{otpState.studentId}</strong>
                      {otpState.maskedContact && (
                        <span className="text-emerald-300/90"> ({otpState.maskedContact})</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-emerald-400/90 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Valid: {formatCountdown(secondsLeft)}
                      </span>
                      {otpState.mockHint && (
                        <span>Dev Passkey: {otpState.mockHint}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter 6-Digit Passkey
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        clearError()
                        setOtp(otpState.mockHint || DEV_TEST_OTP)
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-[11px] font-medium transition cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Autofill OTP</span>
                    </button>
                  </div>

                  <OtpInput
                    length={6}
                    variant="dark"
                    value={otp}
                    error={Boolean(error)}
                    onChange={(val) => {
                      setOtp(val)
                      if (error) clearError()
                    }}
                    onComplete={(completedVal) => setOtp(completedVal)}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      resetOtp()
                      setOtp('')
                    }}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    &larr; Change Registration ID
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isLoading}
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Passkey'}
                    </span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.replace(/\s+/g, '').length < 6 || secondsLeft === 0}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>{isLoading ? 'Verifying Passkey...' : 'Verify & Enter Exam Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Institutional Sign In (Microsoft Entra ID) */}
        {activeTab === 'institutional' && (
          <form onSubmit={handleEntraLogin} className="space-y-4">
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                isEntraConfigured
                  ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-200'
                  : 'bg-slate-800/70 border-slate-700 text-slate-300'
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isEntraConfigured ? 'text-emerald-400' : 'text-cyan-400'
                }`}
              />
              <div>
                <div className="font-semibold text-white">
                  {isEntraConfigured
                    ? 'Live Microsoft Entra ID (OAuth2 + PKCE)'
                    : 'Entra ID PKCE Simulator (Dev Mode)'}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isEntraConfigured
                    ? 'Authenticates institutional staff via your organization Azure AD tenant with MFA.'
                    : 'No VITE_AZURE_CLIENT_ID detected. Uses local PKCE token simulation cleanly without external popup errors.'}
                </p>
              </div>
            </div>

            {/* Role / Account Autofill Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Institutional Profile
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleAutofillInstitutional(
                      INSTITUTIONAL_PRESETS.find((p) => p.role === selectedEntraRole) ||
                        INSTITUTIONAL_PRESETS[0],
                    )
                  }
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-[11px] font-medium transition cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Dev Autofill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {INSTITUTIONAL_PRESETS.map((preset) => {
                  const selected = selectedEntraRole === preset.role
                  return (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => handleAutofillInstitutional(preset)}
                      className={`px-3 py-2 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                        selected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{preset.label}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{preset.email}</div>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="institutional-email"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Institutional Email (Login Hint)
              </label>
              <input
                id="institutional-email"
                type="email"
                value={institutionalEmail}
                onChange={(e) => {
                  setInstitutionalEmail(e.target.value)
                  if (error) clearError()
                }}
                placeholder="sunita.raman@mitaoe.ac.in"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2.5 transition cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>
                {isLoading
                  ? 'Completing PKCE Handshake...'
                  : isEntraConfigured
                  ? 'Sign in with Microsoft Entra ID'
                  : 'Sign in via Entra PKCE (Dev)'}
              </span>
            </button>
          </form>
        )}

        {/* Rapid Test Bench for all 4 RBAC roles */}
        <div className="mt-7 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Instant RBAC Role Simulators</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Dev Sandbox</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.STUDENT)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.TEACHER)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Faculty View</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.INSTITUTION_ADMIN)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Admin (HOD)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.SUPER_ADMIN)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
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
