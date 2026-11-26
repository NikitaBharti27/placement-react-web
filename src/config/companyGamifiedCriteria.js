/**
 * Company-Specific Gamified Placement Criteria & Cognitive Round Registry
 *
 * Defines authentic MNC hiring patterns, eligibility cutoffs, scoring weights,
 * penalty policies, and per-game parameters for PlacePrep Secure Phase 3.
 */

export const GAME_TYPES = {
  PATH_FINDER: 'path-finder',
  BUBBLE_MATH: 'bubble-math',
  KEY_DOOR: 'key-door',
  GRID_MEMORY: 'grid-memory',
}

/**
 * Shared metadata catalog for all cognitive mini-games.
 * Keeps game titles, descriptions, topic tags, and accent tokens in one place.
 */
export const COGNITIVE_GAMES_META = {
  [GAME_TYPES.PATH_FINDER]: {
    id: GAME_TYPES.PATH_FINDER,
    title: 'Path Finder',
    shortTitle: 'Path Finder',
    subtitle: 'Tile Rotation & Deductive Routing',
    topicTag: 'Path-Finding & Deductive Logic',
    cognitiveDomain: 'Spatial & Deductive Reasoning',
    description:
      'Rotate conduit tiles on an N×N matrix to establish an unbroken route from Start (S) to End (E) in minimal moves.',
    badgeColor: 'indigo',
  },
  [GAME_TYPES.BUBBLE_MATH]: {
    id: GAME_TYPES.BUBBLE_MATH,
    title: 'Quick-Fire Bubble Math',
    shortTitle: 'Bubble Math',
    subtitle: 'Rapid Numerical Expression Ordering',
    topicTag: 'Numerical Agility',
    cognitiveDomain: 'Quantitative Processing Speed',
    description:
      'Evaluate three arithmetic, decimal, or fraction expressions and pop them strictly from Lowest to Highest before the timer expires.',
    badgeColor: 'amber',
  },
  [GAME_TYPES.KEY_DOOR]: {
    id: GAME_TYPES.KEY_DOOR,
    title: 'Key-Door Memory Maze',
    shortTitle: 'Memory Maze',
    subtitle: 'Obstacle Avoidance & Key Routing',
    topicTag: 'Constraint Navigation',
    cognitiveDomain: 'Working Memory & Planning',
    description:
      'Navigate the grid to collect the Key before unlocking the Exit Door. Colliding with walls or locked doors triggers a penalty reset.',
    badgeColor: 'emerald',
  },
  [GAME_TYPES.GRID_MEMORY]: {
    id: GAME_TYPES.GRID_MEMORY,
    title: 'Grid Memory',
    shortTitle: 'Grid Memory',
    subtitle: 'Spatial Pattern Recall Matrix',
    topicTag: 'Spatial Memory',
    cognitiveDomain: 'Visual-Spatial Working Memory',
    description:
      'Memorize the illuminated spatial pattern during the brief preview window, then accurately reconstruct every highlighted cell.',
    badgeColor: 'purple',
  },
}

/**
 * Company-specific placement criteria profiles.
 * Each profile directly controls round composition, grid difficulty, timers,
 * penalty deductions, and pass/tier evaluation thresholds.
 */
