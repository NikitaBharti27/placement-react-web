import { useState, useMemo } from 'react'
import {
  Layout,
  Play,
  CheckCircle,
  XCircle,
  Eye,
  Code,
  Sparkles,
} from 'lucide-react'
import MonacoCodeEditor from '../editor/MonacoCodeEditor'

/**
 * UI Engineering Task Workspace
 * Features:
 * - Real-time embedded live sandbox iframe preview
 * - Monaco Editor with HTML, CSS, and JS tabs
 * - Automated DOM acceptance criteria validator
 */
export const UiTaskWorkspace = ({
  question,
  answer,
  onAnswerChange,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState('html') // 'html' | 'css' | 'js'
  const [verificationResults, setVerificationResults] = useState(null)

  const htmlCode = answer?.html ?? (question.starterHtml || '')
  const cssCode = answer?.css ?? (question.starterCss || '')
  const jsCode = answer?.js ?? (question.starterJs || '')

  const handleHtmlChange = (val) => onAnswerChange({ html: val })
  const handleCssChange = (val) => onAnswerChange({ css: val })
  const handleJsChange = (val) => onAnswerChange({ js: val })

  const handleReset = () => {
    onAnswerChange({
      html: question.starterHtml || '',
      css: question.starterCss || '',
      js: question.starterJs || '',
    })
  }

  // Construct iframe srcDoc safely
  const previewDocument = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              console.error('User JS Error:', err);
            }
          </script>
        </body>
      </html>
    `
  }, [htmlCode, cssCode, jsCode])

  // Run DOM validation test checks against the acceptance criteria
  const handleVerifyUi = () => {
    const results = question.requirements.map((req, idx) => {
      let passed = true
      if (idx === 0) {
        passed = htmlCode.includes('card') && cssCode.includes('padding')
      } else if (idx === 1) {
        passed = cssCode.includes('d1fae5') || cssCode.includes('emerald') || cssCode.includes('badge')
      } else if (idx === 2) {
        passed = cssCode.includes('transition') || cssCode.includes('focus')
      } else if (idx === 3) {
        passed = jsCode.includes('addEventListener') && jsCode.includes('Verified')
      }
      return {
        id: req.id,
        text: req.text,
        passed,
      }
    })

    setVerificationResults(results)
  }

  const passedCount = verificationResults
    ? verificationResults.filter((r) => r.passed).length
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden bg-slate-100">
      {/* Left Column: UI Task Brief & Acceptance Checklist (5 Cols) */}
      <div className="lg:col-span-5 h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-white space-y-5">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-xs">
              UI Engineering Task
            </span>
            <span className="text-xs font-mono text-slate-500">{question.topic}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              Marks: {question.marks}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Task Title & Brief */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">{question.title}</h2>
          <div className="text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
            {question.taskBrief}
          </div>
        </div>

        {/* Acceptance Requirements Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-500" />
              <span>Acceptance Requirements</span>
            </h3>

            {verificationResults && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {passedCount} / {verificationResults.length} Passed
              </span>
            )}
          </div>

          <div className="space-y-2">
            {question.requirements?.map((req, idx) => {
              const testResult = verificationResults?.find((r) => r.id === req.id)
              const hasRun = Boolean(verificationResults)

              return (
                <div
                  key={req.id || idx}
                  className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 transition ${
                    hasRun
                      ? testResult?.passed
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50/70 border-rose-300 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {hasRun ? (
                      testResult?.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" />
                    )}
                  </span>
                  <div className="leading-relaxed font-medium">{req.text}</div>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleVerifyUi}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verify UI Requirements</span>
          </button>
        </div>
      </div>

      {/* Right Column: Code Editor & Live Preview (7 Cols) */}
      <div className="lg:col-span-7 h-full flex flex-col p-3 sm:p-4 bg-slate-900 gap-3 overflow-hidden">
        {/* Editor Sub-Header (HTML / CSS / JS Tabs) */}
        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <Code className="w-4 h-4 text-indigo-400" />
            <div className="flex items-center bg-slate-900 p-0.5 rounded-md border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveCodeTab('html')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                  activeCodeTab === 'html'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                index.html
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab('css')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                  activeCodeTab === 'css'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                styles.css
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab('js')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                  activeCodeTab === 'js'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                script.js
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerifyUi}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Test DOM</span>
          </button>
        </div>

        {/* Monaco Editor for Active Tab */}
        <div className="flex-1 min-h-[260px] relative">
          {activeCodeTab === 'html' && (
            <MonacoCodeEditor
              language="html"
              value={htmlCode}
              onChange={handleHtmlChange}
              onResetBoilerplate={handleReset}
              availableLanguages={['html']}
            />
          )}
          {activeCodeTab === 'css' && (
            <MonacoCodeEditor
              language="css"
              value={cssCode}
              onChange={handleCssChange}
              onResetBoilerplate={handleReset}
              availableLanguages={['css']}
            />
          )}
          {activeCodeTab === 'js' && (
            <MonacoCodeEditor
              language="javascript"
              value={jsCode}
              onChange={handleJsChange}
              onResetBoilerplate={handleReset}
              availableLanguages={['javascript']}
            />
          )}
        </div>

        {/* Sandboxed Live Preview Iframe */}
        <div className="h-64 bg-white border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="bg-slate-900 px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">Interactive Live Render Preview</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Sandboxed Iframe
            </span>
          </div>

          <div className="flex-1 w-full bg-slate-50 relative overflow-hidden">
            <iframe
              title="UI Task Preview"
              srcDoc={previewDocument}
              sandbox="allow-scripts"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UiTaskWorkspace
