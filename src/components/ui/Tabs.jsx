import { createContext, useContext, useState } from 'react'
import { cn } from '../../utils/cn'

const TabsContext = createContext(null)

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultValue || '')
  const currentTab = value !== undefined ? value : activeTab

  const handleTabChange = (val) => {
    if (value === undefined) {
      setActiveTab(val)
    }
    if (onValueChange) {
      onValueChange(val)
    }
  }

  return (
    <TabsContext.Provider value={{ currentTab, handleTabChange }}>
      <div className={cn('w-full flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '' }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 gap-1',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  icon = null,
  disabled = false,
  className = '',
}) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used inside Tabs')

  const isActive = context.currentTab === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => context.handleTabChange(value)}
      className={cn(
        'flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        isActive
          ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
          : 'hover:text-slate-900 hover:bg-slate-200/60 text-slate-500',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export function TabsContent({ value, children, className = '' }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used inside Tabs')

  if (context.currentTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn('mt-3 focus-visible:outline-none animate-in fade-in', className)}
    >
      {children}
    </div>
  )
}

export default Tabs
