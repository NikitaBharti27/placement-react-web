import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assessmentApi } from '../../api/assessmentApi'
import { getSubmittedReceipts } from '../../features/exam/examSlice'
import {
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Database,
  Layout,
  HelpCircle,
  Gamepad2,
} from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const FORMAT_META = {
  MCQ: {
    label: 'MCQ Aptitude',
    icon: HelpCircle,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  SIMULATION: {
    label: 'Docker Coding Sandbox',
    icon: Code2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  SQL_TASK: {
    label: 'SQL Database Queries',
    icon: Database,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  UI_TASK: {
    label: 'Interactive UI Tasks',
    icon: Layout,
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  GAMIFIED: {
    label: 'Gamified Cognitive',
    icon: Gamepad2,
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}

/**
 * Assessment Catalog & Selection Page
 */
export const AssessmentsListPage = () => {
  const [assessments, setAssessments] = useState([])
  const [receipts, setReceipts] = useState({})
  const [formatFilter, setFormatFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await assessmentApi.getAssessments()
        setAssessments(list)
        setReceipts(getSubmittedReceipts())
      } catch (err) {
        console.error('Failed to load assessments catalog', err)
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [])

  const handleStartExam = (assessmentId) => {
    navigate(`/student/assessment/${assessmentId}`)
  }

  const filteredAssessments =
    formatFilter === 'ALL'
      ? assessments
      : assessments.filter((a) => a.questionTypes?.includes(formatFilter))

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phase 2 Evaluation Engine • Server-Authoritative</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Assigned Technical &amp; Placement Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-format assessment environment featuring VS Code Monaco Editor, isolated Docker
            sandboxing, interactive database queries, and live UI testing. All timers are synchronized
            with backend clocks.
          </p>
        </div>
      </div>

      {/* Format Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold mr-1">Filter by format:</span>
        {['ALL', 'MCQ', 'SIMULATION', 'SQL_TASK', 'UI_TASK', 'GAMIFIED'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFormatFilter(key)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition cursor-pointer ${
              formatFilter === key
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {key === 'ALL' ? 'All Tracks' : FORMAT_META[key]?.label || key}
          </button>
        ))}
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssessments.map((item) => {
          const submittedReceipt = receipts[item.id]
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.companyTrack}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.durationMinutes} Minutes</span>
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h2>

                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.questionsCount} Questions</span>
                  </span>
                  <span>•</span>
                  <span>Total Marks: {item.totalMarks}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Included Evaluation Formats:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.questionTypes?.map((type) => {
                      const meta = FORMAT_META[type]
                      if (!meta) return null
                      const Icon = meta.icon
                      return (
                        <span
                          key={type}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.className}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{meta.label}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {submittedReceipt ? (
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-mono truncate max-w-[190px]">
                      Queued: {submittedReceipt.jobId}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready to Launch</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleStartExam(item.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <span>{submittedReceipt ? 'Retake Assessment' : 'Launch Assessment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AssessmentsListPage
