import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { GripVertical, PanelLeftClose, PanelLeftOpen, RotateCcw } from 'lucide-react'

/**
 * SplitPane - Resizable split-screen workspace container.
 * Desktop: Horizontal resizable split panes with dragging support.
 * Mobile/Tablet: Segmented tabs between Left Brief and Right Workspace.
 */
export function SplitPane({
  left,
  right,
  leftLabel = 'Problem Brief',
  rightLabel = 'Interactive Workspace',
  defaultLeftPercent = 42,
  minLeftPercent = 25,
  maxLeftPercent = 70,
  className = '',
  leftClassName = '',
  rightClassName = '',
}) {
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent)
  const [isDragging, setIsDragging] = useState(false)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [mobileActivePane, setMobileActivePane] = useState('left')
  const containerRef = useRef(null)

  const clampPercent = useCallback(
    (pct) => Math.min(Math.max(pct, minLeftPercent), maxLeftPercent),
    [minLeftPercent, maxLeftPercent]
  )

  const updateFromClientX = useCallback(
    (clientX) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const rawPercent = ((clientX - rect.left) / rect.width) * 100
      setLeftPercent(clampPercent(rawPercent))
    },
    [clampPercent]
  )

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (e) => {
      e.preventDefault()
      updateFromClientX(e.clientX)
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, updateFromClientX])

  return (
    <div className={cn('flex flex-col h-full w-full overflow-hidden', className)}>
      {/* Mobile/Tablet Segmented Switcher (<lg) */}
      <div className="flex lg:hidden items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 w-full">
          <button
            type="button"
            onClick={() => setMobileActivePane('left')}
            className={cn(
              'flex-1 py-1.5 text-center font-medium rounded-md transition cursor-pointer',
              mobileActivePane === 'left'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
          >
            {leftLabel}
          </button>
          <button
            type="button"
            onClick={() => setMobileActivePane('right')}
            className={cn(
              'flex-1 py-1.5 text-center font-medium rounded-md transition cursor-pointer',
              mobileActivePane === 'right'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            )}
          >
            {rightLabel}
          </button>
        </div>
      </div>

      {/* Main Split Container */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 min-h-0 flex flex-col lg:flex-row relative overflow-hidden',
          isDragging && 'select-none cursor-col-resize'
        )}
      >
        {/* Left Pane */}
        <section
          aria-label={leftLabel}
          style={!isLeftCollapsed ? { width: `${leftPercent}%` } : undefined}
          className={cn(
            'min-h-0 overflow-y-auto bg-white',
            'lg:shrink-0',
            isLeftCollapsed
              ? 'hidden'
              : mobileActivePane === 'left'
              ? 'flex-1 lg:flex-none'
              : 'hidden lg:block',
            leftClassName
          )}
        >
          {left}
        </section>

        {/* Desktop Draggable Divider Handle */}
        <div className="hidden lg:flex relative items-center justify-center shrink-0 w-2.5 bg-slate-950 border-x border-slate-800 group">
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Resize panels"
            onPointerDown={(e) => {
              e.preventDefault()
              setIsLeftCollapsed(false)
              setIsDragging(true)
            }}
            onDoubleClick={() => {
              setIsLeftCollapsed(false)
              setLeftPercent(defaultLeftPercent)
            }}
            title="Drag to resize • Double-click to reset"
            className={cn(
              'w-full h-full flex items-center justify-center cursor-col-resize transition-colors',
              isDragging ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-600/40 text-slate-500 hover:text-white'
            )}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Floating Collapse / Reset Controls */}
          <div className="absolute top-3 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setIsLeftCollapsed((prev) => !prev)}
              title={isLeftCollapsed ? `Restore ${leftLabel}` : `Collapse ${leftLabel}`}
              className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer shadow-md"
            >
              {isLeftCollapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
            </button>
            {leftPercent !== defaultLeftPercent && !isLeftCollapsed && (
              <button
                type="button"
                onClick={() => setLeftPercent(defaultLeftPercent)}
                title="Reset width"
                className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Pane */}
        <section
          aria-label={rightLabel}
          className={cn(
            'flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden bg-slate-900',
            mobileActivePane === 'right' ? 'flex' : 'hidden lg:flex',
            rightClassName
          )}
        >
          {isLeftCollapsed && (
            <div className="hidden lg:flex items-center justify-between px-3 py-1 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
              <span>{leftLabel} collapsed for maximum workspace</span>
              <button
                type="button"
                onClick={() => setIsLeftCollapsed(false)}
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                <PanelLeftOpen className="w-3 h-3" />
                <span>Restore Split View</span>
              </button>
            </div>
          )}
          {right}
        </section>
      </div>
    </div>
  )
}

export default SplitPane
