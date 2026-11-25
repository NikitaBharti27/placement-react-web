import { Button } from '../../../components/ui/Button';
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Flag,
  Send,
} from 'lucide-react';

/**
 * AssessmentFooterBar - Sticky bottom navigation and review action bar.
 */
export function AssessmentFooterBar({
  currentIndex,
  totalQuestions,
  isFlagged,
  onToggleFlag,
  onClearResponse,
  onPrevious,
  onNext,
  onOpenSubmitModal,
}) {
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= totalQuestions - 1;

  return (
    <footer className="shrink-0 w-full border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Flag & Reset Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={isFlagged ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleFlag}
            className={
              isFlagged
                ? 'border-amber-500/60 bg-amber-950/40 text-amber-300 hover:bg-amber-950/60'
                : ''
            }
            leftIcon={
              <Flag
                className={
                  isFlagged ? 'w-3.5 h-3.5 text-amber-400 fill-amber-400/30' : 'w-3.5 h-3.5'
                }
              />
            }
          >
            {isFlagged ? 'Marked for Review' : 'Mark for Review'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearResponse}
            leftIcon={<Eraser className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Clear / Reset</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isFirst}
            onClick={onPrevious}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {isLast ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenSubmitModal}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Review & Submit
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Save & Next
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
