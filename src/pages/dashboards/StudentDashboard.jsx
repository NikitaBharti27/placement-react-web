import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/authHooks'
import { getSubmittedReceipts } from '../../features/exam/examSlice'
import { ROUTES } from '../../routes/paths'
import {
  GraduationCap,
  Sparkles,
  Gamepad2,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const receipts = getSubmittedReceipts()
  const tcsReceipt = receipts['tcs-nqt-tech-01']
  const accReceipt = receipts['accenture-gamified-mock']

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-sm mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              <span>Student Candidate Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              Registration ID:{' '}
              <span className="font-mono font-semibold text-white">
                {user?.studentId || 'STU-2024-8891'}
              </span>{' '}
              • {user?.department || 'Computer Science & Engineering'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
              <div className="text-xl font-bold text-white">78%</div>
              <div className="text-[11px] text-cyan-200 uppercase tracking-wider font-semibold">
                Placement Index
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Proctoring Status Pill */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold">Secure Proctoring Environment:</span>
          <span>Zero-Trust Tab &amp; Copy-Paste Detection Ready (Phase 1 &amp; 2 Validated)</span>
        </div>
        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
          Active Session
        </span>
      </div>

      {/* Grid: Assigned Tests & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Assigned Assessments</h2>
            <button
              type="button"
              onClick={() => navigate(ROUTES.STUDENT.ASSESSMENTS)}
              className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              View All Tracks &rarr;
            </button>
          </div>

          {/* Card 1: TCS NQT Full Simulation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  TCS
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    TCS NQT 2024 Prep Track — Technical Simulation
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> 90 Mins
                    </span>
                    <span>• 2 MCQs + 1 Coding Sandbox + 1 SQL + 1 UI Task</span>
                  </div>
                </div>
              </div>
              {tcsReceipt ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold inline-flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submitted
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold shrink-0">
                  Due in 2 days
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono">
                {tcsReceipt
                  ? `Async Queue Receipt: ${tcsReceipt.jobId}`
                  : 'Server-authoritative timer & Monaco sandbox enabled'}
              </span>
              <button
                type="button"
                onClick={() => navigate('/student/assessment/tcs-nqt-tech-01')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <span>{tcsReceipt ? 'Retake Exam' : 'Start Exam'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Accenture Gamified Cognitive Round */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Accenture Cognitive Assessment (Grid Memory &amp; Path-Finding)
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> 60 Mins
                    </span>
                    <span>• 1 MCQ + 1 Coding Sandbox + 2 Cognitive Stages</span>
                  </div>
                </div>
              </div>
              {accReceipt ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold inline-flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submitted
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold shrink-0">
                  Available Now
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono">
                {accReceipt
                  ? `Async Queue Receipt: ${accReceipt.jobId}`
                  : 'Anti-tamper click verification enabled'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.STUDENT.GAMES)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-medium transition cursor-pointer"
                >
                  All 5 MNC Tracks
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/student/assessment/accenture-gamified-mock')}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <span>{accReceipt ? 'Retake Round' : 'Launch Round'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Study Plan & Weakness Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Study Plan</span>
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              <strong>LLaMA 3 Diagnostic Insight:</strong> You scored 85% in Arrays and Recursion,
              but your mastery in <strong>Graphs &amp; Spatial Memory</strong> is under 50%.
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Graph Traversal (BFS/DFS)</span>
                  <span className="text-red-600 font-semibold">38% Mastery</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[38%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Spatial Memory (Grid Challenge)</span>
                  <span className="text-amber-600 font-semibold">45% Mastery</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Dynamic Programming</span>
                  <span className="text-emerald-600 font-semibold">82% Mastery</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(ROUTES.STUDENT.GAMES)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Practice Weak Sub-Topics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
