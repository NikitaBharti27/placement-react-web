import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ArrowLeft, CheckCircle2, RotateCcw, Server } from 'lucide-react';

/**
 * AssessmentSubmittedView - Phase 2 submission receipt showing queued
 * async processing metadata without leaking Phase 3/4 scoring/remediation features.
 */
export function AssessmentSubmittedView({
  receipt,
  onReturnDashboard,
  onRestartPreview,
}) {
  if (!receipt) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0A0D14] bg-radial-glow bg-grid-pattern">
      <Card glow className="w-full max-w-xl bg-slate-900/90 border-slate-800">
        <CardHeader className="text-center items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <Badge variant="success" dot size="sm">
              Queued in Upstash QStash
            </Badge>
            <CardTitle className="text-xl sm:text-2xl text-white">
              Assessment Submitted Successfully
            </CardTitle>
            <CardDescription>{receipt.assessmentTitle}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 text-left">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Submission Receipt ID:</span>
              <span className="text-indigo-300 font-semibold">{receipt.submissionId}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Async Queue Message ID:</span>
              <span className="text-cyan-300">{receipt.qstashMessageId}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Questions Answered:</span>
              <span className="text-emerald-300">
                {receipt.stats.answered} / {receipt.stats.total}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-400">Pipeline State:</span>
              <span className="text-amber-300">{receipt.pipelineStatus}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-2.5 text-xs text-slate-300">
            <Server className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your multi-format answers have been persisted via idempotent submission API
              and dispatched asynchronously to the execution worker queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRestartPreview}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retake Preview
            </Button>
            {onReturnDashboard && (
              <Button
                variant="primary"
                size="sm"
                onClick={onReturnDashboard}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Student Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
