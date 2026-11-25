import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { EntraIdButton } from './EntraIdButton';
import { MOCK_TENANTS, USER_ROLES } from '../types/authTypes';
import {
  GraduationCap,
  Building2,
  IdCard,
  Shield,
  ArrowRight,
} from 'lucide-react';

export function LoginForm({
  onRequestOtp,
  onEntraIdLogin,
  onSwitchToRegister,
  isLoading = false,
}) {
  const [activeTab, setActiveTab] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [tenantId, setTenantId] = useState('t-mit');
  const [adminTenantDomain, setAdminTenantDomain] = useState('mit.edu');
  const [error, setError] = useState('');

  const tenantOptions = MOCK_TENANTS.map((t) => ({
    value: t.id,
    label: `${t.name} (${t.domain})`,
  }));

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('Please provide your Student ID / Roll Number.');
      return;
    }
    if (!tenantId) {
      setError('Please select your College / Institution.');
      return;
    }
    setError('');
    const selectedTenant = MOCK_TENANTS.find((t) => t.id === tenantId);
    onRequestOtp({
      studentId: studentId.trim(),
      tenantId,
      tenantName: selectedTenant?.name || 'Selected Institution',
    });
  };

  const handleEntraSubmit = (role) => {
    setError('');
    onEntraIdLogin({
      domain: adminTenantDomain,
      role: role || USER_ROLES.TEACHER,
    });
  };

  const handleQuickDemoStudent = () => {
    setStudentId('2024CS108');
    setTenantId('t-mit');
    setError('');
  };

  return (
    <div className="w-full space-y-5 text-left">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Sign In to PlacePrep
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Select your portal to securely access test modules and analytics.
        </p>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setError(''); }}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            value="student"
            icon={<GraduationCap className="w-4 h-4 text-indigo-400" />}
          >
            Student Portal
          </TabsTrigger>
          <TabsTrigger
            value="institutional"
            icon={<Building2 className="w-4 h-4 text-cyan-400" />}
          >
            Faculty & Admin
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Student Login (Passwordless OTP) */}
        <TabsContent value="student" className="space-y-4 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Passwordless 2-Factor Flow</span>
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer font-medium text-[11px]"
            >
              Demo Auto-Fill ID
            </button>
          </div>

          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <Select
              label="College / Institution"
              options={tenantOptions}
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              required
            />

            <Input
              label="Student ID / Roll Number"
              placeholder="e.g. 2024CS108 or STU-8849"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (error) setError('');
              }}
              leftIcon={<IdCard className="w-4 h-4" />}
              required
            />

            <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-[11px] text-slate-300 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Passwords are not used. A secure 6-digit OTP will be dispatched to your college-verified institutional address.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Request One-Time Passcode
            </Button>
          </form>

          <div className="pt-3 text-center text-xs text-slate-400 border-t border-slate-800/80">
            First time taking an assessment?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
            >
              Register your Student Profile
            </button>
          </div>
        </TabsContent>

        {/* Tab 2: Faculty & Institutional Admin (Microsoft Entra ID) */}
        <TabsContent value="institutional" className="space-y-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Institutional Single Sign-On (SSO)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Faculty, College Administrators, and Platform Owners authenticate through Microsoft Entra ID with OAuth2 PKCE token exchange and MFA enforcement.
            </p>
          </div>

          <Input
            label="College Domain / Tenant Hint"
            placeholder="e.g. mit.edu or college.ac.in"
            value={adminTenantDomain}
            onChange={(e) => setAdminTenantDomain(e.target.value)}
            helperText="Allows multi-tenant discovery and redirect to your university Azure portal"
          />

          <div className="space-y-2 pt-1">
            <EntraIdButton
              isLoading={isLoading}
              onClick={() => handleEntraSubmit(USER_ROLES.TEACHER)}
              label="Sign in with Microsoft Entra ID"
            />
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            Supported Roles: Teacher • Placement HOD • Platform Super Admin
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
