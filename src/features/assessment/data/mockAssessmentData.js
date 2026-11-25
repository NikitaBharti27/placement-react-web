import { DIFFICULTY_LEVELS, QUESTION_TYPES } from '../types/assessmentTypes';

/**
 * Realistic multi-format mock assessment aligning with TCS NQT / Accenture / Capgemini
 * hiring patterns and Kaif's Phase 2 Question schema (`MCQ`, `SIMULATION`, `SQL_TASK`, `UI_TASK`).
 */
export const MOCK_ASSESSMENT = {
  id: 'asm-tcs-fullstack-2026',
  title: 'TCS NQT & Enterprise Full-Stack Assessment',
  companyTrack: 'TCS NQT Prep Track',
  durationSeconds: 45 * 60, // 45 minutes
  serverDeadlineIso: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
  totalMarks: 70,
  instructions:
    'This multi-format evaluation mirrors corporate hiring rounds: conceptual MCQs, a real-world simulation coding problem, a relational SQL aggregation query, and an embedded UI task.',
  questions: [
    {
      id: 'q-mcq-1',
      order: 1,
      type: QUESTION_TYPES.MCQ,
      title: 'Shortest Path Routing in Unweighted Campus Microservices',
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      marks: 5,
      topicTag: {
        subject: 'DSA',
        topic: 'Graphs & BFS',
      },
      allowMultiple: false,
      prompt:
        'A college placement portal models microservice dependencies as an unweighted directed graph with V vertices and E edges. You need to find the minimum number of network hops from the Auth Gateway to every downstream worker. Examine the traversal snippet below and choose the optimal strategy.',
      codeSnippet: {
        title: 'hop_router_snippet.py',
        language: 'python',
        code: `def min_hops(adj_list, source):
    queue = deque([(source, 0)])
    visited = {source}
    distances = {source: 0}

    while queue:
        node, dist = queue.popleft()
        for neighbor in adj_list[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                distances[neighbor] = dist + 1
                queue.append((neighbor, dist + 1))
    return distances`,
      },
      hint: 'Consider why each edge has an equal traversal cost of 1 hop.',
      options: [
        {
          id: 'opt-1a',
          label: 'A',
          text: 'Breadth-First Search (BFS) guarantees shortest hop distance in O(V + E) time without needing a priority queue.',
        },
        {
          id: 'opt-1b',
          label: 'B',
          text: 'Depth-First Search (DFS) with recursion always finds the shortest path in O(V + E) time.',
        },
        {
          id: 'opt-1c',
          label: 'C',
          text: 'Bellman-Ford must be used instead of BFS because directed graphs can contain cycles.',
        },
        {
          id: 'opt-1d',
          label: 'D',
          text: 'Floyd-Warshall is required whenever adjacency lists are used instead of matrices.',
        },
      ],
    },
    {
      id: 'q-mcq-2',
      order: 2,
      type: QUESTION_TYPES.MCQ,
      title: 'Transactional Outbox & Idempotent Queue Processing',
      difficulty: DIFFICULTY_LEVELS.HARD,
      marks: 10,
      topicTag: {
        subject: 'System Design',
        topic: 'Async Messaging',
      },
      allowMultiple: true,
      prompt:
        'When 1,000+ candidates submit code simultaneously, the Node.js Submission API uses PostgreSQL + Upstash QStash + Python workers. Select ALL architectural guarantees that prevent lost submissions and duplicate grading.',
      hint: 'Two options accurately describe the Transactional Outbox and Idempotency pattern.',
      options: [
        {
          id: 'opt-2a',
          label: 'A',
          text: 'Writing submission state and the outbox event inside the exact same PostgreSQL database transaction avoids dual-write inconsistencies.',
        },
        {
          id: 'opt-2b',
          label: 'B',
          text: 'Workers inspect a unique event_id in Redis/MongoDB to ignore duplicate at-least-once deliveries.',
        },
        {
          id: 'opt-2c',
          label: 'C',
          text: 'Using setTimeout inside the React frontend ensures submissions arrive sequentially on the backend.',
        },
        {
          id: 'opt-2d',
          label: 'D',
          text: 'Storing raw student code inside browser localStorage acts as a Dead Letter Queue (DLQ) if the API fails.',
        },
      ],
    },
    {
      id: 'q-sim-3',
      order: 3,
      type: QUESTION_TYPES.SIMULATION,
      title: 'FinEdge Gateway: Sliding Window Burst Rate Limiter',
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      marks: 25,
      topicTag: {
        subject: 'Algorithms',
        topic: 'Sliding Window',
      },
      executionMeta: {
        timeLimitSec: 2,
        memoryLimitMb: 256,
        sandboxType: 'Ephemeral Docker Sandbox (No Egress)',
      },
      storyBrief:
        'You are a backend engineer on FinEdge’s Campus Fee Payment Gateway. During peak placement registration, partner college servers burst API calls to `/v1/payments/verify`. To protect downstream ledger databases without dropping legitimate bursts unfairly, FinEdge enforces a strict sliding-window limit per tenant: at most K requests in any contiguous W-second interval `[t - W + 1, t]`.',
      problemStatement:
        'Given an integer K (max allowed requests per window), W (window width in seconds), and a sorted array of N incoming request timestamps (in seconds) for a single college tenant, determine for each request whether it should be ALLOWED (1) or THROTTLED (0). Note: Throttled requests are rejected immediately and do NOT count toward future sliding windows.',
      inputFormat: [
        'Line 1: Three space-separated integers N, K, W',
        'Line 2: N non-decreasing space-separated integers representing timestamps t[0..N-1]',
      ],
      outputFormat: [
        'A single line of N space-separated integers (1 for ALLOWED, 0 for THROTTLED).',
      ],
      constraints: [
        '1 <= N <= 10^5',
        '1 <= K <= N',
        '1 <= W <= 10^6',
        '0 <= t[i] <= 10^9 (sorted non-decreasing)',
      ],
      rubricPoints: [
        'O(N) two-pointer or deque sliding window achieves < 150ms in sandbox',
        'Throttled requests must not occupy quota in the active window',
        'Handle duplicate timestamps at the exact same second accurately',
      ],
      sampleCases: [
        {
          id: 'sc-1',
          label: 'Sample Case 1 — Burst at Boundary',
          input: '6 2 5\n1 2 3 6 7 8',
          output: '1 1 0 1 1 0',
          explanation:
            'At t=1 and t=2: allowed (window [1,2] size=2). At t=3: window [max(1,3-5+1)=1..3] already has 2 accepted requests -> throttled (0). At t=6: t=1 expired (since 6 - 5 + 1 = 2), only t=2 remains -> allowed (1). At t=7: t=2 expired -> allowed (1). At t=8: window [4..8] already holds [6,7] -> throttled (0).',
        },
        {
          id: 'sc-2',
          label: 'Sample Case 2 — Identical Timestamps',
          input: '4 2 10\n5 5 5 15',
          output: '1 1 0 1',
          explanation:
            'Two requests at t=5 pass; third at t=5 is throttled. At t=15, t=5 is outside [6..15], so t=15 is allowed.',
        },
      ],
      starterCode: {
        python: `from collections import deque
import sys

def evaluate_requests(n: int, k: int, w: int, timestamps: list[int]) -> list[int]:
    # TODO: Implement O(N) sliding window rate limiter
    # Hint: Evict timestamps < (ts - w + 1) from deque before checking len < k
    results = []
    return results

if __name__ == "__main__":
    data = sys.stdin.read().strip().split()
    if data:
        n, k, w = map(int, data[:3])
        ts = list(map(int, data[3:3 + n]))
        print(" ".join(map(str, evaluate_requests(n, k, w, ts))))`,
        javascript: `const fs = require('fs');

function evaluateRequests(n, k, w, timestamps) {
  // TODO: Implement O(N) sliding window rate limiter
  const results = [];
  return results;
}

const raw = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
if (raw[0]) {
  const [n, k, w] = raw.slice(0, 3).map(Number);
  const ts = raw.slice(3, 3 + n).map(Number);
  console.log(evaluateRequests(n, k, w, ts).join(' '));
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    long long w;
    if (!(cin >> n >> k >> w)) return 0;

    // TODO: Maintain sliding window deque of accepted timestamps
    return 0;
}`,
        java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int k = sc.nextInt();
        long w = sc.nextLong();

        // TODO: Implement sliding window rate limiter using ArrayDeque
    }
}`,
      },
    },
    {
      id: 'q-sql-4',
      order: 4,
      type: QUESTION_TYPES.SQL_TASK,
      title: 'Cross-Exam Topic Mastery Aggregation Query',
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      marks: 15,
      topicTag: {
        subject: 'Databases',
        topic: 'SQL Aggregations',
      },
      prompt:
        'The PlacePrep Teacher Heatmap relies on PostgreSQL aggregations across historical student attempts. Write a PostgreSQL query that computes each topic’s mastery percentage for student `STU-2026-042` (tenant `t-mit`), returning only topics where the student attempted at least 2 questions and scored below 60% mastery, ordered from lowest mastery to highest.',
      expectedColumns: ['subject', 'topic', 'total_attempts', 'correct_count', 'mastery_pct'],
      schemas: [
        {
          tableName: 'topic_tags',
          description: 'Master taxonomy of technical & cognitive sub-topics',
          columns: [
            { name: 'id', type: 'UUID', key: 'PK' },
            { name: 'subject', type: 'VARCHAR(64)', key: '' },
            { name: 'topic', type: 'VARCHAR(96)', key: '' },
          ],
          sampleRows: [
            { id: 'tt-101', subject: 'DSA', topic: 'Graphs' },
            { id: 'tt-102', subject: 'DSA', topic: 'Linked Lists' },
            { id: 'tt-103', subject: 'Databases', topic: 'SQL Joins' },
          ],
        },
        {
          tableName: 'assessment_results',
          description: 'Question-level correctness records partitioned by tenant_id',
          columns: [
            { name: 'id', type: 'UUID', key: 'PK' },
            { name: 'tenant_id', type: 'VARCHAR(32)', key: 'IDX' },
            { name: 'student_id', type: 'VARCHAR(32)', key: 'FK' },
            { name: 'topic_tag_id', type: 'UUID', key: 'FK' },
            { name: 'is_correct', type: 'BOOLEAN', key: '' },
            { name: 'submitted_at', type: 'TIMESTAMPTZ', key: '' },
          ],
          sampleRows: [
            {
              id: 'ar-01',
              tenant_id: 't-mit',
              student_id: 'STU-2026-042',
              topic_tag_id: 'tt-101',
              is_correct: 'false',
              submitted_at: '2026-10-12T10:14Z',
            },
            {
              id: 'ar-02',
              tenant_id: 't-mit',
              student_id: 'STU-2026-042',
              topic_tag_id: 'tt-101',
              is_correct: 'false',
              submitted_at: '2026-10-18T14:22Z',
            },
            {
              id: 'ar-03',
              tenant_id: 't-mit',
              student_id: 'STU-2026-042',
              topic_tag_id: 'tt-102',
              is_correct: 'true',
              submitted_at: '2026-10-19T09:05Z',
            },
          ],
        },
      ],
      starterQuery: `-- Write your PostgreSQL aggregation query below
-- Join assessment_results (r) with topic_tags (t)
-- Filter tenant_id = 't-mit' and student_id = 'STU-2026-042'
SELECT
  t.subject,
  t.topic
FROM assessment_results r
JOIN topic_tags t ON t.id = r.topic_tag_id;`,
      mockQueryOutput: {
        columns: ['subject', 'topic', 'total_attempts', 'correct_count', 'mastery_pct'],
        rows: [
          ['DSA', 'Graphs', 5, 1, '20.0%'],
          ['Databases', 'SQL Joins', 4, 1, '25.0%'],
          ['DSA', 'Linked Lists', 3, 1, '33.3%'],
        ],
      },
    },
    {
      id: 'q-ui-5',
      order: 5,
      type: QUESTION_TYPES.UI_TASK,
      title: 'Refactor Candidate Readiness Card for Accessibility & Hierarchy',
      difficulty: DIFFICULTY_LEVELS.EASY,
      marks: 15,
      topicTag: {
        subject: 'Frontend UI',
        topic: 'Tailwind & Accessibility',
      },
      prompt:
        'Your team inherited a cluttered Candidate Readiness Card used in the placement portal. Update the Tailwind utility layout and component markup so it uses a clear visual hierarchy, high-contrast status badge, accessible progress bar (`role="progressbar"`), and an actionable primary CTA.',
      acceptanceCriteria: [
        {
          id: 'ac-1',
          label: 'Use dark slate glass surface (`bg-slate-900/90 border-slate-800`) with rounded-2xl framing',
          keywordMatch: 'bg-slate-900',
        },
        {
          id: 'ac-2',
          label: 'Include semantic status badge (`Verified` / `Ready`) with emerald contrast styling',
          keywordMatch: 'emerald',
        },
        {
          id: 'ac-3',
          label: 'Render an accessible readiness bar (`role="progressbar"`) with clear percentage label',
          keywordMatch: 'progressbar',
        },
        {
          id: 'ac-4',
          label: 'Provide a clear indigo primary action button (`Start Track`)',
          keywordMatch: 'indigo',
        },
      ],
      designTokensHint: [
        'Surface: #111625 / bg-slate-900/90',
        'Accent: #6366F1 / indigo-500',
        'Success: #10B981 / emerald-400',
      ],
      starterCode: `<div className="p-4 bg-slate-800 border border-slate-700 rounded-md space-y-3">
  <div>
    <h4 className="text-sm font-bold">TCS NQT Readiness</h4>
    <p className="text-xs text-slate-400">Cohort: CSE Final Year</p>
  </div>

  {/* TODO: Upgrade container to bg-slate-900/90 rounded-2xl */}
  {/* TODO: Add emerald Track Ready status badge */}
  {/* TODO: Add accessible role="progressbar" readiness bar */}
  {/* TODO: Style CTA button with indigo primary classes */}
  <button className="px-3 py-1.5 bg-slate-600 text-xs text-white rounded">
    Start Track
  </button>
</div>`,
    },
  ],
};
