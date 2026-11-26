import { Clock, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import { getGameMeta } from '../../config/companyGamifiedCriteria'

/**
 * Displays a company placement track card with eligibility criteria,
 * cutoff benchmark, included cognitive rounds, and candidate best score.
 */
export const CompanyCriteriaCard = ({
  company,
  isSelected,
  bestScore,
  onSelect,
  onStartRanked,
}) => {
  return (
    <div
      onClick={() => onSelect(company.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(company.id)
        }
      }}
      className={`bg-white rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer text-left ${
        isSelected
          ? `border-indigo-500 ring-2 ring-indigo-500/20 shadow-md`
          : 'border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      <div className="space-y-3">
        {/* Top Row: Company Logo Badge & Cutoff */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shadow-xs ${company.theme.iconBg}`}
            >
              {company.shortCode}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{company.companyName}</h3>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {company.packageBand}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{company.roleTarget}</p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${company.theme.badgeBg}`}
          >
            Cutoff: {company.criteria.passingCutoff}%
          </span>
        </div>

        {/* Eligibility Pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Min Academic
            </span>
            <span className="font-semibold text-slate-800">{company.eligibility.minCgpa}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Backlogs
            </span>
            <span className="font-semibold text-slate-800 truncate block">
              {company.eligibility.backlogsPolicy}
            </span>
          </div>
        </div>

        {/* Included Games */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Cognitive Rounds ({company.rounds.length} Stages)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {company.rounds.map((round) => {
              const meta = getGameMeta(round.gameType)
              return (
                <span
                  key={`${company.id}-${round.stageNumber}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50/70 text-indigo-700 border border-indigo-200/70"
                >
                  <span>{meta.shortTitle}</span>
                  <span className="text-[10px] text-indigo-500 font-mono">({round.weight}%)</span>
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action & Best Score Strip */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {bestScore ? (
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold ${
              bestScore.qualified ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {bestScore.qualified ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Award className="w-3.5 h-3.5" />
            )}
            <span>Best: {bestScore.finalScore}%</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{company.criteria.totalDurationMinutes}m</span>
            <span>•</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px]">Anti-Tamper</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onStartRanked(company.id)
          }}
          className={`px-3.5 py-1.5 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer ${company.theme.button}`}
        >
          <span>Start Round</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default CompanyCriteriaCard
