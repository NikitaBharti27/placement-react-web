import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { CheckCircle2, Flag, HelpCircle, Send } from 'lucide-react';

/**
 * SubmitConfirmModal - Pre-submission summary dialog showing answered,
 * flagged, and unanswered counts before dispatching to the async submission queue.
 */
export function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting = false,
  summaryStats,
  assessmentTitle,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Assessment Submission"
      description={assessmentTitle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-left">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
            <div className="text-lg font-bold font-mono text-white">
              {summaryStats.answered}
            </div>
            <div className="text-[11px] text-slate-400">Answered</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-center space-y-1">
            <Flag className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="text-lg font-bold font-mono text-white">
              {summaryStats.flagged}
            </div>
            <div className="text-[11px] text-slate-400">Flagged</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <HelpCircle className="w-4 h-4 text-slate-400 mx-auto" />
            <div className="text-lg font-bold font-mono text-white">
              {summaryStats.unanswered}
            </div>
            <div className="text-[11px] text-slate-400">Remaining</div>
          </div>
        </div>

        {summaryStats.unanswered > 0 ? (
          <Alert variant="warning" title="Unanswered Questions Detected">
            You still have {summaryStats.unanswered} unattempted question(s). Once
            submitted, responses are locked and queued for server evaluation.
          </Alert>
        ) : (
          <Alert variant="success" title="All Questions Attempted">
            Every question in this assessment has a saved response. Ready to queue for
            isolated sandbox evaluation.
          </Alert>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Continue Exam
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={onConfirmSubmit}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Confirm & Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
