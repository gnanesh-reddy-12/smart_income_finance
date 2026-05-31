import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { id: 'overview', icon: '◉', label: 'Overview' },
  { id: 'analyze', icon: '＋', label: 'Analyze month' },
  { id: 'insights', icon: '✦', label: 'Insights' },
]

export default function AppSidebar({ activeView, onNavigate, open, onClose }) {
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside
      className={`app-sidebar${open ? ' is-open' : ''}`}
      id="app-sidebar"
      aria-label="Main navigation"
    >
      <a href="/dashboard" className="app-sidebar__brand" onClick={(e) => e.preventDefault()}>
        Smart Finance
      </a>
      <nav className="app-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`app-sidebar__link${activeView === item.id ? ' is-active' : ''}`}
            onClick={() => {
              onNavigate(item.id)
              onClose?.()
            }}
          >
            <span className="app-sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="app-sidebar__footer">
        <p className="app-sidebar__user">{user?.name || 'User'}</p>
        <button
          type="button"
          className="button button--ghost button--small button--full"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
