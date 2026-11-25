/**
 * PlacePrep Secure - Design Tokens & Theme Specification
 * Senior UI/UX Architect: Muwahid
 */

export const designTokens = {
  colors: {
    canvas: {
      default: '#0A0D14',
      subtle: '#0F1420',
      elevated: '#141B2D',
    },
    surface: {
      card: '#111625',
      cardHover: '#171F33',
      input: '#0D121F',
      inputBorder: '#1E293B',
      inputFocus: '#6366F1',
    },
    brand: {
      primary: '#6366F1', // Indigo 500
      primaryHover: '#4F46E5', // Indigo 600
      secondary: '#9333EA', // Purple 600
      accent: '#06B6D4', // Cyan 500
      gradient: 'from-indigo-500 via-purple-500 to-cyan-400',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      accent: '#818CF8',
    },
    border: {
      subtle: '#1E293B',
      default: '#334155',
      accent: '#4338CA',
    },
  },
  typography: {
    fontSans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  elevation: {
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
    cardGlow: '0 0 40px -10px rgba(99, 102, 241, 0.25)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
  },
};
