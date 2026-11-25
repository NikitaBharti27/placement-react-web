import { useState } from 'react';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayoutPreview } from './layouts/DashboardLayoutPreview';
import { AssessmentLayout } from './layouts/AssessmentLayout';
import { LoginForm } from './features/auth/components/LoginForm';
import { OtpVerificationForm } from './features/auth/components/OtpVerificationForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { useAuthMock } from './features/auth/hooks/useAuthMock';
import { USER_ROLES } from './features/auth/types/authTypes';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { RoleBadgeSelector } from './features/auth/components/RoleBadgeSelector';
import { Button } from './components/ui/Button';
import { PlayCircle } from 'lucide-react';

export default function App() {
  const {
    user,
    authStep,
    setAuthStep,
    pendingStudent,
    isLoading,
    requestOtp,
    verifyOtp,
    loginWithEntraId,
    registerStudent,
    switchRole,
    logout,
  } = useAuthMock();

  const [activeView, setActiveView] = useState('DASHBOARD'); // 'DASHBOARD' | 'ASSESSMENT'

  const handleRoleChange = (newRole) => {
    setActiveView('DASHBOARD');
    switchRole(newRole);
  };

  const handleLogout = () => {
    setActiveView('DASHBOARD');
    logout();
  };

  if (authStep === 'AUTHENTICATED' && user && activeView === 'ASSESSMENT') {
    return (
      <AssessmentLayout
        onExitAssessment={() => setActiveView('DASHBOARD')}
      />
    );
  }

  if (authStep === 'AUTHENTICATED' && user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A0D14] text-slate-100 bg-radial-glow bg-grid-pattern selection:bg-indigo-500 selection:text-white">
        <Header activeRole={user.role} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Active Session Preview</span>
              <span className="text-slate-400">• Role: {user.role}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {user.role === USER_ROLES.STUDENT && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveView('ASSESSMENT')}
                  leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
                >
                  Open Phase 2 Exam UI
                </Button>
              )}
              <RoleBadgeSelector
                currentRole={user.role}
                onSelectRole={handleRoleChange}
              />
            </div>
          </div>

          <DashboardLayoutPreview
            user={user}
            onLogout={handleLogout}
            onSwitchRole={handleRoleChange}
            onStartAssessment={() => setActiveView('ASSESSMENT')}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AuthLayout
      currentRole={user?.role}
      onSelectRole={handleRoleChange}
    >
      {authStep === 'LOGIN' && (
        <LoginForm
          onRequestOtp={requestOtp}
          onEntraIdLogin={loginWithEntraId}
          onSwitchToRegister={() => setAuthStep('REGISTER')}
          isLoading={isLoading}
        />
      )}

      {authStep === 'OTP_VERIFICATION' && (
        <OtpVerificationForm
          studentId={pendingStudent?.studentId}
          tenantName={pendingStudent?.tenantName}
          onVerify={verifyOtp}
          onBack={() => setAuthStep('LOGIN')}
          onResend={() => requestOtp(pendingStudent)}
          isLoading={isLoading}
        />
      )}

      {authStep === 'REGISTER' && (
        <RegisterForm
          onRegister={registerStudent}
          onSwitchToLogin={() => setAuthStep('LOGIN')}
          isLoading={isLoading}
        />
      )}
    </AuthLayout>
  );
}
