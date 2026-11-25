import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import { cn } from '../../../utils/cn';
import {
  QUESTION_TYPES,
  SUBMISSION_PIPELINE_STATES,
  SUPPORTED_LANGUAGES,
} from '../types/assessmentTypes';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Columns2,
  Eye,
  Play,
  RotateCcw,
  Terminal,
  XCircle,
} from 'lucide-react';

/**
 * Safe, zero-eval preview card for UI Modification tasks that dynamically
 * reflects Tailwind tokens detected in the student's JSX/CSS workspace buffer.
 */
function SafeUiTaskPreview({ code = '' }) {
  const lower = code.toLowerCase();
  const hasDarkSurface = lower.includes('bg-slate-900') || lower.includes('bg-[#111625]');
  const hasEmeraldBadge = lower.includes('emerald');
  const hasProgressBar = lower.includes('progressbar');
  const hasIndigoButton = lower.includes('indigo');

  return (
    <div className="h-full w-full flex flex-col bg-[#080B12] border-t lg:border-t-0 lg:border-l border-slate-800/90 overflow-y-auto">
      <div className="px-3.5 py-2 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          Embedded Live UI Preview
        </span>
        <span className="font-mono text-slate-500">Sandboxed Viewport</span>
      </div>

      <div className="flex-1 p-5 flex items-center justify-center bg-grid-pattern">
        <div
          className={cn(
            'w-full max-w-sm rounded-2xl border p-5 space-y-4 shadow-xl transition-all',
            hasDarkSurface
              ? 'bg-slate-900/95 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold">TCS NQT Readiness</h4>
              <p className={cn('text-xs', hasDarkSurface ? 'text-slate-400' : 'text-slate-500')}>
                Cohort: CSE Final Year
              </p>
            </div>
            <span
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium border',
                hasEmeraldBadge
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              )}
            >
              Track Ready
            </span>
          </div>

          {hasProgressBar ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Readiness Score</span>
                <span>78%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={78}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full rounded-full bg-slate-800 overflow-hidden"
              >
                <div className="h-full w-[78%] bg-indigo-500 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg border border-dashed border-amber-500/40 text-[11px] text-amber-300">
              Missing accessible role=&quot;progressbar&quot; element
            </div>
          )}

          <button
            type="button"
            className={cn(
              'w-full py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
              hasIndigoButton
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-700 text-slate-200'
            )}
          >
            Start Track
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback VS Code-styled code editor shown when Nikita's Monaco Editor
 * integration (`renderEditor`) is not injected yet.
 */
function FallbackCodeEditor({ filename, language, value, onChange }) {
  const lines = String(value || '').split('\n');

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = `${value.slice(0, start)}  ${value.slice(end)}`;
      onChange(updated);
      requestAnimationFrame(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0B101B]">
      {/* Editor Tab Strip */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-t-md bg-[#0B101B] border border-b-0 border-slate-800 font-mono text-slate-200">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            {filename}
          </span>
          <span className="font-mono text-slate-500 uppercase">{language}</span>
        </div>
        <Badge variant="neutral" size="sm">
          Monaco Editor Slot Ready
        </Badge>
      </div>

      {/* Gutter + Editable Textarea */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div
          aria-hidden="true"
          className="py-3.5 px-2.5 bg-slate-950/70 border-r border-slate-800/70 text-right font-mono text-xs leading-6 text-slate-600 select-none overflow-hidden w-11 shrink-0"
        >
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          aria-label={`Code workspace for ${filename}`}
          className="flex-1 w-full h-full resize-none bg-transparent p-3.5 font-mono text-xs sm:text-[13px] leading-6 text-slate-100 placeholder:text-slate-600 focus:outline-none overflow-auto"
        />
      </div>
    </div>
  );
}

/**
 * WorkspaceShell - Right-pane workspace host for SIMULATION, SQL_TASK, and UI_TASK.
 * Exposes `renderEditor` so Nikita can plug in `@monaco-editor/react` cleanly.
 */
export function WorkspaceShell({
  question,
  answer = {},
  pipelineState = SUBMISSION_PIPELINE_STATES.IDLE,
  runResult = null,
  onChangeCode,
  onChangeLanguage,
  onResetCode,
  onRunCheck,
  renderEditor,
}) {
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [uiViewMode, setUiViewMode] = useState('split'); // 'editor' | 'split' | 'preview'

  if (!question) return null;

  const isSimulation = question.type === QUESTION_TYPES.SIMULATION;
  const isSql = question.type === QUESTION_TYPES.SQL_TASK;
  const isUiTask = question.type === QUESTION_TYPES.UI_TASK;

  const activeLanguageId = answer.language || (isSql ? 'sql' : isUiTask ? 'jsx' : 'python');
  const languageMeta = SUPPORTED_LANGUAGES.find((l) => l.id === activeLanguageId);
  const filename = isSql
    ? 'analytics_query.sql'
    : isUiTask
      ? 'CandidateReadinessCard.jsx'
      : languageMeta?.filename || 'solution.py';

  const isRunning =
    pipelineState === SUBMISSION_PIPELINE_STATES.QUEUED ||
    pipelineState === SUBMISSION_PIPELINE_STATES.RUNNING;

  const handleRunClick = () => {
    setIsConsoleOpen(true);
    onRunCheck(question.id);
  };

  const renderPipelineBadge = () => {
    if (pipelineState === SUBMISSION_PIPELINE_STATES.QUEUED) {
      return (
        <Badge variant="warning" size="sm">
          <Spinner size="sm" className="w-3 h-3 mr-1" />
          QStash Queued
        </Badge>
      );
    }
    if (pipelineState === SUBMISSION_PIPELINE_STATES.RUNNING) {
      return (
        <Badge variant="info" size="sm">
          <Spinner size="sm" className="w-3 h-3 mr-1" />
          Running in Sandbox
        </Badge>
      );
    }
    if (pipelineState === SUBMISSION_PIPELINE_STATES.EVALUATED) {
      return (
        <Badge variant="success" size="sm">
          Evaluated
        </Badge>
      );
    }
    return (
      <Badge variant="neutral" size="sm">
        Ready
      </Badge>
    );
  };

  const editorElement = renderEditor ? (
    <div className="flex-1 min-h-0 flex flex-col">
      {renderEditor({
        question,
        language: languageMeta?.monacoLanguage || activeLanguageId,
        filename,
        value: answer.code || '',
        onChange: (val) => onChangeCode(question.id, val, activeLanguageId),
      })}
    </div>
  ) : (
    <FallbackCodeEditor
      filename={filename}
      language={activeLanguageId}
      value={answer.code || ''}
      onChange={(val) => onChangeCode(question.id, val, activeLanguageId)}
    />
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0B0F19] text-left">
      {/* Workspace Action Toolbar */}
      <div className="px-3.5 py-2.5 border-b border-slate-800/90 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isSimulation && (
            <select
              aria-label="Select programming language"
              value={activeLanguageId}
              onChange={(e) => onChangeLanguage(question.id, e.target.value)}
              className="rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-slate-900">
                  {lang.label}
                </option>
              ))}
            </select>
          )}

          {isSql && (
            <Badge variant="secondary" size="sm">
              PostgreSQL 16 Read-Replica
            </Badge>
          )}

          {isUiTask && (
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
              {[
                { id: 'editor', label: 'Code', icon: <Code2 className="w-3 h-3" /> },
                { id: 'split', label: 'Split', icon: <Columns2 className="w-3 h-3" /> },
                { id: 'preview', label: 'Preview', icon: <Eye className="w-3 h-3" /> },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setUiViewMode(mode.id)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
                    uiViewMode === mode.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          )}

          {renderPipelineBadge()}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetCode(question.id)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            isLoading={isRunning}
            onClick={handleRunClick}
            className="border-indigo-500/40 bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200"
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
          >
            {isSql ? 'Run Query' : isUiTask ? 'Verify UI' : 'Run Sample Cases'}
          </Button>
        </div>
      </div>

      {/* Center Editor / Preview Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {(!isUiTask || uiViewMode !== 'preview') && (
          <div className={cn('min-h-0 flex flex-col', isUiTask && uiViewMode === 'split' ? 'flex-1' : 'flex-1')}>
            {editorElement}
          </div>
        )}

        {isUiTask && uiViewMode !== 'editor' && (
          <div className={cn('min-h-0 flex flex-col', uiViewMode === 'split' ? 'lg:w-[46%] flex-1 lg:flex-none' : 'flex-1')}>
            <SafeUiTaskPreview code={answer.code} />
          </div>
        )}
      </div>

      {/* Bottom Collapsible Sandbox / Output Console Tray */}
      <div className="border-t border-slate-800/90 bg-slate-950/95 shrink-0">
        <button
          type="button"
          onClick={() => setIsConsoleOpen((prev) => !prev)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-slate-300 hover:bg-slate-900/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Execution & Verification Console</span>
            {runResult && (
              <Badge
                variant={runResult.passed === runResult.total ? 'success' : 'warning'}
                size="sm"
              >
                {runResult.passed}/{runResult.total} Passed • {runResult.runtimeMs}ms
              </Badge>
            )}
          </div>
          {isConsoleOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isConsoleOpen && (
          <div className="max-h-52 overflow-y-auto px-4 pb-3.5 pt-1 border-t border-slate-800/60 space-y-2.5 text-xs">
            {isRunning && (
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Spinner size="sm" className="text-indigo-400" />
                <span>
                  {pipelineState === SUBMISSION_PIPELINE_STATES.QUEUED
                    ? 'Dispatching payload to Upstash QStash message queue...'
                    : 'Executing inside ephemeral sandbox container (no network egress)...'}
                </span>
              </div>
            )}

            {!isRunning && !runResult && (
              <p className="py-2 text-slate-500 font-mono text-[11px]">
                Click &quot;{isSql ? 'Run Query' : isUiTask ? 'Verify UI' : 'Run Sample Cases'}&quot; to test against sample data before final submission.
              </p>
            )}

            {!isRunning && runResult && (
              <div className="space-y-2.5">
                {/* Simulation Sample Case Badges */}
                {runResult.type === QUESTION_TYPES.SIMULATION && runResult.cases && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {runResult.cases.map((tc) => (
                      <div
                        key={tc.id}
                        className={cn(
                          'p-2.5 rounded-lg border space-y-1',
                          tc.passed
                            ? 'bg-emerald-950/30 border-emerald-700/40'
                            : 'bg-rose-950/30 border-rose-700/40'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-200 truncate">
                            {tc.label}
                          </span>
                          {tc.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          stdout: <span className="text-slate-200">{tc.actualOutput}</span>
                        </div>
                        {!tc.passed && (
                          <div className="font-mono text-[11px] text-slate-400">
                            expected: <span className="text-emerald-300">{tc.expectedOutput}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* SQL Result Table */}
                {runResult.type === QUESTION_TYPES.SQL_TASK && runResult.rows?.length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left border-collapse font-mono text-[11px]">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                          {runResult.columns.map((col) => (
                            <th key={col} className="px-2.5 py-1.5 font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {runResult.rows.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-800/60 last:border-b-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-2.5 py-1.5 text-slate-200">
                                {String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Standard Output / Summary Line */}
                {runResult.stdout && (
                  <pre className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
                    {runResult.stdout}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
