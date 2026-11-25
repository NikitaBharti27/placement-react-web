import { useState } from 'react'
import {
  Database,
  Play,
  Table as TableIcon,
  CheckCircle,
  AlertTriangle,
  Key,
} from 'lucide-react'
import MonacoCodeEditor from '../editor/MonacoCodeEditor'

/**
 * SQL Task Workspace
 * Features:
 * - Interactive Schema Explorer (Tables, Columns, Primary/Foreign Keys, Sample Data)
 * - Monaco SQL Query Editor
 * - Live Query Execution Result Grid vs Expected Result Comparison
 */
export const SqlTaskWorkspace = ({
  question,
  answer,
  executionState,
  onAnswerChange,
  onRunSql,
  assessmentId,
}) => {
  const currentQuery = answer?.query || question.starterQuery || ''
  const [selectedTable, setSelectedTable] = useState(
    question.schema?.[0]?.tableName || 'employees'
  )
  const [activeResultView, setActiveResultView] = useState('your_output') // 'your_output' | 'expected'

  const isRunning = executionState?.isRunning || false
  const sqlResult = executionState?.sqlResult || null
  const error = executionState?.error || null

  const handleQueryChange = (newQuery) => {
    onAnswerChange({ query: newQuery })
  }

  const handleResetQuery = () => {
    onAnswerChange({ query: question.starterQuery || '' })
  }

  const handleExecute = () => {
    if (onRunSql) {
      onRunSql({
        assessmentId,
        questionId: question.id,
        query: currentQuery,
      })
    }
  }

  const currentTableSchema = question.schema?.find((t) => t.tableName === selectedTable)
  const currentTableSampleRows = question.sampleData?.[selectedTable] || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden bg-slate-100">
      {/* Left Column: Problem, Schema Inspector & Sample Rows (5 Cols) */}
      <div className="lg:col-span-5 h-full overflow-y-auto p-4 sm:p-5 border-r border-slate-200 bg-white space-y-5">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-semibold rounded-lg text-xs">
              SQL Task
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

        {/* Problem Title & Statement */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">{question.title}</h2>
          <div className="text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70">
            {question.problemStatement}
          </div>
        </div>

        {/* Database Schema Explorer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Database Schema Inspector</span>
            </h3>
          </div>

          {/* Table Selector Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
            {question.schema?.map((t) => (
              <button
                key={t.tableName}
                type="button"
                onClick={() => setSelectedTable(t.tableName)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                  selectedTable === t.tableName
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>{t.tableName}</span>
              </button>
            ))}
          </div>

          {/* Active Table Columns */}
          {currentTableSchema && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                {currentTableSchema.description || `Table: ${currentTableSchema.tableName}`}
              </div>
              <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                {currentTableSchema.columns.map((col) => (
                  <div
                    key={col.name}
                    className="px-3 py-1.5 flex items-center justify-between text-xs font-mono bg-white"
                  >
                    <div className="flex items-center space-x-2">
                      {col.isPk && (
                        <span title="Primary Key">
                          <Key className="w-3 h-3 text-amber-500" />
                        </span>
                      )}
                      <span className="font-semibold text-slate-800">{col.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Tuples / Rows */}
          {currentTableSampleRows.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Sample Tuples ({selectedTable})
              </span>
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase">
                    <tr>
                      {Object.keys(currentTableSampleRows[0]).map((k) => (
                        <th key={k} className="p-2 font-semibold">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentTableSampleRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="p-2 text-slate-700">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Monaco SQL Editor & Execution Result Grid (7 Cols) */}
      <div className="lg:col-span-7 h-full flex flex-col p-3 sm:p-4 bg-slate-900 gap-3 overflow-hidden">
        {/* Monaco SQL Editor */}
        <div className="flex-1 min-h-[350px] relative">
          <MonacoCodeEditor
            language="sql"
            value={currentQuery}
            onChange={handleQueryChange}
            onResetBoilerplate={handleResetQuery}
            availableLanguages={['sql']}
            headerExtra={
              <button
                type="button"
                onClick={handleExecute}
                disabled={isRunning}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                {isRunning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Query...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute Query</span>
                  </>
                )}
              </button>
            }
          />
        </div>

        {/* SQL Results Drawer */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col max-h-[260px]">
          {/* Drawer Header */}
          <div className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">Query Result Grid</span>
              {sqlResult?.matchesExpected && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Output Matches Expected
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveResultView('your_output')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  activeResultView === 'your_output'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Your Output
              </button>
              <button
                type="button"
                onClick={() => setActiveResultView('expected')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  activeResultView === 'expected'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expected Output
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="p-3 text-xs font-mono overflow-y-auto">
            {error ? (
              <div className="text-rose-400 bg-rose-950/40 p-3 rounded-lg border border-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : activeResultView === 'expected' ? (
              <div>
                <table className="w-full text-left text-xs font-mono border border-slate-800">
                  <thead className="bg-slate-900 text-cyan-300 text-[11px] uppercase">
                    <tr>
                      {question.expectedResult?.columns?.map((col) => (
                        <th key={col} className="p-2 border-b border-slate-800">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {question.expectedResult?.rows?.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        {question.expectedResult.columns.map((col) => (
                          <td key={col} className="p-2">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : sqlResult?.rows && sqlResult.rows.length > 0 ? (
              <div>
                <table className="w-full text-left text-xs font-mono border border-slate-800">
                  <thead className="bg-slate-900 text-emerald-300 text-[11px] uppercase">
                    <tr>
                      {sqlResult.columns?.map((col) => (
                        <th key={col} className="p-2 border-b border-slate-800">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {sqlResult.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        {sqlResult.columns.map((col) => (
                          <td key={col} className="p-2">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-slate-500 py-4 text-center">
                Query has not been executed yet. Click &quot;Execute Query&quot; to test your SQL against test database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SqlTaskWorkspace
