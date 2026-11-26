import { useState, useCallback, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import {
  Code2,
  Sun,
  Moon,
  RotateCcw,
  Maximize2,
  Minimize2,
  Check,
  AlertTriangle,
} from 'lucide-react'

const LANGUAGE_LABELS = {
  python: 'Python 3.11',
  javascript: 'JavaScript (Node 20)',
  java: 'Java 17 (OpenJDK)',
  cpp: 'C++ 20 (GCC)',
  sql: 'PostgreSQL SQL',
  html: 'HTML5',
  css: 'CSS3',
}

/**
 * Production-Grade Monaco Code Editor Integration
 * Includes CDN load watchdog with automatic fallback to a Tab-aware code editor
 * if offline or blocked by a restrictive network proxy.
 */
export const MonacoCodeEditor = ({
  value = '',
  onChange,
  language = 'python',
  onLanguageChange,
  availableLanguages = ['python', 'javascript', 'java', 'cpp'],
  readOnly = false,
  onResetBoilerplate,
  height = '100%',
  headerExtra,
}) => {
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(13)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [monacoLoaded, setMonacoLoaded] = useState(false)
  const [useFallbackEditor, setUseFallbackEditor] = useState(false)

  useEffect(() => {
    if (monacoLoaded || useFallbackEditor) return
    const timer = setTimeout(() => {
      setUseFallbackEditor(true)
    }, 8000)
    return () => clearTimeout(timer)
  }, [monacoLoaded, useFallbackEditor])

  const handleEditorChange = useCallback(
    (newVal) => {
      if (onChange) {
        onChange(newVal || '')
      }
    },
    [onChange],
  )

  const handleFallbackKeyDown = (e) => {
    if (e.key === 'Tab' && !readOnly) {
      e.preventDefault()
      const target = e.target
      const start = target.selectionStart
      const end = target.selectionEnd
      const updated = `${value.substring(0, start)}  ${value.substring(end)}`
      handleEditorChange(updated)
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2
      })
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'))
  }

  const handleCopyCode = async () => {
    if (value) {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConfirmReset = () => {
    if (onResetBoilerplate) {
      onResetBoilerplate()
    }
    setShowResetConfirm(false)
  }

  const editorOptions = {
    minimap: { enabled: false },
    fontSize,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    bracketPairColorization: { enabled: true },
    suggestOnTriggerCharacters: true,
    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
    fontLigatures: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    formatOnPaste: true,
  }

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-md transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-full'
      }`}
    >
      {/* Editor Control Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">VS Code Editor</span>
          </div>

          {availableLanguages && availableLanguages.length > 1 && (
            <select
              value={language}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              aria-label="Select programming language"
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang] || lang.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          {availableLanguages && availableLanguages.length === 1 && (
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-mono border border-slate-700">
              {LANGUAGE_LABELS[availableLanguages[0]] || availableLanguages[0]}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-slate-300">
          {headerExtra}

          {onResetBoilerplate && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Reset to starter boilerplate"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {showResetConfirm && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-slate-900 border border-slate-700 rounded-lg p-2.5 shadow-xl w-48 text-xs text-slate-200 space-y-2">
                  <p className="font-medium text-[11px] text-amber-300">
                    Reset code to initial template? Your current edits will be cleared.
                  </p>
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyCode}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[11px] px-1 font-mono">Copy</span>
            )}
          </button>

          <div className="hidden sm:flex items-center bg-slate-800/80 rounded border border-slate-700 px-1">
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              className="px-1 text-slate-400 hover:text-white cursor-pointer"
              title="Decrease font size"
            >
              A-
            </button>
            <span className="text-[10px] text-slate-400 px-1 font-mono">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(20, s + 1))}
              className="px-1 text-slate-400 hover:text-white cursor-pointer"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={theme === 'vs-dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Monaco React Editor Surface (with graceful offline fallback) */}
      <div className="flex-1 w-full relative min-h-[260px]">
        {useFallbackEditor ? (
          <div className="h-full flex flex-col">
            <div className="bg-amber-950/60 border-b border-amber-800/70 px-3 py-1.5 text-[11px] text-amber-200 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Offline fallback editor active (Monaco CDN unreachable). Tab indentation enabled.
              </span>
              <button
                type="button"
                onClick={() => setUseFallbackEditor(false)}
                className="text-cyan-300 hover:underline font-semibold cursor-pointer"
              >
                Retry Monaco
              </button>
            </div>
            <textarea
              value={value}
              readOnly={readOnly}
              onChange={(e) => handleEditorChange(e.target.value)}
              onKeyDown={handleFallbackKeyDown}
              spellCheck={false}
              style={{ fontSize: `${fontSize}px` }}
              className={`flex-1 w-full p-4 font-mono resize-none focus:outline-none ${
                theme === 'vs-dark' ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
              }`}
            />
          </div>
        ) : (
          <Editor
            height={height}
            language={language === 'c++' ? 'cpp' : language}
            value={value}
            theme={theme}
            onMount={() => setMonacoLoaded(true)}
            onChange={handleEditorChange}
            options={editorOptions}
            loading={
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-2" />
                Initializing VS Code Monaco Workspace...
              </div>
            }
          />
        )}
      </div>

      {/* Editor Status Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center space-x-3">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Auto-saved in Redux
          </span>
          <span>Chars: {value.length}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>UTF-8</span>
          <span className="uppercase">{language}</span>
        </div>
      </div>
    </div>
  )
}

export default MonacoCodeEditor
