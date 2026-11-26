import {
  ShieldCheck,
  AlertTriangle,
  Play,
  GraduationCap,
  Award,
  Sparkles,
  Scale,
} from 'lucide-react'
import { getGameMeta } from '../../config/companyGamifiedCriteria'

/**
 * Detailed Placement Criteria & Stage Breakdown Panel for the selected company.
 * Lets students inspect eligibility rules, scoring weights, penalty policies,
 * and launch either a Ranked Multi-Stage Round or single-game Practice mode.
 */
export const CriteriaDetailsPanel = ({
  company,
  bestScore,
  onStartRanked,
  onStartPractice,
}) => {
  if (!company) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${company.theme.badgeBg}`}
            >
              {company.companyName} Placement Criteria
            </span>
            <span className="text-xs font-medium text-slate-500">{company.trackName}</span>
            {bestScore && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  bestScore.qualified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                Best Attempt: {bestScore.finalScore}% ({bestScore.tierVerdict})
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {company.companyName} — {company.roleTarget}
          </h2>
          <p className="text-xs text-slate-500">
            {company.eligibility.branches} • {company.eligibility.academicHistory}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStartRanked(company.id)}
          className={`px-5 py-2.5 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md transition active:scale-95 shrink-0 cursor-pointer ${company.theme.button}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Launch Full Ranked {company.companyName} Round</span>
        </button>
      </div>

      {/* Body Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Placement Criteria & Weights */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Campus Eligibility &amp; Cutoff</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Academic Criteria</span>
                <span className="font-semibold text-slate-900">{company.eligibility.minCgpa}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Backlog Policy</span>
                <span className="font-semibold text-slate-900">
                  {company.eligibility.backlogsPolicy}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Passing Cutoff</span>
                <span className="font-bold text-indigo-700">
                  {company.criteria.passingCutoff}% Composite
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Package Band</span>
                <span className="font-semibold text-emerald-700">{company.packageBand}</span>
              </div>
            </div>

            {company.criteria.tiers && (
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cadre Shortlisting Tiers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {company.criteria.tiers.map((t) => (
                    <span
                      key={t.label}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                    >
                      {t.label}: ≥ {t.minScore}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scoring Weightage */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Evaluation Weightage Matrix</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Accuracy &amp; Correctness</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {company.criteria.weights.accuracy}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${company.criteria.weights.accuracy}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Response &amp; Completion Speed</span>
                  <span className="font-mono font-bold text-cyan-700">
                    {company.criteria.weights.speed}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${company.criteria.weights.speed}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700">Move &amp; Attempt Efficiency</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {company.criteria.weights.efficiency}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${company.criteria.weights.efficiency}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Penalty Rule & Hiring Pattern Highlights */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Penalty Criterion:</span>
              <span>{company.criteria.penaltyRule.label}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recruiter Pattern Notes:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed">
              {company.criteria.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 7 Cols: Stage-by-Stage Cognitive Rounds */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Configured Cognitive Stages ({company.rounds.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Practice individually or take the full ranked sequence
            </span>
          </div>

          <div className="space-y-3">
            {company.rounds.map((round) => {
              const meta = getGameMeta(round.gameType)
              return (
                <div
                  key={round.stageNumber}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold">
                          Stage {round.stageNumber}
                        </span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          Weight: {round.weight}%
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {meta.topicTag}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">{round.title}</h4>
                      <p className="text-xs text-slate-500">{round.subtitle}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartPractice(company.id, round.gameType)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Practice Stage</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    {round.instructions}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
                    {round.config.gridSize && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded">
                        Grid: {round.config.gridSize}×{round.config.gridSize}
                      </span>
                    )}
                    {round.config.totalQuestions && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded">
                        Questions: {round.config.totalQuestions} ({round.config.secondsPerQuestion}s
                        each)
                      </span>
                    )}
                    {round.config.totalLevels && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded">
                        Adaptive Levels: {round.config.totalLevels}
                      </span>
                    )}
                    {round.config.totalRounds && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded">
                        Matrices: {round.config.totalRounds} ({round.config.previewDurationMs}ms
                        preview)
                      </span>
                    )}
                    {round.config.timeLimitSeconds && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded">
                        Clock: {round.config.timeLimitSeconds}s
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CriteriaDetailsPanel
