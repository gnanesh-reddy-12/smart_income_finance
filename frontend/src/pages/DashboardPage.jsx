import { useState } from 'react'
import AppHeader from '../components/layout/AppHeader'
import AppSidebar from '../components/layout/AppSidebar'
import { loadSavedAnalysis } from '../utils/financeHelpers'
import AnalyzeView from './views/AnalyzeView'
import InsightsView from './views/InsightsView'
import OverviewView from './views/OverviewView'

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [analysis, setAnalysis] = useState(() => loadSavedAnalysis())

  function handleAnalysisComplete(data, goToView = 'overview') {
    setAnalysis(data)
    setActiveView(goToView)
  }

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <AppSidebar
          activeView={activeView}
          onNavigate={setActiveView}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="app-main">
          <AppHeader
            activeView={activeView}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
          />
          <div className="app-content">
            {activeView === 'overview' && (
              <OverviewView analysis={analysis} onNavigate={setActiveView} />
            )}
            {activeView === 'analyze' && (
              <AnalyzeView onAnalysisComplete={handleAnalysisComplete} />
            )}
            {activeView === 'insights' && <InsightsView analysis={analysis} />}
          </div>
        </div>
      </div>
    </div>
  )
}
