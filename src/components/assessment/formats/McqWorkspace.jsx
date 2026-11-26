import { useEffect, useCallback } from 'react'
import { Check, HelpCircle, RotateCcw } from 'lucide-react'

/**
 * MCQ Multi-Choice Question Workspace
 * Features safe keyboard shortcuts (1-4 or A-D) that ignore modifier combos
 * and modal overlays, plus instant Redux answer synchronization.
 */
export const McqWorkspace = ({ question, answer, onAnswerChange, onClearAnswer }) => {
  const selectedOptionId = answer?.selectedOptionId || null

  const handleSelectOption = useCallback(
    (optionId) => {
      onAnswerChange({ selectedOptionId: optionId })
    },
    [onAnswerChange],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
        e.target.isContentEditable
      ) {
        return
      }
      if (document.querySelector('[role="dialog"]')) return

      const key = e.key.toUpperCase()
      const indexMap = { 1: 0, 2: 1, 3: 2, 4: 3, A: 0, B: 1, C: 2, D: 3 }

      if (key in indexMap) {
        const targetIndex = indexMap[key]
        if (question.options && question.options[targetIndex]) {
          handleSelectOption(question.options[targetIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question.options, handleSelectOption])

  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-xs">
              {question.subject || 'Technical Aptitude'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-600 font-mono">
              Topic: {question.topic || 'General'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              Marks: +{question.marks || 5}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
              Single Choice
            </span>
          </div>
        </div>

        <div className="text-slate-900 text-base leading-relaxed font-medium select-text">
          {question.prompt}
        </div>

        {question.codeSnippet && (
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto text-xs font-mono text-emerald-300 border border-slate-800 shadow-inner select-text">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-sans font-bold">
              Code Reference:
            </div>
            <pre className="leading-5">{question.codeSnippet}</pre>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="font-semibold text-slate-700">Choose the correct answer:</span>
          <span className="hidden sm:inline text-slate-400">
            Tip: Press keyboard keys{' '}
            <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">A</kbd>-
            <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">D</kbd> to select
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options?.map((opt, index) => {
            const isSelected = selectedOptionId === opt.id
            const letter = OPTION_LETTERS[index] || index + 1

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3 group cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-1 ring-indigo-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                }`}
              >
                <span
                  className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : letter}
                </span>

                <div className="flex-1 text-sm text-slate-800 leading-normal pt-0.5">
                  {opt.text}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Need to revisit? Click &quot;Mark for Review&quot; in the header bar anytime.</span>
        </div>

        {selectedOptionId && (
          <button
            type="button"
            onClick={onClearAnswer}
            className="inline-flex items-center space-x-1 text-slate-500 hover:text-rose-600 font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Choice</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default McqWorkspace
