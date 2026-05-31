import ExpenseDoughnutChart from '../../components/charts/ExpenseDoughnutChart'
import { formatInr } from '../../utils/currencyFormatter'
import { scoreClass, scoreLabel } from '../../utils/financeHelpers'

export default function OverviewView({ analysis, onNavigate }) {
  const hasData = Boolean(analysis)
  const heroClass = hasData
    ? `stat-card stat-card--hero ${scoreClass(analysis.health_score)}`
    : 'stat-card stat-card--hero'

  const chartLabels = analysis?.breakdown?.map((x) => x.label) ?? []
  const chartAmounts = analysis?.breakdown?.map((x) => x.amount) ?? []

  return (
    <section className="dashboard-view is-visible">
      <div className="stat-cards">
        <article className={heroClass}>
          <p className="stat-card__label">Financial health</p>
          <p className="stat-card__value">
            {hasData ? `${analysis.health_score} / 100` : '—'}
          </p>
          <p className="stat-card__meta">
            {hasData
              ? scoreLabel(analysis.health_score)
              : 'Run an analysis to see your score'}
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Monthly income</p>
          <p className="stat-card__value">
            {hasData ? formatInr(analysis.income) : '—'}
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Total expenses</p>
          <p className="stat-card__value">
            {hasData ? formatInr(analysis.total_expenses) : '—'}
          </p>
        </article>
        <article className="stat-card stat-card--accent">
          <p className="stat-card__label">Savings</p>
          <p className="stat-card__value">
            {hasData ? formatInr(analysis.savings) : '—'}
          </p>
          {hasData && (
            <p className="stat-card__meta">{analysis.savings_rate}% of income saved</p>
          )}
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel-card panel-card--chart">
          <header className="panel-card__header">
            <h2 className="panel-card__title">Spending breakdown</h2>
            <p className="panel-card__desc">Where your money goes this month</p>
          </header>
          {!hasData ? (
            <div className="panel-card__body panel-card__body--center">
              <p className="empty-state">
                No chart yet. Complete an analysis to see your breakdown.
              </p>
            </div>
          ) : (
            <div className="panel-card__body">
              <ExpenseDoughnutChart labels={chartLabels} amounts={chartAmounts} />
            </div>
          )}
        </article>

        <article className="panel-card">
          <header className="panel-card__header">
            <h2 className="panel-card__title">Quick actions</h2>
          </header>
          <div className="panel-card__body">
            <button
              type="button"
              className="button button--primary button--full"
              onClick={() => onNavigate('analyze')}
            >
              Analyze this month
            </button>
            <button
              type="button"
              className="button button--secondary button--full"
              onClick={() => onNavigate('insights')}
            >
              View insights
            </button>
          </div>
        </article>
      </div>

      <article className="panel-card">
        <header className="panel-card__header">
          <h2 className="panel-card__title">History</h2>
          <p className="panel-card__desc">
            Past months will appear here once saved to the database
          </p>
        </header>
        <div className="panel-card__body">
          <p className="empty-state">
            No saved months yet. Your latest analysis is kept in this session until
            PostgreSQL is connected.
          </p>
        </div>
      </article>
    </section>
  )
}