export const COMPANY_GAMIFIED_PROFILES = [
  {
    id: 'accenture',
    companyName: 'Accenture',
    shortCode: 'ACC',
    trackName: 'Accenture Cognitive & Technical Assessment',
    roleTarget: 'ASE / AASE (Associate Software Engineer)',
    packageBand: '₹4.5 – ₹6.5 LPA',
    theme: {
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-600 text-white',
      accentBorder: 'border-purple-300',
      ring: 'ring-purple-500/20',
      button: 'bg-purple-600 hover:bg-purple-500',
    },
    eligibility: {
      minCgpa: '6.5 CGPA / 60%',
      backlogsPolicy: '0 Active Backlogs',
      academicHistory: 'Min 60% in 10th, 12th & Graduation',
      branches: 'B.E. / B.Tech / MCA / M.Sc (CS/IT)',
    },
    criteria: {
      passingCutoff: 70,
      totalDurationMinutes: 18,
      weights: { accuracy: 55, speed: 25, efficiency: 20 },
      penaltyRule: {
        label: '-4 pts per failed path check, wrong tile click, or timeout',
        penaltyPerMistake: 4,
      },
      antiTamperRequired: true,
      highlights: [
        'Elimination round: Candidates must clear >= 70% composite cognitive cutoff to unlock Coding Round.',
        'Evaluates Spatial Memory (Grid Memory) alongside Deductive Routing (Path Finder) & Numerical Speed.',
        'Browser raw click telemetry is verified server-side to prevent timing or score tampering.',
      ],
    },
    rounds: [
      {
        stageNumber: 1,
        gameType: GAME_TYPES.GRID_MEMORY,
        title: 'Accenture Grid Memory Challenge',
        subtitle: 'Spatial Recall • 3 Adaptive Stages',
        weight: 35,
        config: {
          gridSize: 4,
          maxGridSize: 5,
          totalRounds: 3,
          initialTargets: 4,
          previewDurationMs: 2400,
          timeLimitSeconds: 120,
          penaltyPerMistake: 4,
        },
        instructions:
          'Observe the glowing indigo tiles for 2.4 seconds, then reproduce the exact spatial layout. Stage 3 expands to a 5×5 matrix.',
      },
      {
        stageNumber: 2,
        gameType: GAME_TYPES.PATH_FINDER,
        title: 'Accenture Conduit Path Finder',
        subtitle: 'Deductive Pipe Rotation • 4×4 Matrix',
        weight: 35,
        config: {
          gridSize: 4,
          allowSizeSwitch: false,
          timeLimitSeconds: 210,
          optimalMoveTarget: 18,
          penaltyPerMistake: 4,
        },
        instructions:
          'Rotate the conduit tiles to connect Start (S) at top-left to Exit (E) at bottom-right. Minimize redundant rotations and failed checks.',
      },
      {
        stageNumber: 3,
        gameType: GAME_TYPES.BUBBLE_MATH,
        title: 'Accenture Rapid Bubble Math',
        subtitle: 'Quantitative Ordering • 8 Sprints',
        weight: 30,
        config: {
          totalQuestions: 8,
          secondsPerQuestion: 15,
          penaltyPerMistake: 4,
        },
        instructions:
          'Evaluate 3 math bubbles per card and pop them strictly from Lowest to Highest value within 15 seconds per question.',
      },
    ],
  },
  {
    id: 'capgemini',
    companyName: 'Capgemini',
    shortCode: 'CAP',
    trackName: 'Capgemini Exceller Game-Based Aptitude',
    roleTarget: 'Senior Analyst (A4 / A4P)',
    packageBand: '₹4.25 – ₹7.5 LPA',
    theme: {
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-600 text-white',
      accentBorder: 'border-sky-300',
      ring: 'ring-sky-500/20',
      button: 'bg-sky-600 hover:bg-sky-500',
    },
    eligibility: {
      minCgpa: '6.0 CGPA / 60%',
      backlogsPolicy: '0 Active Backlogs',
      academicHistory: '60%+ in 10th, 12th & Diploma/UG (max 1 yr gap)',
      branches: 'All Circuit & CS/IT Branches',
    },
    criteria: {
      passingCutoff: 75,
      totalDurationMinutes: 20,
      weights: { accuracy: 45, speed: 25, efficiency: 30 },
      penaltyRule: {
        label: 'Maze wall collision resets avatar to start & deducts 6 efficiency pts',
        penaltyPerMistake: 6,
      },
      antiTamperRequired: true,
      highlights: [
        'Strict Capgemini Exceller adaptive progression: clearing levels unlocks larger 5×5 and 6×6 grids.',
        'Move efficiency carries 30% weightage — avoid brute-force clicks or wall collisions.',
        'Minimum 75% overall cognitive score required for A4P differential package shortlisting.',
      ],
    },
    rounds: [
      {
        stageNumber: 1,
        gameType: GAME_TYPES.KEY_DOOR,
        title: 'Capgemini Motion & Key-Door Maze',
        subtitle: 'Adaptive Grid Navigation • Levels 1–2',
        weight: 40,
        config: {
          startLevel: 1,
          totalLevels: 2,
          timeLimitSeconds: 180,
          penaltyPerMistake: 6,
        },
        instructions:
          'Collect the Key and reach the Door using Arrow keys or on-screen controls. Touching an obstacle wall resets your position to (0,0).',
      },
      {
        stageNumber: 2,
        gameType: GAME_TYPES.PATH_FINDER,
        title: 'Capgemini Deductive Grid Switch',
        subtitle: 'High-Density 5×5 Conduit Puzzle',
        weight: 35,
        config: {
          gridSize: 5,
          allowSizeSwitch: false,
          timeLimitSeconds: 240,
          optimalMoveTarget: 26,
          penaltyPerMistake: 6,
        },
        instructions:
          'Solve the 5×5 conduit routing grid by aligning tiles from S to E. Capgemini prioritizes low move counts.',
      },
      {
        stageNumber: 3,
        gameType: GAME_TYPES.GRID_MEMORY,
        title: 'Capgemini Spatial Matrix Recall',
        subtitle: 'High-Speed 2.0s Preview • 3 Stages',
        weight: 25,
        config: {
          gridSize: 4,
          maxGridSize: 5,
          totalRounds: 3,
          initialTargets: 5,
          previewDurationMs: 2000,
          timeLimitSeconds: 110,
          penaltyPerMistake: 6,
        },
        instructions:
          'Faster 2.0-second pattern flash window matching Capgemini Exceller recall rounds. Recall every highlighted cell accurately.',
      },
    ],
  },
  {
    id: 'tcs',
    companyName: 'TCS',
    shortCode: 'TCS',
    trackName: 'TCS NQT Cognitive & Numerical Agility',
    roleTarget: 'Ninja / Digital / Prime Cadre',
    packageBand: '₹3.36 – ₹9.0 LPA',
    theme: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      accentBorder: 'border-blue-300',
      ring: 'ring-blue-500/20',
      button: 'bg-blue-600 hover:bg-blue-500',
    },
    eligibility: {
      minCgpa: '6.0 CGPA / 60%',
      backlogsPolicy: 'Max 1 Pending Backlog (must clear before joining)',
      academicHistory: '60%+ throughout 10th, 12th, Diploma & UG',
      branches: 'All Engineering Streams',
    },
    criteria: {
      passingCutoff: 72,
      tiers: [
        { label: 'TCS Prime Eligible', minScore: 85, variant: 'success' },
        { label: 'TCS Digital Eligible', minScore: 72, variant: 'primary' },
        { label: 'TCS Ninja Eligible', minScore: 60, variant: 'info' },
      ],
      totalDurationMinutes: 15,
      weights: { accuracy: 70, speed: 20, efficiency: 10 },
      penaltyRule: {
        label: 'Zero credit on 12s timeout; -3 pts per out-of-order expression click',
        penaltyPerMistake: 3,
      },
      antiTamperRequired: true,
      highlights: [
        'Multi-tier shortlisting: >= 60% Ninja, >= 72% Digital, and >= 85% Prime interview track.',
        '70% weightage on numerical & logical precision with strict 12-second per-question clocks.',
        'Progresses rapidly into fractions and multi-step decimal mental arithmetic.',
      ],
    },
    rounds: [
      {
        stageNumber: 1,
        gameType: GAME_TYPES.BUBBLE_MATH,
        title: 'TCS NQT Numerical Speed Sprint',
        subtitle: '12 Progressive Questions • 12s Clock',
        weight: 60,
        config: {
          totalQuestions: 12,
          secondsPerQuestion: 12,
          penaltyPerMistake: 3,
        },
        instructions:
          'Fast-paced quantitative ordering with a tighter 12-second clock per question. Escalates from integers to fractions and decimals.',
      },
      {
        stageNumber: 2,
        gameType: GAME_TYPES.PATH_FINDER,
        title: 'TCS Logical Flow Path Finder',
        subtitle: '4×4 Network Routing Puzzle',
        weight: 40,
        config: {
          gridSize: 4,
          allowSizeSwitch: false,
          timeLimitSeconds: 180,
          optimalMoveTarget: 18,
          penaltyPerMistake: 3,
        },
        instructions:
          'Establish an optimal deterministic flow path across the 4×4 matrix within 3 minutes.',
      },
    ],
  },
  {
    id: 'infosys',
    companyName: 'Infosys',
    shortCode: 'INF',
    trackName: 'Infosys SP / DSE Algorithmic Puzzle Suite',
    roleTarget: 'Specialist Programmer / DSE',
    packageBand: '₹6.25 – ₹9.5 LPA',
    theme: {
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      iconBg: 'bg-cyan-600 text-white',
      accentBorder: 'border-cyan-300',
      ring: 'ring-cyan-500/20',
      button: 'bg-cyan-600 hover:bg-cyan-500',
    },
    eligibility: {
      minCgpa: '6.5 CGPA / 65%',
      backlogsPolicy: '0 Active Backlogs',
      academicHistory: '65%+ in Graduation; 60%+ in 10th & 12th',
      branches: 'CSE, IT, ECE, EEE & Allied Branches',
    },
    criteria: {
      passingCutoff: 68,
      totalDurationMinutes: 16,
      weights: { accuracy: 50, speed: 20, efficiency: 30 },
      penaltyRule: {
        label: '-5 pts per obstacle collision or false spatial selection',
        penaltyPerMistake: 5,
      },
      antiTamperRequired: true,
      highlights: [
        'Emphasizes algorithmic constraint satisfaction and minimal-step traversal.',
        'Starts directly on a 5×5 maze board to mirror Infosys SP puzzle complexity.',
        'Penalty-heavy scoring rewards careful look-ahead planning over rapid guessing.',
      ],
    },
    rounds: [
      {
        stageNumber: 1,
        gameType: GAME_TYPES.KEY_DOOR,
        title: 'Infosys Constraint Path Maze',
        subtitle: '5×5+ Spatial Planning • Levels 2–3',
        weight: 55,
        config: {
          startLevel: 2,
          totalLevels: 2,
          timeLimitSeconds: 200,
          penaltyPerMistake: 5,
        },
        instructions:
          'Starts on a dense 5×5 obstacle grid and scales to 6×6. Plan your full route to the Key and Door before stepping.',
      },
      {
        stageNumber: 2,
        gameType: GAME_TYPES.GRID_MEMORY,
        title: 'Infosys Symmetric Matrix Memory',
        subtitle: '5×5 Pattern Recall • 3 Stages',
        weight: 45,
        config: {
          gridSize: 5,
          maxGridSize: 5,
          totalRounds: 3,
          initialTargets: 5,
          previewDurationMs: 2200,
          timeLimitSeconds: 130,
          penaltyPerMistake: 5,
        },
        instructions:
          'Memorize 5 to 7 active nodes across a 5×5 matrix and reproduce them without false clicks.',
      },
    ],
  },
  {
    id: 'cognizant',
    companyName: 'Cognizant',
    shortCode: 'CTS',
    trackName: 'Cognizant GenC Next Cognitive Assessment',
    roleTarget: 'GenC / GenC Next Developer',
    packageBand: '₹4.0 – ₹6.75 LPA',
    theme: {
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-600 text-white',
      accentBorder: 'border-indigo-300',
      ring: 'ring-indigo-500/20',
      button: 'bg-indigo-600 hover:bg-indigo-500',
    },
    eligibility: {
      minCgpa: '6.0 CGPA / 60%',
      backlogsPolicy: 'No Standing Arrears',
      academicHistory: '60%+ in 10th, 12th, Diploma & UG',
      branches: 'All B.E. / B.Tech / M.E. / M.Tech / MCA',
    },
    criteria: {
      passingCutoff: 65,
      totalDurationMinutes: 18,
      weights: { accuracy: 50, speed: 30, efficiency: 20 },
      penaltyRule: {
        label: '-3 pts per wrong order, wall hit, or broken check',
        penaltyPerMistake: 3,
      },
      antiTamperRequired: true,
      highlights: [
        'Balanced 3-round cognitive screening across Logic, Quantitative Speed, and Maze Traversal.',
        '65% benchmark qualifies candidates for GenC Next technical interview track.',
        'Consistent performance across all 3 modules avoids single-topic bottlenecks.',
      ],
    },
    rounds: [
      {
        stageNumber: 1,
        gameType: GAME_TYPES.PATH_FINDER,
        title: 'Cognizant Quick Route Puzzle',
        subtitle: '3×3 Warmup Logic Grid',
        weight: 30,
        config: {
          gridSize: 3,
          allowSizeSwitch: false,
          timeLimitSeconds: 150,
          optimalMoveTarget: 10,
          penaltyPerMistake: 3,
        },
        instructions:
          'Connect Start (S) to End (E) on a compact 3×3 grid as quickly and cleanly as possible.',
      },
      {
        stageNumber: 2,
        gameType: GAME_TYPES.BUBBLE_MATH,
        title: 'Cognizant Quantitative Bubbles',
        subtitle: '10 Mixed Arithmetic Sprints',
        weight: 35,
        config: {
          totalQuestions: 10,
          secondsPerQuestion: 15,
          penaltyPerMistake: 3,
        },
        instructions:
          'Order three mathematical expressions from Lowest to Highest across 10 timed questions.',
      },
      {
        stageNumber: 3,
        gameType: GAME_TYPES.KEY_DOOR,
        title: 'Cognizant Key-Door Escape',
        subtitle: '4×4 Maze Navigation • 2 Levels',
        weight: 35,
        config: {
          startLevel: 1,
          totalLevels: 2,
          timeLimitSeconds: 180,
          penaltyPerMistake: 3,
        },
        instructions:
          'Collect the Key first, unlock the Door, and avoid walls to protect your efficiency score.',
      },
    ],
  },
]

