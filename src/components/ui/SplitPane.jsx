import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { GripVertical, PanelLeftClose, PanelLeftOpen, RotateCcw } from 'lucide-react';

/**
 * SplitPane - Production-grade resizable split-screen workspace.
 * Desktop (lg+): Horizontal resizable split panes with keyboard & pointer support.
 * Mobile/Tablet (<lg): Accessible segmented switch between Left Brief and Right Workspace.
 */
export function SplitPane({
  left,
  right,
  leftLabel = 'Problem Brief',
  rightLabel = 'Interactive Workspace',
  defaultLeftPercent = 44,
  minLeftPercent = 28,
  maxLeftPercent = 68,
  className = '',
  leftClassName = '',
  rightClassName = '',
}) {
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent);
  const [isDragging, setIsDragging] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [mobileActivePane, setMobileActivePane] = useState('left');
  const containerRef = useRef(null);

  const clampPercent = useCallback(
    (pct) => Math.min(Math.max(pct, minLeftPercent), maxLeftPercent),
    [minLeftPercent, maxLeftPercent]
  );

  const updateFromClientX = useCallback(
    (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const rawPct = ((clientX - rect.left) / rect.width) * 100;
      setLeftPercent(clampPercent(rawPct));
    },
    [clampPercent]
  );

  useEffect(() => {
    if (!isDragging) return undefined;

    const handlePointerMove = (event) => {
      updateFromClientX(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, updateFromClientX]);

  const handleDividerKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setIsLeftCollapsed(false);
      setLeftPercent((prev) => clampPercent(prev - 2));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setIsLeftCollapsed(false);
      setLeftPercent((prev) => clampPercent(prev + 2));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setLeftPercent(defaultLeftPercent);
    }
  };

  return (
    <div className={cn('w-full h-full flex flex-col min-h-0', className)}>
      {/* Responsive Mobile/Tablet Segmented Pane Switcher (< lg) */}
      <div className="lg:hidden flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Workspace view switcher"
          className="grid grid-cols-2 w-full p-1 rounded-xl bg-slate-950/90 border border-slate-800"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileActivePane === 'left'}
            onClick={() => setMobileActivePane('left')}
            className={cn(
              'py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer',
              mobileActivePane === 'left'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {leftLabel}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileActivePane === 'right'}
            onClick={() => setMobileActivePane('right')}
            className={cn(
              'py-1.5 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer',
              mobileActivePane === 'right'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
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
          style={
            !isLeftCollapsed
              ? { '--split-left-width': `${leftPercent}%` }
              : undefined
          }
          className={cn(
            'min-h-0 overflow-y-auto bg-slate-950/40',
            'lg:shrink-0',
            isLeftCollapsed
              ? 'hidden'
              : mobileActivePane === 'left'
                ? 'flex-1 lg:flex-none lg:w-[var(--split-left-width)]'
                : 'hidden lg:block lg:w-[var(--split-left-width)]',
            leftClassName
          )}
        >
          {left}
        </section>

        {/* Desktop Draggable Divider Handle */}
        <div className="hidden lg:flex relative items-center justify-center shrink-0 w-3 bg-slate-950 border-x border-slate-800/80 group">
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Resize problem and workspace panes"
            aria-valuemin={minLeftPercent}
            aria-valuemax={maxLeftPercent}
            aria-valuenow={Math.round(leftPercent)}
            onPointerDown={(e) => {
              e.preventDefault();
              setIsLeftCollapsed(false);
              setIsDragging(true);
            }}
            onDoubleClick={() => {
              setIsLeftCollapsed(false);
              setLeftPercent(defaultLeftPercent);
            }}
            onKeyDown={handleDividerKeyDown}
            title="Drag to resize • Double-click to reset"
            className={cn(
              'w-full h-full flex items-center justify-center cursor-col-resize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
              isDragging
                ? 'bg-indigo-600/25 text-indigo-300'
                : 'hover:bg-indigo-500/15 text-slate-600 hover:text-indigo-400'
            )}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Floating Collapse/Reset Controls */}
          <div className="absolute top-3 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setIsLeftCollapsed((prev) => !prev)}
              title={isLeftCollapsed ? `Show ${leftLabel}` : `Maximize ${rightLabel}`}
              aria-label={isLeftCollapsed ? `Show ${leftLabel}` : `Maximize ${rightLabel}`}
              className="p-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 shadow-lg cursor-pointer"
            >
              {isLeftCollapsed ? (
                <PanelLeftOpen className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftClose className="w-3.5 h-3.5" />
              )}
            </button>
            {leftPercent !== defaultLeftPercent && !isLeftCollapsed && (
              <button
                type="button"
                onClick={() => setLeftPercent(defaultLeftPercent)}
                title="Reset split width"
                aria-label="Reset split width"
                className="p-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Pane */}
        <section
          aria-label={rightLabel}
          className={cn(
            'flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden bg-[#0B0F19]',
            mobileActivePane === 'right' ? 'flex' : 'hidden lg:flex',
            rightClassName
          )}
        >
          {isLeftCollapsed && (
            <div className="hidden lg:flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
              <span>{leftLabel} collapsed for full-width workspace</span>
              <button
                type="button"
                onClick={() => setIsLeftCollapsed(false)}
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
                Restore Split View
              </button>
            </div>
          )}
          {right}
        </section>
      </div>
    </div>
  );
}
