import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Gamepad2,
  ShieldCheck,
  Eye,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Search,
  Activity,
} from 'lucide-react'
import {
  COMPANY_GAMIFIED_PROFILES,
  COGNITIVE_GAMES_META,
  getGameMeta,
} from '../../config/companyGamifiedCriteria'
import { useGamifiedSession, useGamifiedProctor } from '../../features/gamified/gamifiedHooks'
import CompanyCriteriaCard from '../../components/gamified/CompanyCriteriaCard'
import CriteriaDetailsPanel from '../../components/gamified/CriteriaDetailsPanel'
import AntiCheatConsentModal from '../../components/gamified/AntiCheatConsentModal'
import GamifiedScorecardModal from '../../components/gamified/GamifiedScorecardModal'
import GamifiedGameHost from '../../components/gamified/games/GamifiedGameHost'
import LoadingSpinner from '../../components/common/LoadingSpinner'

/**
 * Company-Specific Gamified Cognitive Rounds Hub & Arena
 *
 * Integrated from Ayan Capstone's cognitive games and elevated to PlacePrep Secure's
 * Phase 3 specifications: company-specific placement criteria, mandatory consent modal,
 * real-time browser proctoring alerts, and server-side anti-tamper score verification.
 */
export const GamifiedRoundsPage = () => {
  const { companyId: urlCompanyId } = useParams()
  const navigate = useNavigate()

  const {
    selectedCompanyId,
    selectedCompany,
    sessionCompany,
    session,
    rawEvents,
    proctoringAlerts,
    bestScoresByCompany,
    submission,
    selectCompany,
    requestRankedStart,
    acceptConsentAndStart,
    launchPracticeRound,
    recordRawEvent,
    completeStage,
    nextStage,
    recordProctorAlert,
    submitRankedRound,
    exitSession,
  } = useGamifiedSession()

  const [searchTerm, setSearchTerm] = useState('')
  const [practiceLastResult, setPracticeLastResult] = useState(null)
  const [activePracticeType, setActivePracticeType] = useState(null)

  // Sync URL param if navigated directly to /student/cognitive-games/:companyId
  useEffect(() => {
    if (urlCompanyId && urlCompanyId !== selectedCompanyId) {
      const matched = COMPANY_GAMIFIED_PROFILES.find((c) => c.id === urlCompanyId)
      if (matched) {
        selectCompany(matched.id)
      }
    }
  }, [urlCompanyId, selectedCompanyId, selectCompany])

  // Activate advisory browser proctoring during ranked company rounds
  useGamifiedProctor({
    enabled: session.mode === 'ranked',
    onAlert: recordProctorAlert,
  })

  const filteredCompanies = COMPANY_GAMIFIED_PROFILES.filter((c) => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    return (
      c.companyName.toLowerCase().includes(q) ||
      c.roleTarget.toLowerCase().includes(q) ||
      c.trackName.toLowerCase().includes(q) ||
      c.rounds.some((r) => getGameMeta(r.gameType).title.toLowerCase().includes(q))
    )
  })

  const isPlaying = session.mode === 'ranked' || session.mode === 'practice'

  const handleSelectCompany = (id) => {
    selectCompany(id)
    navigate(`/student/cognitive-games/${id}`, { replace: true })
  }

  const handleStartPractice = (companyId, gameType) => {
    setPracticeLastResult(null)
    setActivePracticeType(gameType)
    launchPracticeRound(companyId, gameType)
  }

  const handleStageComplete = async (outcome) => {
    if (session.mode === 'practice') {
      setPracticeLastResult(outcome)
      return
    }

    completeStage(outcome)

    const isLastStage = session.currentStageIndex + 1 >= sessionCompany.rounds.length
    if (!isLastStage) {
      nextStage()
      return
    }

    // Build authoritative array including just-completed final stage
    const updatedResults = [...session.stageResults.filter((r) => r.stageNumber !== outcome.stageNumber), outcome]
    await submitRankedRound({
      companyId: sessionCompany.id,
      stageResultsOverride: updatedResults,
    })
  }

  // Active Arena View (Ranked Multi-Stage or Free Practice)
  if (isPlaying) {
    const activeStage =
      session.mode === 'ranked'
        ? sessionCompany.rounds[session.currentStageIndex]
        : sessionCompany.rounds.find((r) => r.gameType === activePracticeType) || {
            stageNumber: 1,
            gameType: activePracticeType,
            title: getGameMeta(activePracticeType).title,
            subtitle: getGameMeta(activePracticeType).subtitle,
            weight: 100,
            config: { allowSizeSwitch: true },
            instructions: getGameMeta(activePracticeType).description,
          }

    const activeMeta = getGameMeta(activeStage.gameType)

    return (
      <div className="space-y-5">
        {/* Arena Top Control Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPracticeLastResult(null)
                exitSession()
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Exit to Company Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                  {sessionCompany.companyName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                  {session.mode === 'ranked'
                    ? `Ranked Stage ${session.currentStageIndex + 1} of ${sessionCompany.rounds.length}`
                    : 'Practice Sandbox'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Cutoff: {sessionCompany.criteria.passingCutoff}%
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                {activeStage.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{rawEvents.length} Events</span>
            </div>

            {session.mode === 'ranked' && (
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold ${
                  proctoringAlerts.length > 0
                    ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                    : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  Proctor: {proctoringAlerts.length === 0 ? 'Clear' : `${proctoringAlerts.length} Alert(s)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ranked Stage Pipeline Progress Pills */}
        {session.mode === 'ranked' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sessionCompany.rounds.map((r, idx) => {
              const completed = session.stageResults.find((sr) => sr.stageNumber === r.stageNumber)
              const isCurrent = idx === session.currentStageIndex
              return (
                <div
                  key={r.stageNumber}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-500/30'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold truncate">
                      Stage {r.stageNumber}: {getGameMeta(r.gameType).shortTitle}
                    </div>
                    <div className="text-[11px] opacity-80">Weight: {r.weight}%</div>
                  </div>
                  {completed ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[11px]">
                      {completed.accuracy}%
                    </span>
                  ) : isCurrent ? (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-semibold text-[10px]">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono">Pending</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Submitting Overlay */}
        {submission.isSubmitting ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-semibold text-slate-800">
              Validating {rawEvents.length} raw events against {sessionCompany.companyName} placement criteria...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Criteria & Instructions Sidebar */}
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                    {activeMeta.topicTag}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Stage Weight: {activeStage.weight}%
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">Round Objective</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {activeStage.instructions}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-800">
                    {sessionCompany.companyName} Criteria Rules:
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    • Cutoff Benchmark: <strong>{sessionCompany.criteria.passingCutoff}%</strong>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    • Penalty Policy: {sessionCompany.criteria.penaltyRule.label}
                  </div>
                </div>

                {proctoringAlerts.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Recent Advisory Proctor Log</span>
                    </div>
                    <p className="text-[11px]">{proctoringAlerts[0].detail}</p>
                  </div>
                )}

                {practiceLastResult && session.mode === 'practice' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Practice Score Recorded: {practiceLastResult.score}%</span>
                    </div>
                    <p className="text-[11px]">{practiceLastResult.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Interactive Cognitive Game Arena */}
            <div className="xl:col-span-8">
              <GamifiedGameHost
                gameType={activeStage.gameType}
                config={activeStage.config}
                stageNumber={activeStage.stageNumber}
                mode={session.mode}
                onRawEvent={recordRawEvent}
                onComplete={handleStageComplete}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Hub View (Company Tracks, Criteria Inspector, Free Practice Quick Launcher)
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Phase 3 Cognitive Arena • Company Placement Criteria Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Company-Specific Gamified Cognitive Rounds
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Practice and take ranked cognitive rounds tailored to each MNC&apos;s exact hiring
              criteria — eligibility cutoffs, adaptive grid scaling, penalty rules, and server-side
              anti-tamper click recalculation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-center">
              <div className="text-xl font-bold text-white">5 MNCs</div>
              <div className="text-[10px] text-cyan-200 uppercase tracking-wider font-semibold">
                Criteria Tracks
              </div>
            </div>
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-center">
              <div className="text-xl font-bold text-emerald-300">4 Games</div>
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">
                Anti-Tamper Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Select Company Placement Track
          </h2>
          <p className="text-xs text-slate-500">
            Click a company card to inspect its placement criteria or launch its ranked gamified round.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter company or game..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => (
          <CompanyCriteriaCard
            key={company.id}
            company={company}
            isSelected={selectedCompany.id === company.id}
            bestScore={bestScoresByCompany[company.id]}
            onSelect={handleSelectCompany}
            onStartRanked={requestRankedStart}
          />
        ))}
      </div>

      {/* Selected Company Placement Criteria Inspector */}
      <CriteriaDetailsPanel
        company={selectedCompany}
        bestScore={bestScoresByCompany[selectedCompany.id]}
        onStartRanked={requestRankedStart}
        onStartPractice={handleStartPractice}
      />

      {/* Quick Direct Sandbox Row for all 4 Games */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Cognitive Skill Sandbox (All 4 Modules)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Jump directly into any cognitive module in free practice mode using{' '}
              <strong>{selectedCompany.companyName}</strong> calibration.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Raw Click Telemetry Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(COGNITIVE_GAMES_META).map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => handleStartPractice(selectedCompany.id, game.id)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 text-left transition space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                  {game.title}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  Practice
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{game.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Anti-Cheat Consent Modal */}
      <AntiCheatConsentModal
        isOpen={session.mode === 'consent'}
        company={sessionCompany}
        onClose={exitSession}
        onAccept={(companyId) => {
          setPracticeLastResult(null)
          acceptConsentAndStart(companyId)
        }}
      />

      {/* Server-Verified Scorecard Modal */}
      <GamifiedScorecardModal
        isOpen={session.mode === 'completed' && Boolean(submission.result)}
        verificationResult={submission.result}
        rawEvents={rawEvents}
        proctoringAlerts={proctoringAlerts}
        isSubmitting={submission.isSubmitting}
        onSimulateTamperCheck={() =>
          submitRankedRound({
            companyId: sessionCompany.id,
            claimedScore: 100,
          })
        }
        onClose={exitSession}
        onRetry={() => requestRankedStart(sessionCompany.id)}
      />
    </div>
  )
}

export default GamifiedRoundsPage
