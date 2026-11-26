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
  FileInput,
  FileOutput,
} from 'lucide-react'
import MonacoCodeEditor from '../editor/MonacoCodeEditor'
import SplitPane from '../../ui/SplitPane'

/**
 * Story-Based Simulation Coding Workspace
 */
export const SimulationWorkspace = ({
  question,
  answer,
  executionState,
  onAnswerChange,
  onRunCode,
  assessmentId,
}) => {
  const availableLanguages = Object.keys(question.starterCode || { python: '' })
  const currentLanguage = answer?.language || availableLanguages[0] || 'python'
  const currentCode = answer?.code ?? (question.starterCode?.[currentLanguage] || '')
  const customInput = answer?.customInput || ''

  const [drawerTab, setDrawerTab] = useState('results') // 'results' | 'customInput'
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
    onAnswerChange({ code: newCode })
  }

  const handleResetBoilerplate = () => {
    const defaultCode = question.starterCode?.[currentLanguage] || ''
    onAnswerChange({ code: defaultCode })
  }

  const handleCustomInputChange = (val) => {
    onAnswerChange({ customInput: val })
  }

  const handleRunCode = (useCustom = false) => {
    setIsConsoleOpen(true)
    setDrawerTab('results')
    if (onRunCode) {
      onRunCode({
        assessmentId,
        questionId: question.id,
        code: currentCode,
        language: currentLanguage,
        customInput: useCustom ? customInput : '',
      })
    }
  }

  const handleCopyInput = async (text, idx) => {
    await navigator.clipboard.writeText(text)
    setCopiedInputIdx(idx)
    setTimeout(() => setCopiedInputIdx(null), 1500)
  }

  const leftContent = (
    <div className="h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-white space-y-5 exam-scroll">
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

      <h2 className="text-lg font-bold text-slate-900 leading-snug">{question.title}</h2>

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Problem Scenario</span>
        </h3>
        <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 select-text">
          {question.story}
        </div>
      </div>

      {(question.inputFormat || question.outputFormat) && (
        <div className="grid grid-cols-1 gap-3 text-xs">
          {question.inputFormat && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <FileInput className="w-3.5 h-3.5 text-indigo-500" />
                <span>Input Format</span>
              </div>
              <p className="text-slate-700 leading-relaxed select-text">{question.inputFormat}</p>
            </div>
          )}
          {question.outputFormat && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <FileOutput className="w-3.5 h-3.5 text-emerald-600" />
                <span>Output Format</span>
              </div>
              <p className="text-slate-700 leading-relaxed select-text">{question.outputFormat}</p>
            </div>
          )}
        </div>
      )}

      {question.constraints && question.constraints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Constraints &amp; Sandbox Limits
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono select-text">
            {question.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {question.sampleCases && question.sampleCases.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sample Test Cases
          </h3>
          {question.sampleCases.map((tc, idx) => (
            <div
              key={idx}
              className="bg-slate-900 text-slate-200 rounded-xl p-3.5 text-xs font-mono space-y-2 border border-slate-800 select-text"
            >
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 text-[11px]">
                <span>Sample Case #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleCopyInput(tc.input, idx)}
                  className="hover:text-white flex items-center gap-1 transition cursor-pointer"
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
  )

  const passedTestsCount = testResults.filter((t) => t.status === 'PASSED').length

  const rightContent = (
    <div className="h-full flex flex-col p-3 sm:p-4 bg-slate-900 gap-3 overflow-hidden">
      <div className="flex-1 min-h-[280px] relative">
        <MonacoCodeEditor
          language={currentLanguage}
          value={currentCode}
          onChange={handleCodeChange}
          onLanguageChange={handleLanguageChange}
          onResetBoilerplate={handleResetBoilerplate}
          availableLanguages={availableLanguages}
          headerExtra={
            <button
              type="button"
              onClick={() => handleRunCode(false)}
              disabled={isRunning}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
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

      {/* Execution Results Drawer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[250px]">
        <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">Execution Output (Docker Sandbox)</span>
            {testResults.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  passedTestsCount === testResults.length
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}
              >
                {passedTestsCount}/{testResults.length} Tests Passed
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => {
                setIsConsoleOpen(true)
                setDrawerTab('results')
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                drawerTab === 'results'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Results
            </button>
            <button
              type="button"
              onClick={() => {
                setIsConsoleOpen(true)
                setDrawerTab('customInput')
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                drawerTab === 'customInput'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Input
            </button>
            <button
              type="button"
              onClick={() => setIsConsoleOpen((open) => !open)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title={isConsoleOpen ? 'Collapse Console' : 'Expand Console'}
            >
              {isConsoleOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {isConsoleOpen && (
          <div className="p-3 text-xs font-mono overflow-y-auto space-y-3 bg-slate-950/70 exam-scroll select-text">
            {drawerTab === 'customInput' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-400">
                    Provide custom input for sandbox stdin:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRunCode(true)}
                    disabled={isRunning || !customInput.trim()}
                    className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-sans font-semibold text-[11px] cursor-pointer"
                  >
                    Run with Custom Input
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={customInput}
                  onChange={(e) => handleCustomInputChange(e.target.value)}
                  placeholder={'e.g. 3 3\n1 2 2\n3 8 2\n5 3 5'}
                  className="w-full bg-slate-900 text-emerald-300 p-2 rounded border border-slate-800 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            ) : (
              <>
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
                        {tc.status !== 'PASSED' && tc.actualOutput && (
                          <span className="text-[10px] text-rose-200">
                            (got {tc.actualOutput}, expected {tc.expectedOutput})
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-sans">
                          ({tc.executionTimeMs}ms)
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {stderr && (
                  <div className="text-rose-300 whitespace-pre-wrap leading-5 bg-rose-950/30 p-2.5 rounded border border-rose-900">
                    {stderr}
                  </div>
                )}

                {stdout ? (
                  <div className="text-emerald-400 whitespace-pre-wrap leading-5 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    {stdout}
                  </div>
                ) : !stderr ? (
                  <div className="text-slate-500 flex items-center gap-2 py-2">
                    <Cpu className="w-4 h-4 text-slate-600" />
                    <span>
                      Ready for compilation. Click &quot;Run Sample Tests&quot; to execute in
                      isolated Docker sandbox.
                    </span>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <SplitPane
      left={leftContent}
      right={rightContent}
      leftLabel="Problem Brief"
      rightLabel="Coding Sandbox Workspace"
      defaultLeftPercent={44}
      minLeftPercent={25}
      maxLeftPercent={65}
    />
  )
}

export default SimulationWorkspace
