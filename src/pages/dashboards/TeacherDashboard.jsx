import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { ROUTES } from '../../routes/paths'
import {
  FileCheck,
  Eye,
  BarChart3,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export const TeacherDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [draftStatus, setDraftStatus] = useState('pending') // 'pending' | 'approved' | 'rejected'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-2">
            Faculty &amp; Proctoring Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-sm text-indigo-100 mt-1">
            {user?.department} • {user?.tenantName}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
            <div className="text-xl font-bold text-white">48</div>
            <div className="text-[11px] text-indigo-200 uppercase tracking-wider font-semibold">
              Live Candidates
            </div>
          </div>
          <div className="px-4 py-2.5 bg-amber-400/20 backdrop-blur-md rounded-xl border border-amber-300/30 text-center">
            <div className="text-xl font-bold text-amber-200">
              {draftStatus === 'pending' ? 3 : 2}
            </div>
            <div className="text-[11px] text-amber-200 uppercase tracking-wider font-semibold">
              AI Drafts Pending
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Human-in-the-Loop AI Draft Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">AI Draft Review</h2>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {draftStatus === 'pending' ? '3 Pending' : '2 Pending'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The Agentic AI Researcher scanned Reddit and GeeksforGeeks to synthesize new MNC hiring
            patterns. Review and approve before tests go live to students.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-800">
              Accenture 2024: Grid Memory Game Spec
            </div>
            <div className="flex items-center text-[11px] text-indigo-600 gap-1 truncate">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">Source: reddit.com/r/cscareerquestions/comments/...</span>
            </div>

            {draftStatus === 'pending' ? (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDraftStatus('approved')}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDraftStatus('rejected')}
                  className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            ) : (
              <div
                className={`p-2 rounded-lg font-semibold flex items-center justify-between ${
                  draftStatus === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {draftStatus === 'approved' ? 'Published to Cohort' : 'Draft Archived'}
                </span>
                <button
                  type="button"
                  onClick={() => setDraftStatus('pending')}
                  className="text-[11px] underline cursor-pointer"
                >
                  Undo
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.TEACHER.AI_DRAFTS)}
            className="w-full py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
          >
            Open Draft Review Console &rarr;
          </button>
        </div>

        {/* Pillar 2: Live Proctoring & Anti-Cheat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Live Proctor Feed</h2>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Socket.io
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Silent real-time alerts pushed from candidates&apos; browser events (tab-switch,
            copy-paste, window blur). Treated as advisory evidence.
          </p>

          <div className="space-y-2">
            <div className="p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl text-xs flex items-center justify-between text-rose-900">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="font-semibold">Student: STU-2024-8891</div>
                  <div className="text-[11px] text-rose-700">Tab-switch event detected (3s)</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-rose-500">Just now</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.TEACHER.PROCTORING)}
            className="w-full py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
          >
            Open Live Proctoring Monitor &rarr;
          </button>
        </div>

        {/* Pillar 3: Granular Analytics Heatmap */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Granular Heatmap</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Class of 2025</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Goes beyond a final score (e.g. 60%). Pinpoints specific sub-topics where students
            repeatedly fail across mock tests.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-red-50 text-red-900">
              <span>Graph Traversal (DSA)</span>
              <span className="font-bold text-red-600">76% Failure Rate</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 text-emerald-900">
              <span>Array Manipulation (DSA)</span>
              <span className="font-bold text-emerald-600">92% Pass Rate</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 text-amber-900">
              <span>Spatial Memory Games</span>
              <span className="font-bold text-amber-600">58% Failure Rate</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.TEACHER.ANALYTICS)}
            className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            View Topic Heatmap &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
