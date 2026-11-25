import { AuthHero } from '../features/auth/components/AuthHero';
import { Card } from '../components/ui/Card';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { RoleBadgeSelector } from '../features/auth/components/RoleBadgeSelector';

export function AuthLayout({ children, currentRole, onSelectRole }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14] text-slate-100 bg-radial-glow bg-grid-pattern selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header activeRole={currentRole} />

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {/* Role Simulator Pill for Evaluators */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">PlacePrep Secure</span>
            <span className="text-slate-400">• Phase 1 Preview Harness</span>
          </div>
          <RoleBadgeSelector
            currentRole={currentRole}
            onSelectRole={onSelectRole}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Panel */}
          <div className="lg:col-span-7 hidden lg:block rounded-3xl bg-slate-950/60 border border-slate-800/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            <AuthHero />
          </div>

          {/* Right Interactive Auth Center */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <Card
              glow
              className="w-full max-w-md p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl relative z-10"
            >
              {children}
            </Card>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