export function getCompanyProfileById(companyId) {
  return (
    COMPANY_GAMIFIED_PROFILES.find((c) => c.id === companyId) ||
    COMPANY_GAMIFIED_PROFILES[0]
  )
}

export function getGameMeta(gameType) {
  return COGNITIVE_GAMES_META[gameType] || COGNITIVE_GAMES_META[GAME_TYPES.PATH_FINDER]
}

/**
 * Deterministic criteria-driven evaluator.
 * Computes composite score, component metrics, penalties, cutoff qualification,
 * company tier verdict, and weak cognitive sub-topic recommendations.
 */
export function evaluateCompanyCriteria(companyId, stageResults = [], rawEvents = []) {
  const company = getCompanyProfileById(companyId)
  const weights = company.criteria.weights
  const totalWeight = company.rounds.reduce((sum, r) => sum + r.weight, 0) || 100

  let weightedAccuracy = 0
  let weightedSpeed = 0
  let weightedEfficiency = 0
  let totalPenalties = 0
  const weakTopics = []
  const breakdown = []

  company.rounds.forEach((round, index) => {
    const result = stageResults.find((r) => r.stageNumber === round.stageNumber) || stageResults[index]
    const meta = getGameMeta(round.gameType)

    if (!result) {
      breakdown.push({
        stageNumber: round.stageNumber,
        gameType: round.gameType,
        title: round.title,
        topicTag: meta.topicTag,
        weight: round.weight,
        score: 0,
        accuracy: 0,
        speedScore: 0,
        efficiencyScore: 0,
        penalties: 0,
        completed: false,
      })
      weakTopics.push(meta.topicTag)
      return
    }

    const accuracy = clampScore(result.accuracy ?? result.score ?? 0)
    const speedScore = clampScore(result.speedScore ?? computeFallbackSpeed(result))
    const efficiencyScore = clampScore(result.efficiencyScore ?? accuracy)
    const mistakes = Number(result.mistakes || 0)
    const stagePenalty = mistakes * (company.criteria.penaltyRule?.penaltyPerMistake || 0)
    totalPenalties += stagePenalty

    const stageComposite = Math.max(
      0,
      Math.round(
        (accuracy * weights.accuracy +
          speedScore * weights.speed +
          efficiencyScore * weights.efficiency) /
          100 -
          stagePenalty
      )
    )

    const ratio = round.weight / totalWeight
    weightedAccuracy += accuracy * ratio
    weightedSpeed += speedScore * ratio
    weightedEfficiency += efficiencyScore * ratio

    if (stageComposite < company.criteria.passingCutoff) {
      weakTopics.push(meta.topicTag)
    }

    breakdown.push({
      stageNumber: round.stageNumber,
      gameType: round.gameType,
      title: round.title,
      topicTag: meta.topicTag,
      weight: round.weight,
      score: stageComposite,
      accuracy: Math.round(accuracy),
      speedScore: Math.round(speedScore),
      efficiencyScore: Math.round(efficiencyScore),
      penalties: stagePenalty,
      completed: Boolean(result.completed),
      summary: result.summary || '',
    })
  })

  const rawComposite =
    (weightedAccuracy * weights.accuracy +
      weightedSpeed * weights.speed +
      weightedEfficiency * weights.efficiency) /
    100

  const boundedPenalty = Math.min(30, Math.round(totalPenalties * 0.5))
  const finalScore = clampScore(Math.round(rawComposite - boundedPenalty))
  const qualified = finalScore >= company.criteria.passingCutoff

  let tierVerdict = qualified ? `${company.companyName} Cutoff Cleared` : 'Below Company Cutoff'
  let tierVariant = qualified ? 'success' : 'danger'

  if (company.criteria.tiers && company.criteria.tiers.length > 0) {
    const matchedTier = company.criteria.tiers.find((t) => finalScore >= t.minScore)
    if (matchedTier) {
      tierVerdict = matchedTier.label
      tierVariant = matchedTier.variant
    } else {
      tierVerdict = 'Did Not Meet Minimum Cadre Cutoff'
      tierVariant = 'danger'
    }
  }

  return {
    companyId: company.id,
    companyName: company.companyName,
    passingCutoff: company.criteria.passingCutoff,
    finalScore,
    qualified,
    tierVerdict,
    tierVariant,
    metrics: {
      accuracy: Math.round(weightedAccuracy),
      speedScore: Math.round(weightedSpeed),
      efficiencyScore: Math.round(weightedEfficiency),
      penaltyDeduction: boundedPenalty,
    },
    breakdown,
    weakTopics: [...new Set(weakTopics)],
    rawEventCount: rawEvents.length,
  }
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value) || 0))
}

function computeFallbackSpeed(result) {
  if (!result.timeLimitSeconds || result.timeUsedSeconds == null) return 75
  const ratioUsed = result.timeUsedSeconds / result.timeLimitSeconds
  return clampScore(Math.round((1 - ratioUsed * 0.65) * 100))
}
