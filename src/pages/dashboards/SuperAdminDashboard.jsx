import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROUTES } from '../../routes/paths'
import { Layers, Plus, Shield } from 'lucide-react'

export const SuperAdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const tenants = [
    {
      id: 'tenant_mit_pune',
      name: 'MIT Academy of Engineering',
      domain: 'mitaoe.ac.in',
      students: 4250,
      faculty: 32,
      status: 'Active',
    },
    {
      id: 'tenant_coep_tech',
      name: 'COEP Technological University',
      domain: 'coep.ac.in',
      students: 6100,
      faculty: 45,
      status: 'Active',
    },
    {
      id: 'tenant_vit_vellore',
      name: 'Vellore Institute of Technology',
      domain: 'vit.ac.in',
      students: 12400,
      faculty: 95,
      status: 'Active',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-400/30">
            <Layers className="w-3.5 h-3.5 text-purple-300" />
            <span>PlacePrep Super Admin Platform Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {user?.name || 'Platform Operator'}
          </h1>
          <p className="text-sm text-purple-200 mt-1">
            Global SaaS Infrastructure &amp; Multi-Tenant Provisioning
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
            <div className="text-xl font-bold text-white">{tenants.length}</div>
            <div className="text-[11px] text-purple-200 uppercase tracking-wider font-semibold">
              Active Tenants
            </div>
          </div>
          <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
            <div className="text-xl font-bold text-emerald-400">99.98%</div>
            <div className="text-[11px] text-purple-200 uppercase tracking-wider font-semibold">
              Uptime
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Provisioned Tenants (Colleges)</h2>
            <p className="text-xs text-slate-500">
              Strict multi-tenant Row Level Security (RLS) ensures full data boundary isolation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.SUPER_ADMIN.TENANTS)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Tenant</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">College / Tenant</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Enrolled Candidates</th>
                <th className="py-3 px-4">Faculty Count</th>
                <th className="py-3 px-4">Data Isolation</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{tenant.name}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{tenant.domain}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {tenant.students.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{tenant.faculty}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Shield className="w-3 h-3" />
                      Postgres RLS
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {tenant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
