import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { USER_ROLES } from '../features/auth/types/authTypes';
import {
  GraduationCap,
  Briefcase,
  Building,
  ShieldCheck,
  LogOut,
  Sparkles,
  Lock,
  PlayCircle,
} from 'lucide-react';

export function DashboardLayoutPreview({ user, onLogout, onStartAssessment }) {
  const roleMetadata = {
    [USER_ROLES.STUDENT]: {
      label: 'Student Assessment Portal',
      badge: 'Candidate View',
      color: 'indigo',
      description: 'Access assigned multi-format assessments, VS Code Monaco simulation coding, and gamified cognitive rounds.',
      cards: [
        {
          title: 'Accenture Cognitive Challenge',
          type: 'Gamified (Grid Memory + Path Finding)',
          status: 'Ready to Start',
          badge: 'Accenture Pattern',
          badgeVariant: 'secondary',
        },
        {
          title: 'TCS NQT Simulation Coding Track',
          type: 'Split-Screen Engine (MCQ • Simulation • SQL • UI)',
          status: 'Due Tomorrow • Phase 2 Workspace Live',
          badge: 'TCS Pattern',
          badgeVariant: 'primary',
          actionLabel: 'Launch Assessment Engine',
        },
        {
          title: 'AI Personalized Study Plan',
          type: 'Groq LLaMA 3 Remediation',
          status: 'Generated from Weaknesses',
          badge: 'Weakness: Graphs (DSA)',
          badgeVariant: 'warning',
        },
      ],
    },
    [USER_ROLES.TEACHER]: {
      label: 'Teacher & Live Proctoring Dashboard',
      badge: 'Faculty View',
      color: 'purple',
      description: 'Review AI-generated test drafts (Reddit/GFG scraped), monitor live exams with Socket.io anti-cheat, and inspect topic-level heatmaps.',
      cards: [
        {
          title: 'AI Draft Review Queue (Human-in-the-Loop)',
          type: 'Source: r/AccenturePrep2024 via LangChain',
          status: '1 Draft Awaiting Review',
          badge: 'Needs Approval',
          badgeVariant: 'warning',
        },
        {
          title: 'Live Exam Anti-Cheat Monitor',
          type: 'Socket.io Event Ingestion',
          status: '0 Active Violations',
          badge: 'Proctor Active',
          badgeVariant: 'success',
        },
        {
          title: 'Granular Topic-Level Heatmap',
          type: 'Cross-Exam SQL Aggregations',
          status: 'Cohort Weakness: SQL Joins (72% fail)',
          badge: 'Action Needed',
          badgeVariant: 'danger',
        },
      ],
    },
    [USER_ROLES.INSTITUTION_ADMIN]: {
      label: 'Institution Administration Panel',
      badge: 'College Admin',
      color: 'cyan',
      description: 'Bulk provision student accounts via CSV, invite faculty members, and track placement readiness across departments.',
      cards: [
        {
          title: 'Bulk Student Onboarding',
          type: 'CSV Ingestion (5,000+ students)',
          status: 'Ready for upload',
          badge: 'Multi-Tenant',
          badgeVariant: 'info',
        },
        {
          title: 'Departmental Placement Readiness',
          type: 'CSE vs IT vs ECE Analytics',
          status: 'CSE: 84% Ready • ECE: 68% Ready',
          badge: 'Department Projections',
          badgeVariant: 'primary',
        },
        {
          title: 'Company-Specific Tracks',
          type: 'Curriculum Alignment',
          status: '3 Active Tracks (TCS, Accenture, Capgemini)',
          badge: 'Active Cohort',
          badgeVariant: 'success',
        },
      ],
    },
    [USER_ROLES.SUPER_ADMIN]: {
      label: 'Super Admin Global Console',
      badge: 'Platform Owner',
      color: 'emerald',
      description: 'Manage SaaS tenants (Colleges), configure global AI agent prompts, oversee data isolation, and monitor system health.',
      cards: [
        {
          title: 'Multi-Tenant Management (Tenant CRUD)',
          type: 'PostgreSQL Row-Level Security',
          status: '12 Colleges Provisioned',
          badge: 'Isolation Verified',
          badgeVariant: 'success',
        },
        {
          title: 'Azure Free-Tier Infrastructure Health',
          type: 'Static Web Apps + Container Apps (gVisor)',
          status: 'All Systems Operational (0% Budget Cost)',
          badge: 'Free Tier Optimized',
          badgeVariant: 'primary',
        },
        {
          title: 'LangChain & Groq Agentic Sourcing',
          type: 'Weekly Cron Scraper (Reddit / GFG)',
          status: 'Next run in 2 days',
          badge: 'Agent Active',
          badgeVariant: 'info',
        },
      ],
    },
  };

  const meta = roleMetadata[user.role] || roleMetadata[USER_ROLES.STUDENT];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 text-left animate-fadeIn">
      {/* Session Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-700/40 text-indigo-400">
            {user.role === USER_ROLES.STUDENT && <GraduationCap className="w-6 h-6" />}
            {user.role === USER_ROLES.TEACHER && <Briefcase className="w-6 h-6 text-purple-400" />}
            {user.role === USER_ROLES.INSTITUTION_ADMIN && <Building className="w-6 h-6 text-cyan-400" />}
            {user.role === USER_ROLES.SUPER_ADMIN && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <Badge variant="primary" dot size="sm">
                {meta.badge}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {user.email} • {user.tenantName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">
            <Lock className="w-3 h-3 text-cyan-400 inline mr-1" />
            {user.authMethod === 'STUDENT_OTP' ? 'Student ID OTP Auth' : 'Microsoft Entra ID (PKCE)'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Role View Header */}
      <div className="space-y-1">
        <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
          {meta.label}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {meta.description}
        </p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {meta.cards.map((card, idx) => (
          <Card key={idx} hover className="bg-slate-900/70 border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start gap-2 mb-1">
                <Badge variant={card.badgeVariant} size="sm">
                  {card.badge}
                </Badge>
              </div>
              <CardTitle className="text-base text-white">{card.title}</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                {card.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-slate-300">
                {card.status}
              </div>
              {card.actionLabel && onStartAssessment && (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={onStartAssessment}
                  leftIcon={<PlayCircle className="w-4 h-4" />}
                >
                  {card.actionLabel}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info notice for Phase 2 */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/40 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Phase 2 Assessment Layouts Ready:</strong> Resizable Split-Screen, MCQ, Simulation Story, SQL Task, and UI Task workspaces are live with plug-and-play slots for Monaco Editor & Redux state.
          </span>
        </div>
        <div className="flex items-center gap-2">
          {user.role === USER_ROLES.STUDENT && onStartAssessment && (
            <Button
              variant="primary"
              size="sm"
              onClick={onStartAssessment}
              leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
            >
              Launch Assessment Engine
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onLogout}>
            Return to Login Experience
          </Button>
        </div>
      </div>
    </div>
  );
}
