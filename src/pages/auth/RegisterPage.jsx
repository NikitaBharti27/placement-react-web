import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROLES } from '../../config/roles'
import { ROUTES } from '../../routes/paths'
import { INSTITUTION_TENANTS, DEPARTMENTS } from '../../config/authConfig'
import { resolvePostAuthDestination } from '../../utils/roleUtils'
import { DEV_TEST_OTP } from '../../api/authApi'
import { OtpInput } from '../../components/ui/OtpInput'
import {
  UserPlus,
  GraduationCap,
  Building,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Wand2,
  ShieldCheck,
} from 'lucide-react'

export const RegisterPage = () => {
  const [accountType, setAccountType] = useState('student') // 'student' | 'institutional'
  const [tenantId, setTenantId] = useState(INSTITUTION_TENANTS[0].id)
  const [department, setDepartment] = useState(DEPARTMENTS[0])

  // Student activation fields
  const [studentId, setStudentId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [graduationYear, setGraduationYear] = useState('2026')
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [otp, setOtp] = useState('')

  // Institutional onboarding fields
  const [instRole, setInstRole] = useState(ROLES.TEACHER)

  const {
    isLoading,
    error,
    otpState,
    registerStudent,
    verifyOtp,
    registerInstitutional,
    clearError,
    resetOtp,
  } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const redirectAfterAuth = (role) => {
    navigate(resolvePostAuthDestination(role, location.state?.from), { replace: true })
  }

  const handleSwitchType = (nextType) => {
    setAccountType(nextType)
    clearError()
    resetOtp()
    setOtp('')
  }

  const handleAutofillStudentReg = () => {
    clearError()
    const selectedTenant = INSTITUTION_TENANTS.find((t) => t.id === tenantId) || INSTITUTION_TENANTS[0]
    setStudentId('STU-2026-4410')
    setFullName('Ananya Verma')
    setEmail(`ananya.verma@${selectedTenant.domain}`)
    setDepartment(DEPARTMENTS[0])
    setGraduationYear('2026')
    setConsentAccepted(true)
  }

  const handleAutofillInstitutionalReg = () => {
    clearError()
    const selectedTenant = INSTITUTION_TENANTS.find((t) => t.id === tenantId) || INSTITUTION_TENANTS[0]
    setFullName(instRole === ROLES.INSTITUTION_ADMIN ? 'Dr. Vikram Joshi (HOD)' : 'Prof. Meera Deshpande')
    setEmail(
      instRole === ROLES.INSTITUTION_ADMIN
        ? `hod.placement@${selectedTenant.domain}`
        : `meera.deshpande@${selectedTenant.domain}`,
    )
    setDepartment(DEPARTMENTS[1])
    setConsentAccepted(true)
  }

  const handleStudentRegisterSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (!consentAccepted) return
    const result = await registerStudent({
      studentId,
      name: fullName,
      email,
      department,
      tenantId,
      graduationYear,
    })
    if (result.success) {
      setOtp('')
    }
  }

  const handleVerifyRegistrationOtp = async (e) => {
    e.preventDefault()
    clearError()
    const result = await verifyOtp(otpState.studentId || studentId, otp, true)
    if (result.success) {
      redirectAfterAuth(result.user.role)
    }
  }

  const handleInstitutionalRegisterSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (!consentAccepted) return
    const result = await registerInstitutional({
      name: fullName,
      email,
      role: instRole,
      department,
      tenantId,
    })
    if (result.success) {
      redirectAfterAuth(result.user.role)
    }
  }

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header + Sign In / Register Switcher */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Activate Campus Account</h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-password student onboarding &amp; institutional Entra ID provisioning
          </p>

          <div className="mt-4 inline-flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-1 text-xs">
            <Link
              to={ROUTES.LOGIN}
              state={location.state}
              className="px-3 py-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              Sign In
            </Link>
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-white font-semibold">
              Register / Activate
            </span>
          </div>
        </div>

        {/* Account Type Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl mb-5 border border-slate-700">
          <button
            type="button"
            onClick={() => handleSwitchType('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              accountType === 'student'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Activation</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchType('institutional')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              accountType === 'institutional'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Faculty &amp; Admin</span>
          </button>
        </div>

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

        {/* Student Registration Flow */}
        {accountType === 'student' && (
          <>
            {!otpState.sent ? (
              <form onSubmit={handleStudentRegisterSubmit} className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Candidate Enrollment Details
                  </span>
                  <button
                    type="button"
                    onClick={handleAutofillStudentReg}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-[11px] font-medium transition cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Dev Autofill</span>
                  </button>
                </div>

                <div>
                  <label htmlFor="reg-tenant" className="block text-xs font-medium text-slate-300 mb-1">
                    College / Institution Tenant
                  </label>
                  <select
                    id="reg-tenant"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {INSTITUTION_TENANTS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.domain})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-stu-id" className="block text-xs font-medium text-slate-300 mb-1">
                      Registration ID
                    </label>
                    <input
                      id="reg-stu-id"
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="STU-2026-4410"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-grad-year" className="block text-xs font-medium text-slate-300 mb-1">
                      Graduation Cohort
                    </label>
                    <select
                      id="reg-grad-year"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {['2025', '2026', '2027', '2028'].map((yr) => (
                        <option key={yr} value={yr}>
                          Class of {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-fullname" className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Verma"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300 mb-1">
                      Campus Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@mitaoe.ac.in"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-dept" className="block text-xs font-medium text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      id="reg-dept"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="leading-relaxed">
                    I agree to passwordless OTP identity verification and PlacePrep Secure anti-cheat policies.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !consentAccepted}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>{isLoading ? 'Activating Profile...' : 'Activate & Send Verification Passkey'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyRegistrationOtp} className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-200 text-xs flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">
                      Profile Created for {otpState.studentId}
                    </div>
                    <div className="text-emerald-300/90 mt-0.5">{otpState.message}</div>
                    {otpState.mockHint && (
                      <div className="font-mono text-[11px] text-emerald-400 mt-1">
                        Dev Passkey: {otpState.mockHint}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Verify 6-Digit Activation Passkey
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

                <button
                  type="submit"
                  disabled={isLoading || otp.replace(/\s+/g, '').length < 6}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>{isLoading ? 'Verifying...' : 'Complete Activation & Enter Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </>
        )}

        {/* Faculty / Institution Admin Registration Flow */}
        {accountType === 'institutional' && (
          <form onSubmit={handleInstitutionalRegisterSubmit} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Institutional Entra ID Onboarding
              </span>
              <button
                type="button"
                onClick={handleAutofillInstitutionalReg}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 text-[11px] font-medium transition cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>Dev Autofill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="inst-tenant" className="block text-xs font-medium text-slate-300 mb-1">
                  Institution Tenant
                </label>
                <select
                  id="inst-tenant"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INSTITUTION_TENANTS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="inst-role" className="block text-xs font-medium text-slate-300 mb-1">
                  Access Role
                </label>
                <select
                  id="inst-role"
                  value={instRole}
                  onChange={(e) => setInstRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={ROLES.TEACHER}>Faculty / Teacher</option>
                  <option value={ROLES.INSTITUTION_ADMIN}>Institution Admin (HOD)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="inst-name" className="block text-xs font-medium text-slate-300 mb-1">
                Full Name &amp; Title
              </label>
              <input
                id="inst-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Prof. Meera Deshpande"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="inst-email" className="block text-xs font-medium text-slate-300 mb-1">
                  Institutional Email
                </label>
                <input
                  id="inst-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@mitaoe.ac.in"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="inst-dept" className="block text-xs font-medium text-slate-300 mb-1">
                  Department
                </label>
                <select
                  id="inst-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                RBAC privileges and tenant isolation boundaries are enforced via Microsoft Entra ID
                OAuth2 + PKCE tokens. No local passwords are stored.
              </span>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
              />
              <span>
                I confirm institutional authorization to access faculty or college governance tools.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !consentAccepted}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>{isLoading ? 'Provisioning Institutional Role...' : 'Link Entra ID & Enter Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
