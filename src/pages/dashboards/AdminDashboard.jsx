import { useAuth } from '../../features/auth/authHooks'
import {
  Building2,
  Upload,
  UserPlus,
  BarChart,
  GitBranch,
} from 'lucide-react'

export const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Institution Administration Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {user?.name || 'College Administrator'}
          </h1>
          <p className="text-sm text-amber-100 mt-1">
            {user?.tenantName} • Provisioning & Governance
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
            <div className="text-xl font-bold text-white">4,250</div>
            <div className="text-[11px] text-amber-200 uppercase tracking-wider font-semibold">
              Enrolled Students
            </div>
          </div>
          <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
            <div className="text-xl font-bold text-white">32</div>
            <div className="text-[11px] text-amber-200 uppercase tracking-wider font-semibold">
              Active Faculty
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Module 1: Bulk CSV Upload */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Bulk Student Onboarding</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload CSV rosters of 5,000+ candidates to instantly provision zero-password student
            accounts with Azure Blob storage integration.
          </p>
          <div className="pt-2">
            <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition">
              Upload CSV File
            </button>
          </div>
        </div>

        {/* Module 2: Faculty Invitations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Faculty Access</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Invite faculty members, assign department scopes, and grant AI draft approval privileges
            with Microsoft Entra ID policies.
          </p>
          <div className="pt-2">
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition">
              Invite Teacher
            </button>
          </div>
        </div>

        {/* Module 3: Department Readiness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Department Readiness</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Compare placement preparation metrics across Computer Science (84%), IT (79%), and
            Mechanical (52%).
          </p>
          <div className="pt-2">
            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition">
              View Analytics
            </button>
          </div>
        </div>

        {/* Module 4: Company Track Assignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Company Tracks</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Assign company-specific preparation tracks (TCS NQT, Accenture Gamified, Infosys
            Specialist) across departments.
          </p>
          <div className="pt-2">
            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition">
              Manage Tracks
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
