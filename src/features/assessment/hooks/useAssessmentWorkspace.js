import { useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_ASSESSMENT } from '../data/mockAssessmentData';
import {
  QUESTION_STATUS,
  QUESTION_TYPES,
  SUBMISSION_PIPELINE_STATES,
} from '../types/assessmentTypes';

/**
 * Build initial response map from starter code/queries so every question
 * opens with valid default state.
 */
function buildInitialAnswers(questions) {
  const initial = {};
  for (const q of questions) {
    if (q.type === QUESTION_TYPES.MCQ) {
      initial[q.id] = { selectedOptionIds: [] };
    } else if (q.type === QUESTION_TYPES.SIMULATION) {
      initial[q.id] = {
        language: 'python',
        code: q.starterCode?.python || '',
        codeByLanguage: { ...(q.starterCode || {}) },
      };
    } else if (q.type === QUESTION_TYPES.SQL_TASK) {
      initial[q.id] = {
        language: 'sql',
        code: q.starterQuery || '',
      };
    } else if (q.type === QUESTION_TYPES.UI_TASK) {
      initial[q.id] = {
        language: 'jsx',
        code: q.starterCode || '',
      };
    }
  }
  return initial;
}

/**
 * Determine whether a question currently holds a meaningful user response.
 */
export function hasQuestionResponse(question, answer) {
  if (!question || !answer) return false;
  if (question.type === QUESTION_TYPES.MCQ) {
    return Array.isArray(answer.selectedOptionIds) && answer.selectedOptionIds.length > 0;
  }
  if (question.type === QUESTION_TYPES.SIMULATION) {
    const starter = question.starterCode?.[answer.language] || '';
    return Boolean(answer.code && answer.code.trim().length > 0 && answer.code.trim() !== starter.trim());
  }
  if (question.type === QUESTION_TYPES.SQL_TASK) {
    const starter = question.starterQuery || '';
    return Boolean(answer.code && answer.code.trim().length > 0 && answer.code.trim() !== starter.trim());
  }
  if (question.type === QUESTION_TYPES.UI_TASK) {
    const starter = question.starterCode || '';
    return Boolean(answer.code && answer.code.trim().length > 0 && answer.code.trim() !== starter.trim());
  }
  return false;
}

/**
 * useAssessmentWorkspace - Decoupled state adapter hook for Phase 2.
 *
 * Integration Note for Nikita (Redux + Timer Sync Lead):
 * Replace internal React state in this hook with Redux Toolkit selectors
 * (`state.activeExam`) and RTK Query mutations, or pass `externalCountdownSeconds`
 * directly into `AssessmentLayout` without modifying any child UI components.
 */
