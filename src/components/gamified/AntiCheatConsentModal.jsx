import { useState } from 'react'
import { ShieldCheck, Eye, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import Modal from '../ui/Modal'

/**
 * Mandatory Pre-Round Anti-Cheat & Fair Play Consent Modal.
 * Aligns with Phase 3 & Phase 5 Capstone specifications before starting ranked gamified tests.
 */
export const AntiCheatConsentModal = ({
  isOpen,
  company,
  onClose,
  onAccept,
}) => {
  const [agreed, setAgreed] = useState(false)

  if (!company) return null

  const handleConfirm = () => {
    if (!agreed) return
    setAgreed(false)
    onAccept(company.id)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setAgreed(false)
        onClose()
      }}
      title={`${company.companyName} Ranked Assessment Consent`}
      description={`Zero-Trust Proctoring & Anti-Tamper Disclosure • ${company.trackName}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-indigo-800">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Placement Criteria Snapshot</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <span>
              Cutoff Target: <strong>{company.criteria.passingCutoff}%</strong>
            </span>
            <span>
              Stages: <strong>{company.rounds.length} Cognitive Games</strong>
            </span>
            <span>
              Duration: <strong>{company.criteria.totalDurationMinutes} Minutes</strong>
            </span>
            <span>
              Penalty: <strong>-{company.criteria.penaltyRule.penaltyPerMistake} pts/mistake</strong>
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Eye className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Advisory Browser Proctoring</strong>
              <span>
                Switching tabs, minimizing the window, or triggering copy/paste events emits
                advisory alerts logged for faculty review.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">
                Server-Side Raw Event Score Recalculation
              </strong>
              <span>
                The browser records raw timestamped click and move events. Final scores are
                recalculated server-side; forged payloads are rejected automatically.
              </span>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>
            I acknowledge the {company.companyName} placement criteria and consent to real-time
            proctoring telemetry and raw interaction verification.
          </span>
        </label>

        {!agreed && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Please accept the consent terms to unlock the ranked cognitive round.</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setAgreed(false)
              onClose()
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>Agree &amp; Begin Round</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AntiCheatConsentModal
