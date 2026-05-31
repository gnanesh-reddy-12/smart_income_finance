export function scoreLabel(score) {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Needs attention'
  return 'Critical'
}

export function scoreClass(score) {
  if (score >= 85) return 'stat-card--score-excellent'
  if (score >= 70) return 'stat-card--score-good'
  if (score >= 50) return 'stat-card--score-warn'
  return 'stat-card--score-critical'
}

export const STORAGE_KEY = 'smart_finance_last_analysis'

export function loadSavedAnalysis() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveAnalysis(data) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, savedAt: new Date().toISOString() }),
    )
  } catch {
    /* ignore */
  }
}

export function clearSavedAnalysis() {
  sessionStorage.removeItem(STORAGE_KEY)
}
