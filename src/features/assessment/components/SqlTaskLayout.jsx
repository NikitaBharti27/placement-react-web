import { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { QuestionMetaHeader } from './QuestionMetaHeader';
import { cn } from '../../../utils/cn';
import { ChevronDown, ChevronRight, Database, KeyRound, Table2 } from 'lucide-react';

/**
 * SqlTaskLayout - Left-pane prompt and PostgreSQL schema explorer for SQL Tasks.
 */
export function SqlTaskLayout({
  question,
  questionNumber,
  totalQuestions,
}) {
  const [expandedTables, setExpandedTables] = useState(() => {
    const map = {};
    (question?.schemas || []).forEach((s) => {
      map[s.tableName] = true;
    });
    return map;
  });

  if (!question) return null;

  const toggleTable = (tableName) => {
    setExpandedTables((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  return (
    <div className="p-5 sm:p-6 space-y-5 text-left">
      <QuestionMetaHeader
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />

      {/* Task Prompt */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300">
            <Database className="w-3.5 h-3.5" />
            Query Objective
          </span>
          <Badge variant="secondary" size="sm">
            PostgreSQL 16
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {question.prompt}
        </p>

        {question.expectedColumns?.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">
              Expected Result Columns
            </span>
            <div className="flex flex-wrap gap-1.5">
              {question.expectedColumns.map((col) => (
                <code
                  key={col}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300"
                >
                  {col}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Schema Explorer */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Database Schema & Sample Rows
        </h3>

        {(question.schemas || []).map((schema) => {
          const isExpanded = Boolean(expandedTables[schema.tableName]);
          const colNames = schema.columns.map((c) => c.name);

          return (
            <div
              key={schema.tableName}
              className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleTable(schema.tableName)}
                className="w-full px-4 py-3 flex items-center justify-between gap-2 bg-slate-900 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Table2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-mono text-xs font-bold text-white">
                    {schema.tableName}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                    — {schema.description}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="p-3.5 space-y-3 border-t border-slate-800/80">
                  {/* Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {schema.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {col.key && (
                            <span
                              className={cn(
                                'px-1 py-0.2 rounded text-[9px] font-bold',
                                col.key === 'PK'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                                  : col.key === 'FK'
                                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/50'
                                    : 'bg-slate-800 text-slate-300'
                              )}
                            >
                              {col.key === 'PK' && (
                                <KeyRound className="w-2.5 h-2.5 inline mr-0.5" />
                              )}
                              {col.key}
                            </span>
                          )}
                          <span className="text-slate-200 truncate">{col.name}</span>
                        </div>
                        <span className="text-slate-500 shrink-0">{col.type}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sample Data Rows */}
                  {schema.sampleRows?.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-left border-collapse text-[11px] font-mono">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            {colNames.map((name) => (
                              <th key={name} className="px-2.5 py-1.5 font-medium whitespace-nowrap">
                                {name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {schema.sampleRows.map((row, rowIdx) => (
                            <tr
                              key={rowIdx}
                              className="border-b border-slate-800/50 last:border-b-0 bg-slate-900/40"
                            >
                              {colNames.map((name) => (
                                <td
                                  key={name}
                                  className="px-2.5 py-1.5 text-slate-300 whitespace-nowrap"
                                >
                                  {String(row[name] ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
