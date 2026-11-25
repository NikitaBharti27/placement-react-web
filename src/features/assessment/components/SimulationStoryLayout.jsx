import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { CodeBlock } from '../../../components/ui/CodeBlock';
import { Badge } from '../../../components/ui/Badge';
import { QuestionMetaHeader } from './QuestionMetaHeader';
import {
  BookOpen,
  CheckCircle2,
  Cpu,
  FileCode2,
  FlaskConical,
  Shield,
} from 'lucide-react';

/**
 * SimulationStoryLayout - Left-pane narrative and specification view for
 * story-based MNC coding simulations (paired with WorkspaceShell on the right).
 */
export function SimulationStoryLayout({
  question,
  questionNumber,
  totalQuestions,
}) {
  if (!question) return null;

  const execMeta = question.executionMeta || {
    timeLimitSec: 2,
    memoryLimitMb: 256,
    sandboxType: 'Isolated Docker Sandbox',
  };

  return (
    <div className="p-5 sm:p-6 space-y-5 text-left">
      <QuestionMetaHeader
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />

      {/* Sandbox Execution Constraints Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-300">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono">
          <Cpu className="w-3 h-3 text-cyan-400" />
          Time: &lt; {execMeta.timeLimitSec}s
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono">
          Mem: {execMeta.memoryLimitMb} MB
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-400 ml-auto">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>{execMeta.sandboxType}</span>
        </span>
      </div>

      {/* Tabbed Problem Breakdown */}
      <Tabs defaultValue="story">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="story" icon={<BookOpen className="w-3.5 h-3.5" />}>
            Story Brief
          </TabsTrigger>
          <TabsTrigger value="samples" icon={<FlaskConical className="w-3.5 h-3.5" />}>
            Samples ({question.sampleCases?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="rubric" icon={<FileCode2 className="w-3.5 h-3.5" />}>
            Constraints
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Story & I/O Specification */}
        <TabsContent value="story" className="space-y-4">
          {question.storyBrief && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/90 border border-indigo-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                  Real-World Engineering Scenario
                </span>
                <Badge variant="primary" size="sm">
                  Simulation
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {question.storyBrief}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Problem Requirement
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {question.problemStatement}
            </p>
          </div>

          {question.inputFormat?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-200">Input Format</h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {question.inputFormat.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {question.outputFormat?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-200">Output Format</h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {question.outputFormat.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Sample Test Cases */}
        <TabsContent value="samples" className="space-y-4">
          {(question.sampleCases || []).map((sample) => (
            <div
              key={sample.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-white">{sample.label}</h4>
                <Badge variant="neutral" size="sm">
                  Public Case
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <CodeBlock title="stdin" code={sample.input} compact />
                <CodeBlock title="Expected stdout" code={sample.output} compact />
              </div>

              {sample.explanation && (
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/70">
                  <strong className="text-slate-200">Walkthrough: </strong>
                  {sample.explanation}
                </p>
              )}
            </div>
          ))}
        </TabsContent>

        {/* Tab 3: Constraints & Evaluation Rubric */}
        <TabsContent value="rubric" className="space-y-4">
          {question.constraints?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Input Constraints
              </h4>
              <div className="flex flex-wrap gap-2">
                {question.constraints.map((c, idx) => (
                  <code
                    key={idx}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300"
                  >
                    {c}
                  </code>
                ))}
              </div>
            </div>
          )}

          {question.rubricPoints?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Evaluation Expectations
              </h4>
              <ul className="space-y-2">
                {question.rubricPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
