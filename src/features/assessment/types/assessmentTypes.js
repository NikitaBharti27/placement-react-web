/**
 * PlacePrep Secure - Assessment Domain Types & Constants (Phase 2)
 * Aligns with Backend Prisma QuestionType Enum & Multi-Format Evaluation Pipeline
 */

export const QUESTION_TYPES = {
  MCQ: 'MCQ',
  SIMULATION: 'SIMULATION',
  UI_TASK: 'UI_TASK',
  SQL_TASK: 'SQL_TASK',
  GAMIFIED: 'GAMIFIED',
};

export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};

export const SUBMISSION_PIPELINE_STATES = {
  IDLE: 'IDLE',
  QUEUED: 'QUEUED',       // Dispatched to Upstash QStash
  RUNNING: 'RUNNING',     // Executing in Ephemeral Sandbox / Worker
  EVALUATED: 'EVALUATED', // Authoritative result returned
  FAILED: 'FAILED',       // Moved to DLQ or validation error
};

export const QUESTION_STATUS = {
  UNVISITED: 'UNVISITED',
  CURRENT: 'CURRENT',
  ANSWERED: 'ANSWERED',
  FLAGGED: 'FLAGGED',
  ANSWERED_AND_FLAGGED: 'ANSWERED_AND_FLAGGED',
};

export const QUESTION_TYPE_META = {
  [QUESTION_TYPES.MCQ]: {
    label: 'Multiple Choice',
    shortLabel: 'MCQ',
    badgeVariant: 'info',
    workspaceLabel: 'Option Selection',
  },
  [QUESTION_TYPES.SIMULATION]: {
    label: 'Simulation Coding',
    shortLabel: 'SIM',
    badgeVariant: 'primary',
    workspaceLabel: 'Code Workspace',
  },
  [QUESTION_TYPES.SQL_TASK]: {
    label: 'SQL Query Task',
    shortLabel: 'SQL',
    badgeVariant: 'secondary',
    workspaceLabel: 'SQL Query Editor',
  },
  [QUESTION_TYPES.UI_TASK]: {
    label: 'UI Modification Task',
    shortLabel: 'UI',
    badgeVariant: 'warning',
    workspaceLabel: 'UI Workbench & Preview',
  },
  [QUESTION_TYPES.GAMIFIED]: {
    label: 'Gamified Cognitive',
    shortLabel: 'GAME',
    badgeVariant: 'success',
    workspaceLabel: 'Cognitive Arena',
  },
};

export const SUPPORTED_LANGUAGES = [
  { id: 'python', label: 'Python 3.11', filename: 'solution.py', monacoLanguage: 'python' },
  { id: 'javascript', label: 'Node.js 20', filename: 'solution.js', monacoLanguage: 'javascript' },
  { id: 'cpp', label: 'C++ 17', filename: 'solution.cpp', monacoLanguage: 'cpp' },
  { id: 'java', label: 'Java 17', filename: 'Solution.java', monacoLanguage: 'java' },
];

export const DIFFICULTY_BADGE_MAP = {
  [DIFFICULTY_LEVELS.EASY]: { label: 'Easy', variant: 'success' },
  [DIFFICULTY_LEVELS.MEDIUM]: { label: 'Medium', variant: 'warning' },
  [DIFFICULTY_LEVELS.HARD]: { label: 'Hard', variant: 'danger' },
};
