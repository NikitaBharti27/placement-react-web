import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Layout,
  Play,
  CheckCircle,
  XCircle,
  Eye,
  Code,
  Sparkles,
  Monitor,
  Smartphone,
} from 'lucide-react'
import MonacoCodeEditor from '../editor/MonacoCodeEditor'
import SplitPane from '../../ui/SplitPane'

/**
 * UI Engineering Task Workspace
 * Live sandboxed iframe preview + real postMessage DOM & computed-style assertions.
 */
export const UiTaskWorkspace = ({ question, answer, onAnswerChange }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('html')
  const [previewMode, setPreviewMode] = useState('desktop') // 'desktop' | 'mobile'
  const [verificationResults, setVerificationResults] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const iframeRef = useRef(null)

  const htmlCode = answer?.html ?? (question.starterHtml || '')
  const cssCode = answer?.css ?? (question.starterCss || '')
  const jsCode = answer?.js ?? (question.starterJs || '')

  const handleHtmlChange = (val) => onAnswerChange({ html: val })
  const handleCssChange = (val) => onAnswerChange({ css: val })
  const handleJsChange = (val) => onAnswerChange({ js: val })

  const handleReset = () => {
    setVerificationResults(null)
    onAnswerChange({
      html: question.starterHtml || '',
      css: question.starterCss || '',
      js: question.starterJs || '',
      hasVerified: false,
    })
  }

  const previewDocument = useMemo(
    () => `
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

            window.addEventListener('message', function(event) {
              if (!event.data || event.data.type !== 'RUN_UI_ASSERTIONS') return;
              const results = [];
              try {
                const card = document.querySelector('#candidate-card, .card');
                const cardStyle = card ? getComputedStyle(card) : null;
                const req1 = Boolean(
                  card &&
                  cardStyle &&
                  (cardStyle.display.includes('flex') || cardStyle.display.includes('grid')) &&
                  parseFloat(cardStyle.paddingTop) >= 16 &&
                  parseFloat(cardStyle.borderTopLeftRadius) > 0
                );
                results.push({ id: 'req-1', passed: req1 });

                const badge = document.querySelector('#badge, .badge');
                const badgeStyle = badge ? getComputedStyle(badge) : null;
                const req2 = Boolean(
                  badgeStyle &&
                  badgeStyle.backgroundColor === 'rgb(209, 250, 229)' &&
                  badgeStyle.color === 'rgb(6, 95, 70)'
                );
                results.push({ id: 'req-2', passed: req2 });

                const btn = document.querySelector('#verify-btn, .btn, button');
                const btnStyle = btn ? getComputedStyle(btn) : null;
                const styleText = Array.from(document.querySelectorAll('style'))
                  .map((s) => s.textContent || '')
                  .join(' ');
                const req3 = Boolean(
                  btn &&
                  btnStyle &&
                  parseFloat(btnStyle.transitionDuration) > 0 &&
                  styleText.includes('focus-visible')
                );
                results.push({ id: 'req-3', passed: req3 });

                let req4 = false;
                if (btn) {
                  const beforeText = btn.textContent || '';
                  btn.click();
                  const afterText = btn.textContent || '';
                  req4 = afterText !== beforeText && /verified/i.test(afterText);
                  btn.click(); // Restore prior state cleanly
                }
                results.push({ id: 'req-4', passed: req4 });
              } catch (err) {
                console.error('Assertion error:', err);
              }

              window.parent.postMessage({
                type: 'UI_ASSERTIONS_RESULT',
                requestId: event.data.requestId,
                results: results,
              }, '*');
            });
          </script>
        </body>
      </html>
    `,
    [htmlCode, cssCode, jsCode],
  )

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type !== 'UI_ASSERTIONS_RESULT') return
      const assertionMap = new Map((event.data.results || []).map((r) => [r.id, r.passed]))
      const mapped = (question.requirements || []).map((req) => ({
        id: req.id,
        text: req.text,
        passed: Boolean(assertionMap.get(req.id)),
      }))
      setVerificationResults(mapped)
      setIsVerifying(false)
      onAnswerChange({ hasVerified: true })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [question.requirements, onAnswerChange])

  const handleVerifyUi = () => {
    const win = iframeRef.current?.contentWindow
    if (win) {
      setIsVerifying(true)
      win.postMessage({ type: 'RUN_UI_ASSERTIONS', requestId: Date.now() }, '*')
      return
    }

    const fallbackResults = (question.requirements || []).map((req) => ({
      id: req.id,
      text: req.text,
      passed: false,
    }))
    setVerificationResults(fallbackResults)
  }

  const passedCount = verificationResults
    ? verificationResults.filter((r) => r.passed).length
    : 0

  const leftContent = (
    <div className="h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-white space-y-5 exam-scroll">
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

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900">{question.title}</h2>
        <div className="text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 select-text">
          {question.taskBrief}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            <span>Acceptance Requirements</span>
          </h3>

          {verificationResults && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                passedCount === verificationResults.length
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}
            >
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
          disabled={isVerifying}
          onClick={handleVerifyUi}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isVerifying ? 'Inspecting Live DOM...' : 'Verify UI Requirements'}</span>
        </button>
      </div>
    </div>
  )

  const rightContent = (
    <div className="h-full flex flex-col p-3 sm:p-4 bg-slate-900 gap-3 overflow-hidden">
      <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5">
          <Code className="w-4 h-4 text-indigo-400" />
          <div className="flex items-center bg-slate-900 p-0.5 rounded-md border border-slate-800">
            {[
              { id: 'html', label: 'index.html' },
              { id: 'css', label: 'styles.css' },
              { id: 'js', label: 'script.js' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCodeTab(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition cursor-pointer ${
                  activeCodeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={isVerifying}
          onClick={handleVerifyUi}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Test DOM</span>
        </button>
      </div>

      <div className="flex-1 min-h-[220px] relative">
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
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 rounded border border-slate-700 p-0.5">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`p-1 rounded transition cursor-pointer ${
                  previewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Desktop Viewport"
              >
                <Monitor className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`p-1 rounded transition cursor-pointer ${
                  previewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Mobile Viewport (360px)"
              >
                <Smartphone className="w-3 h-3" />
              </button>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Sandboxed Iframe
            </span>
          </div>
        </div>

        <div className="flex-1 w-full bg-slate-100 relative overflow-auto flex justify-center">
          <iframe
            ref={iframeRef}
            title="UI Task Preview"
            srcDoc={previewDocument}
            sandbox="allow-scripts"
            style={{ width: previewMode === 'mobile' ? '360px' : '100%' }}
            className="h-full border-none bg-slate-50 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )

  return (
    <SplitPane
      left={leftContent}
      right={rightContent}
      leftLabel="Task Brief & Acceptance"
      rightLabel="UI Code & Preview"
      defaultLeftPercent={40}
      minLeftPercent={25}
      maxLeftPercent={65}
    />
  )
}

export default UiTaskWorkspace
