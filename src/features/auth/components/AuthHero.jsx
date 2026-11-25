import { BrandLogo } from '../../../components/common/BrandLogo';
import { Badge } from '../../../components/ui/Badge';
import {
  Code2,
  Cpu,
  Gamepad2,
  LineChart,
  Lock,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export function AuthHero() {
  const features = [
    {
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      title: 'Multi-Format Assessment Engine',
      description:
        'VS Code Monaco editor for real-world simulation coding, SQL tasks, and interactive problem solving.',
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      title: 'Gamified Cognitive Rounds',
      description:
        'Accenture and Capgemini-style Grid Memory and Path-Finding rounds with anti-tamper server score validation.',
    },
    {
      icon: <LineChart className="w-5 h-5 text-cyan-400" />,
      title: 'Granular Topic-Level Heatmaps',
      description:
        'Educators pinpoint exact student deficiencies (DSA Graphs vs Spatial Memory) across historical exams.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      title: 'Isolated Ephemeral Sandbox',
      description:
        'Zero-trust Docker sandboxes execute untrusted student code with no network egress in under 2 seconds.',
    },
  ];

  return (
    <div className="relative flex flex-col justify-between h-full p-8 lg:p-12 text-slate-100 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 space-y-6">
        <BrandLogo size="lg" />

        <div className="space-y-3 pt-2">
          <Badge variant="primary" dot size="sm" className="mb-2">
            Next-Gen Placement Preparation
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Bridge the gap between academic curricula and{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              top-tier MNC hiring.
            </span>
          </h1>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            A production-ready SaaS placement ecosystem empowering Students with real corporate test simulations and Teachers with AI-driven granular weakness analytics.
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {features.map((feat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-slate-700/80 transition-colors"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                {feat.icon}
              </div>
              <h4 className="text-xs font-semibold text-slate-200">{feat.title}</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {feat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Trust Section */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>OAuth2 + PKCE Security</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Multi-Tenant Row Isolation</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span>Socket.io Live Proctoring</span>
        </div>
      </div>
    </div>
  );
}
