import ExpenseDoughnutChart from '../../components/charts/ExpenseDoughnutChart'
import CategoryBars from '../../components/dashboard/CategoryBars'
import InsightCards from '../../components/dashboard/InsightCards'

export default function InsightsView({ analysis }) {
  const hasData = Boolean(analysis)

  if (!hasData) {
    return (
      <section className="dashboard-view is-visible">
        <div className="dashboard-grid">
          <article className="panel-card">
            <div className="panel-card__body">
              <p className="empty-state">
                No insights yet. Go to <strong>Analyze month</strong> and run your first
                analysis.
              </p>
            </div>
          </article>
        </div>
      </section>
    )
  }

  const chartLabels = analysis.breakdown.map((x) => x.label)
  const chartAmounts = analysis.breakdown.map((x) => x.amount)

  return (
    <section className="dashboard-view is-visible">
      <div className="stat-cards stat-cards--compact">
        <article className="stat-card">
          <p className="stat-card__label">Health score</p>
          <p className="stat-card__value">{analysis.health_score} / 100</p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Savings rate</p>
          <p className="stat-card__value">{analysis.savings_rate}%</p>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel-card panel-card--chart">
          <header className="panel-card__header">
            <h2 className="panel-card__title">Expense distribution</h2>
          </header>
          <div className="panel-card__body panel-card__body--center">
            <ExpenseDoughnutChart labels={chartLabels} amounts={chartAmounts} height={240} />
          </div>
        </article>

        <article className="panel-card">
          <header className="panel-card__header">
            <h2 className="panel-card__title">Category share</h2>
          </header>
          <div className="panel-card__body">
            <CategoryBars breakdown={analysis.breakdown} />
          </div>
        </article>
      </div>

      <article className="panel-card">
        <header className="panel-card__header">
          <h2 className="panel-card__title">Smart recommendations</h2>
          <p className="panel-card__desc">Personalized tips based on your spending</p>
        </header>
        <div className="panel-card__body">
          <InsightCards suggestions={analysis.suggestions} />
        </div>
      </article>
    </section>
  )
}
