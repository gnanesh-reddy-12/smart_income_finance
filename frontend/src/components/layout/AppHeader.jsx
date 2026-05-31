const VIEW_META = {
  overview: {
    title: 'Overview',
    subtitle: 'Your financial snapshot at a glance',
  },
  analyze: {
    title: 'Analyze month',
    subtitle: 'Enter income and expenses for this month',
  },
  insights: {
    title: 'Insights',
    subtitle: 'Charts and smart recommendations',
  },
}

export default function AppHeader({ activeView, onMenuToggle }) {
  const meta = VIEW_META[activeView] || VIEW_META.overview

  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__menu"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        ☰
      </button>
      <div className="app-header__titles">
        <h1 className="app-header__title">{meta.title}</h1>
        <p className="app-header__subtitle">{meta.subtitle}</p>
      </div>
    </header>
  )
}
