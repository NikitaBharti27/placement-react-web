import { useState } from 'react'
import {
  Play,
  Terminal,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
} from 'lucide-react'
import MonacoCodeEditor from '../editor/MonacoCodeEditor'

/**
 * Story-Based Simulation Coding Workspace
 * Integrated Monaco Editor with language switching, starter template reset,
 * Docker sandbox code execution (<2s execution target), sample test case diffs,
 * and stdout/stderr inspector.
 */
export const SimulationWorkspace = ({
  question,
  answer,
  executionState,
  onAnswerChange,
  onRunCode,
  assessmentId,
}) => {
  const currentLanguage = answer?.language || 'python'
  const currentCode = answer?.code || question.starterCode?.[currentLanguage] || ''
  const [activeTab, setActiveTab] = useState('problem') // 'problem' | 'customInput'
  const [customInput, setCustomInput] = useState(answer?.customInput || '')
  const [copiedInputIdx, setCopiedInputIdx] = useState(null)
  const [isConsoleOpen, setIsConsoleOpen] = useState(true)

  const isRunning = executionState?.isRunning || false
  const testResults = executionState?.testCaseResults || []
  const stdout = executionState?.stdout || ''
  const stderr = executionState?.stderr || ''

  const handleLanguageChange = (newLang) => {
    const defaultCodeForLang = question.starterCode?.[newLang] || ''
    onAnswerChange({
      language: newLang,
      code: defaultCodeForLang,
    })
  }

  const handleCodeChange = (newCode) => {
    onAnswerChange({
      code: newCode,
    })
  }

  const handleResetBoilerplate = () => {
    const defaultCode = question.starterCode?.[currentLanguage] || ''
    onAnswerChange({
      code: defaultCode,
    })
  }

  const handleRunCode = () => {
    if (onRunCode) {
      onRunCode({
        assessmentId,
        questionId: question.id,
        code: currentCode,
        language: currentLanguage,
        customInput: activeTab === 'customInput' ? customInput : '',
      })
    }
  }

  const handleCopyInput = async (text, idx) => {
    await navigator.clipboard.writeText(text)
    setCopiedInputIdx(idx)
    setTimeout(() => setCopiedInputIdx(null), 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden bg-slate-100">
      {/* Left Column: Problem Story, Constraints & Test Cases (5 Cols) */}
      <div className="lg:col-span-5 h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-white space-y-5">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs">
              Simulation Coding
            </span>
            <span className="text-xs font-mono text-slate-500">{question.topic}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              Marks: {question.marks}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                question.difficulty === 'Hard'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Problem Title */}
        <h2 className="text-lg font-bold text-slate-900 leading-snug">{question.title}</h2>

        {/* Story Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Problem Description</span>
          </h3>
          <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
            {question.story}
          </div>
        </div>

        {/* Constraints */}
        {question.constraints && question.constraints.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Constraints & Sandbox Limits
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono">
              {question.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Test Cases */}
        {question.sampleCases && question.sampleCases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sample Test Cases
            </h3>
            {question.sampleCases.map((tc, idx) => (
              <div
                key={idx}
                className="bg-slate-900 text-slate-200 rounded-xl p-3.5 text-xs font-mono space-y-2 border border-slate-800"
              >
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 text-[11px]">
                  <span>Sample Case #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyInput(tc.input, idx)}
                    className="hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedInputIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Input</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Input:</div>
                  <pre className="bg-slate-950 p-2 rounded text-emerald-300 mt-1 overflow-x-auto">
                    {tc.input}
                  </pre>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Expected Output:</div>
                  <pre className="bg-slate-950 p-2 rounded text-cyan-300 mt-1">{tc.output}</pre>
                </div>

                {tc.explanation && (
                  <div className="text-[11px] text-slate-400 font-sans italic pt-1">
                    Explanation: {tc.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Monaco Code Editor + Sandbox Execution Drawer (7 Cols) */}
      <div className="lg:col-span-7 h-full flex flex-col p-3 sm:p-4 bg-slate-900 gap-3 overflow-hidden">
        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[350px] relative">
          <MonacoCodeEditor
            language={currentLanguage}
            value={currentCode}
            onChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            onResetBoilerplate={handleResetBoilerplate}
            availableLanguages={['python', 'javascript', 'java', 'cpp']}
            headerExtra={
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                {isRunning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing in Sandbox...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Sample Tests</span>
                  </>
                )}
              </button>
            }
          />
        </div>

        {/* Execution Results Drawer (Docker Sandbox Feedback <2s) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[260px]">
          {/* Drawer Header */}
          <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">Execution Output (Docker Sandbox)</span>
              {testResults.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {testResults.filter((t) => t.status === 'PASSED').length}/{testResults.length} Tests Passed
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab((t) => (t === 'problem' ? 'customInput' : 'problem'))}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  activeTab === 'customInput'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Input
              </button>
              <button
                type="button"
                onClick={() => setIsConsoleOpen((open) => !open)}
                className="p-1 text-slate-400 hover:text-white"
                title={isConsoleOpen ? 'Collapse Console' : 'Expand Console'}
              >
                {isConsoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          {isConsoleOpen && (
            <div className="p-3 text-xs font-mono overflow-y-auto space-y-3 bg-slate-950/70">
              {activeTab === 'customInput' ? (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Provide custom input for sandbox stdin:
                  </label>
                  <textarea
                    rows={3}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. 3 3&#10;1 2 2&#10;3 8 2&#10;5 3 5"
                    className="w-full bg-slate-900 text-emerald-300 p-2 rounded border border-slate-800 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  {/* Test case badges */}
                  {testResults.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-900">
                      {testResults.map((tc) => (
                        <div
                          key={tc.caseIndex}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] border ${
                            tc.status === 'PASSED'
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                              : 'bg-rose-950/60 border-rose-800 text-rose-300'
                          }`}
                        >
                          {tc.status === 'PASSED' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-400" />
                          )}
                          <span>{tc.title || `Test Case #${tc.caseIndex}`}</span>
                          <span className="text-[10px] text-slate-400 font-sans">
                            ({tc.executionTimeMs}ms)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stdout / Stderr logs */}
                  {stdout ? (
                    <div className="text-emerald-400 whitespace-pre-wrap leading-5 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      {stdout}
                    </div>
                  ) : stderr ? (
                    <div className="text-rose-400 whitespace-pre-wrap leading-5 bg-rose-950/30 p-2.5 rounded border border-rose-900">
                      {stderr}
                    </div>
                  ) : (
                    <div className="text-slate-500 flex items-center gap-2 py-2">
                      <Cpu className="w-4 h-4 text-slate-600" />
                      <span>Ready for compilation. Click &quot;Run Sample Tests&quot; to execute in isolated Docker sandbox.</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimulationWorkspace
