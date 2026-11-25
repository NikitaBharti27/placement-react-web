import { useState } from 'react';
import { SplitPane } from '../components/ui/SplitPane';
import { Alert } from '../components/ui/Alert';
import { AssessmentHeader } from '../features/assessment/components/AssessmentHeader';
import { QuestionNavigator } from '../features/assessment/components/QuestionNavigator';
import { AssessmentFooterBar } from '../features/assessment/components/AssessmentFooterBar';
import { McqQuestionLayout } from '../features/assessment/components/McqQuestionLayout';
import { SimulationStoryLayout } from '../features/assessment/components/SimulationStoryLayout';
import { SqlTaskLayout } from '../features/assessment/components/SqlTaskLayout';
import { UiTaskLayout } from '../features/assessment/components/UiTaskLayout';
import { WorkspaceShell } from '../features/assessment/components/WorkspaceShell';
import { SubmitConfirmModal } from '../features/assessment/components/SubmitConfirmModal';
import { AssessmentSubmittedView } from '../features/assessment/components/AssessmentSubmittedView';
import { useAssessmentWorkspace } from '../features/assessment/hooks/useAssessmentWorkspace';
import {
  QUESTION_TYPE_META,
  QUESTION_TYPES,
} from '../features/assessment/types/assessmentTypes';

/**
 * AssessmentLayout - Top-level distraction-free Phase 2 assessment shell.
 *
 * Accepts optional `workspace` override (e.g. Nikita's Redux adapter),
 * `renderEditor` (for `@monaco-editor/react`), and `timerSlot` (for server-synced countdown).
 */
export function AssessmentLayout({
  initialAssessment,
  workspace: externalWorkspace,
  renderEditor,
  timerSlot,
  onExitAssessment,
}) {
  const internalWorkspace = useAssessmentWorkspace(initialAssessment);
  const ws = externalWorkspace || internalWorkspace;
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  if (ws.submissionReceipt) {
    return (
      <AssessmentSubmittedView
        receipt={ws.submissionReceipt}
        onReturnDashboard={onExitAssessment}
        onRestartPreview={ws.resetPreviewSession}
      />
    );
  }

  const activeQuestion = ws.activeQuestion;
  const activeTypeMeta =
    QUESTION_TYPE_META[activeQuestion?.type] || { workspaceLabel: 'Workspace' };

  const renderLeftPaneForWorkspace = () => {
    if (!activeQuestion) return null;

    if (activeQuestion.type === QUESTION_TYPES.SIMULATION) {
      return (
        <SimulationStoryLayout
          question={activeQuestion}
          questionNumber={ws.currentIndex + 1}
          totalQuestions={ws.questions.length}
        />
      );
    }

    if (activeQuestion.type === QUESTION_TYPES.SQL_TASK) {
      return (
        <SqlTaskLayout
          question={activeQuestion}
          questionNumber={ws.currentIndex + 1}
          totalQuestions={ws.questions.length}
        />
      );
    }

    if (activeQuestion.type === QUESTION_TYPES.UI_TASK) {
      return (
        <UiTaskLayout
          question={activeQuestion}
          questionNumber={ws.currentIndex + 1}
          totalQuestions={ws.questions.length}
          currentCode={ws.activeAnswer?.code || ''}
          runResult={ws.runResult}
        />
      );
    }

    return null;
  };

  const renderActiveQuestionBody = () => {
    if (!activeQuestion) return null;

    if (activeQuestion.type === QUESTION_TYPES.MCQ) {
      return (
        <McqQuestionLayout
          question={activeQuestion}
          questionNumber={ws.currentIndex + 1}
          totalQuestions={ws.questions.length}
          selectedOptionIds={ws.activeAnswer?.selectedOptionIds || []}
          onToggleOption={ws.toggleMcqOption}
        />
      );
    }

    if (
      activeQuestion.type === QUESTION_TYPES.SIMULATION ||
      activeQuestion.type === QUESTION_TYPES.SQL_TASK ||
      activeQuestion.type === QUESTION_TYPES.UI_TASK
    ) {
      return (
        <SplitPane
          left={renderLeftPaneForWorkspace()}
          right={
            <WorkspaceShell
              question={activeQuestion}
              answer={ws.activeAnswer}
              pipelineState={ws.pipelineState}
              runResult={ws.runResult}
              onChangeCode={ws.updateWorkspaceCode}
              onChangeLanguage={(qId, lang) => ws.updateWorkspaceCode(qId, undefined, lang)}
              onResetCode={ws.resetStarterCode}
              onRunCheck={ws.runSampleCheck}
              renderEditor={renderEditor}
            />
          }
          leftLabel="Problem Brief"
          rightLabel={activeTypeMeta.workspaceLabel}
          defaultLeftPercent={44}
        />
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Alert variant="info" title="Phase 3 Format Slot (Gamified Cognitive)">
            Gamified cognitive round rendering (Grid Memory / Path-finding) is scheduled
            for Phase 3.
          </Alert>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0A0D14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <AssessmentHeader
        title={ws.assessment.title}
        companyTrack={ws.assessment.companyTrack}
        answeredCount={ws.summaryStats.answered}
        totalQuestions={ws.questions.length}
        remainingSeconds={ws.remainingSeconds}
        timerSlot={timerSlot}
        isNavigatorOpen={isNavigatorOpen}
        onToggleNavigator={() => setIsNavigatorOpen((prev) => !prev)}
        onOpenSubmitModal={() => ws.setIsSubmitModalOpen(true)}
        onExitAssessment={onExitAssessment}
      />

      {/* Main Split-Screen Workspace + Optional Collapsible Question Palette */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
          {renderActiveQuestionBody()}
        </main>

        <QuestionNavigator
          isOpen={isNavigatorOpen}
          onClose={() => setIsNavigatorOpen(false)}
          questions={ws.questions}
          currentIndex={ws.currentIndex}
          getQuestionStatus={ws.getQuestionStatus}
          summaryStats={ws.summaryStats}
          onSelectQuestion={(idx) => ws.selectQuestion(idx)}
        />
      </div>

      <AssessmentFooterBar
        currentIndex={ws.currentIndex}
        totalQuestions={ws.questions.length}
        isFlagged={ws.isCurrentFlagged}
        onToggleFlag={() => ws.toggleFlagQuestion(activeQuestion.id)}
        onClearResponse={() => ws.clearQuestionResponse(activeQuestion.id)}
        onPrevious={ws.goPrevious}
        onNext={ws.goNext}
        onOpenSubmitModal={() => ws.setIsSubmitModalOpen(true)}
      />

      <SubmitConfirmModal
        isOpen={ws.isSubmitModalOpen}
        onClose={() => ws.setIsSubmitModalOpen(false)}
        onConfirmSubmit={ws.submitAssessment}
        isSubmitting={ws.isSubmitting}
        summaryStats={ws.summaryStats}
        assessmentTitle={ws.assessment.title}
      />
    </div>
  );
}