export function useAssessmentWorkspace(initialAssessment = MOCK_ASSESSMENT) {
  const [assessment] = useState(initialAssessment);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersByQuestionId, setAnswersByQuestionId] = useState(() =>
    buildInitialAnswers(initialAssessment.questions)
  );
  const [flaggedIds, setFlaggedIds] = useState(() => new Set());
  const [visitedIds, setVisitedIds] = useState(
    () => new Set(initialAssessment.questions[0] ? [initialAssessment.questions[0].id] : [])
  );

  // Simulated server-authoritative remaining seconds
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialAssessment.durationSeconds || 2700
  );

  // Simulated async QStash -> Worker dry-run pipeline state per question
  const [pipelineStateByQuestion, setPipelineStateByQuestion] = useState({});
  const [runResultByQuestion, setRunResultByQuestion] = useState({});

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  const questions = assessment.questions;
  const activeQuestion = questions[currentIndex] || questions[0];

  // Local fallback ticker (Nikita's Phase 2 server timer sync overrides this via props)
  useEffect(() => {
    if (submissionReceipt) return undefined;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [submissionReceipt]);

  const selectQuestion = useCallback(
    (index) => {
      if (index < 0 || index >= questions.length) return;
      const target = questions[index];
      setCurrentIndex(index);
      setVisitedIds((prev) => {
        if (prev.has(target.id)) return prev;
        const next = new Set(prev);
        next.add(target.id);
        return next;
      });
    },
    [questions]
  );

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      selectQuestion(currentIndex + 1);
    }
  }, [currentIndex, questions.length, selectQuestion]);

  const goPrevious = useCallback(() => {
    if (currentIndex > 0) {
      selectQuestion(currentIndex - 1);
    }
  }, [currentIndex, selectQuestion]);

  const toggleMcqOption = useCallback((questionId, optionId, allowMultiple = false) => {
    setAnswersByQuestionId((prev) => {
      const current = prev[questionId]?.selectedOptionIds || [];
      let updated;
      if (allowMultiple) {
        updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      } else {
        updated = current.includes(optionId) && current.length === 1 ? [] : [optionId];
      }
      return {
        ...prev,
        [questionId]: { selectedOptionIds: updated },
      };
    });
  }, []);

  const updateWorkspaceCode = useCallback((questionId, nextCode, nextLanguage) => {
    setAnswersByQuestionId((prev) => {
      const existing = prev[questionId] || {};
      const activeLang = nextLanguage || existing.language || 'python';

      // Switching language preserves prior drafts per language
      if (nextLanguage && nextLanguage !== existing.language && nextCode === undefined) {
        const cachedForLang = existing.codeByLanguage?.[nextLanguage] ?? '';
        return {
          ...prev,
          [questionId]: {
            ...existing,
            language: nextLanguage,
            code: cachedForLang,
          },
        };
      }

      const resolvedCode = nextCode !== undefined ? nextCode : existing.code || '';
      return {
        ...prev,
        [questionId]: {
          ...existing,
          language: activeLang,
          code: resolvedCode,
          codeByLanguage: existing.codeByLanguage
            ? { ...existing.codeByLanguage, [activeLang]: resolvedCode }
            : undefined,
        },
      };
    });
  }, []);

  const resetStarterCode = useCallback(
    (questionId) => {
      const q = questions.find((item) => item.id === questionId);
      if (!q) return;
      setAnswersByQuestionId((prev) => {
        const existing = prev[questionId] || {};
        if (q.type === QUESTION_TYPES.SIMULATION) {
          const lang = existing.language || 'python';
          const starter = q.starterCode?.[lang] || '';
          return {
            ...prev,
            [questionId]: {
              ...existing,
              code: starter,
              codeByLanguage: { ...(existing.codeByLanguage || {}), [lang]: starter },
            },
          };
        }
        if (q.type === QUESTION_TYPES.SQL_TASK) {
          return {
            ...prev,
            [questionId]: { ...existing, code: q.starterQuery || '' },
          };
        }
        if (q.type === QUESTION_TYPES.UI_TASK) {
          return {
            ...prev,
            [questionId]: { ...existing, code: q.starterCode || '' },
          };
        }
        return prev;
      });
    },
    [questions]
  );

  const clearQuestionResponse = useCallback((questionId) => {
    const target = questions.find((q) => q.id === questionId);
    if (!target) return;
    if (target.type === QUESTION_TYPES.MCQ) {
      setAnswersByQuestionId((prev) => ({
        ...prev,
        [questionId]: { selectedOptionIds: [] },
      }));
    } else {
      resetStarterCode(questionId);
    }
  }, [questions, resetStarterCode]);

  const toggleFlagQuestion = useCallback((questionId) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  /**
   * Simulates Phase 2 async dry-run flow:
   * React -> POST /api/submissions/dry-run -> Upstash QStash (QUEUED) -> Worker Sandbox (RUNNING) -> EVALUATED
   */
  const runSampleCheck = useCallback(
    async (questionId) => {
      const q = questions.find((item) => item.id === questionId);
      if (!q) return;

      const currentAnswer = answersByQuestionId[questionId] || {};

      setPipelineStateByQuestion((prev) => ({
        ...prev,
        [questionId]: SUBMISSION_PIPELINE_STATES.QUEUED,
      }));

      await new Promise((r) => setTimeout(r, 450));

      setPipelineStateByQuestion((prev) => ({
        ...prev,
        [questionId]: SUBMISSION_PIPELINE_STATES.RUNNING,
      }));

      await new Promise((r) => setTimeout(r, 650));

      let resultPayload = null;
      if (q.type === QUESTION_TYPES.SIMULATION) {
        const codeText = (currentAnswer.code || '').trim();
        const starter = (q.starterCode?.[currentAnswer.language] || '').trim();
        const isImplemented = Boolean(codeText) && codeText !== starter && !codeText.includes('TODO');
        resultPayload = {
          type: QUESTION_TYPES.SIMULATION,
          passed: isImplemented ? q.sampleCases.length : 0,
          total: q.sampleCases.length,
          runtimeMs: isImplemented ? 42 : 11,
          memoryMb: 18.4,
          stdout: isImplemented
            ? q.sampleCases.map((sc) => `[PASS] ${sc.label}\nOutput: ${sc.output}`).join('\n\n')
            : !codeText
              ? 'Error: Empty source buffer submitted to sandbox.'
              : 'Sample Execution Complete (0/2 Passed): Starter stub returned empty output. Replace TODO logic to evaluate sliding window.',
          cases: q.sampleCases.map((sc) => ({
            id: sc.id,
            label: sc.label,
            passed: isImplemented,
            actualOutput: isImplemented ? sc.output : '(empty)',
            expectedOutput: sc.output,
          })),
        };
      } else if (q.type === QUESTION_TYPES.SQL_TASK) {
        const queryUpper = (currentAnswer.code || '').toUpperCase();
        const looksValidAggregation =
          queryUpper.includes('SELECT') &&
          queryUpper.includes('FROM') &&
          queryUpper.includes('GROUP BY') &&
          queryUpper.includes('HAVING');
        resultPayload = {
          type: QUESTION_TYPES.SQL_TASK,
          passed: looksValidAggregation ? 1 : 0,
          total: 1,
          runtimeMs: 19,
          columns: looksValidAggregation ? q.mockQueryOutput.columns : ['subject', 'topic'],
          rows: looksValidAggregation
            ? q.mockQueryOutput.rows
            : [
                ['DSA', 'Graphs'],
                ['DSA', 'Linked Lists'],
              ],
          stdout: looksValidAggregation
            ? `Query executed successfully against read-replica snapshot (${q.mockQueryOutput.rows.length} rows returned in 19ms).`
            : 'Partial Result: Query ran on read-replica, but missing GROUP BY / HAVING < 60% mastery filter.',
        };
      } else if (q.type === QUESTION_TYPES.UI_TASK) {
        const markup = currentAnswer.code || '';
        const checks = (q.acceptanceCriteria || []).map((ac) => ({
          id: ac.id,
          label: ac.label,
          passed: markup.toLowerCase().includes((ac.keywordMatch || '').toLowerCase()),
        }));
        const passedCount = checks.filter((c) => c.passed).length;
        resultPayload = {
          type: QUESTION_TYPES.UI_TASK,
          passed: passedCount,
          total: checks.length,
          runtimeMs: 12,
          checks,
          stdout: `UI Spec Verification complete: ${passedCount}/${checks.length} acceptance checks matched.`,
        };
      }

      setRunResultByQuestion((prev) => ({
        ...prev,
        [questionId]: resultPayload,
      }));
      setPipelineStateByQuestion((prev) => ({
        ...prev,
        [questionId]: SUBMISSION_PIPELINE_STATES.EVALUATED,
      }));
    },
    [answersByQuestionId, questions]
  );

  const getQuestionStatus = useCallback(
    (question) => {
      const isCurrent = activeQuestion?.id === question.id;
      const isFlagged = flaggedIds.has(question.id);
      const isAnswered =
        question.type === QUESTION_TYPES.MCQ
          ? hasQuestionResponse(question, answersByQuestionId[question.id])
          : hasQuestionResponse(question, answersByQuestionId[question.id]) ||
            pipelineStateByQuestion[question.id] === SUBMISSION_PIPELINE_STATES.EVALUATED;

      if (isCurrent) return QUESTION_STATUS.CURRENT;
      if (isAnswered && isFlagged) return QUESTION_STATUS.ANSWERED_AND_FLAGGED;
      if (isAnswered) return QUESTION_STATUS.ANSWERED;
      if (isFlagged) return QUESTION_STATUS.FLAGGED;
      return QUESTION_STATUS.UNVISITED;
    },
    [activeQuestion, answersByQuestionId, flaggedIds, pipelineStateByQuestion]
  );

  const summaryStats = useMemo(() => {
    let answered = 0;
    let flagged = 0;
    for (const q of questions) {
      const isAnswered =
        q.type === QUESTION_TYPES.MCQ
          ? hasQuestionResponse(q, answersByQuestionId[q.id])
          : hasQuestionResponse(q, answersByQuestionId[q.id]) ||
            pipelineStateByQuestion[q.id] === SUBMISSION_PIPELINE_STATES.EVALUATED;
      if (isAnswered) answered += 1;
      if (flaggedIds.has(q.id)) flagged += 1;
    }
    return {
      total: questions.length,
      answered,
      flagged,
      unanswered: questions.length - answered,
    };
  }, [answersByQuestionId, flaggedIds, pipelineStateByQuestion, questions]);

  const submitAssessment = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Simulate POST /api/submissions with Idempotency-Key & QStash queue handoff
      await new Promise((r) => setTimeout(r, 850));
      setSubmissionReceipt({
        submissionId: `sub-${Date.now().toString(36).toUpperCase()}`,
        qstashMessageId: `qsm-${Math.random().toString(36).slice(2, 10)}`,
        assessmentTitle: assessment.title,
        companyTrack: assessment.companyTrack,
        submittedAtIso: new Date().toISOString(),
        stats: summaryStats,
        pipelineStatus: SUBMISSION_PIPELINE_STATES.QUEUED,
      });
      setIsSubmitModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [assessment.companyTrack, assessment.title, summaryStats]);

  const resetPreviewSession = useCallback(() => {
    setSubmissionReceipt(null);
    setCurrentIndex(0);
    setAnswersByQuestionId(buildInitialAnswers(assessment.questions));
    setFlaggedIds(new Set());
    setVisitedIds(new Set(assessment.questions[0] ? [assessment.questions[0].id] : []));
    setPipelineStateByQuestion({});
    setRunResultByQuestion({});
    setRemainingSeconds(assessment.durationSeconds || 2700);
  }, [assessment]);

  return {
    assessment,
    questions,
    currentIndex,
    activeQuestion,
    answersByQuestionId,
    activeAnswer: answersByQuestionId[activeQuestion?.id] || {},
    flaggedIds,
    isCurrentFlagged: flaggedIds.has(activeQuestion?.id),
    visitedIds,
    remainingSeconds,
    pipelineState: pipelineStateByQuestion[activeQuestion?.id] || SUBMISSION_PIPELINE_STATES.IDLE,
    runResult: runResultByQuestion[activeQuestion?.id] || null,
    summaryStats,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    isSubmitting,
    submissionReceipt,
    selectQuestion,
    goNext,
    goPrevious,
    toggleMcqOption,
    updateWorkspaceCode,
    resetStarterCode,
    clearQuestionResponse,
    toggleFlagQuestion,
    runSampleCheck,
    getQuestionStatus,
    submitAssessment,
    resetPreviewSession,
  };
}
