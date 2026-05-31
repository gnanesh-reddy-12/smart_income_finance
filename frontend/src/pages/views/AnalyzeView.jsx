import { useState } from 'react'
import { analyzeFinances } from '../../services/api'
import { saveAnalysis } from '../../utils/financeHelpers'

const INITIAL_FORM = {
  income: '',
  rent: '0',
  food: '0',
  transport: '0',
  subscriptions: '0',
  shopping: '0',
  others: '0',
}

export default function AnalyzeView({ onAnalysisComplete }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      income: Number(form.income || 0),
      rent: Number(form.rent || 0),
      food: Number(form.food || 0),
      transport: Number(form.transport || 0),
      subscriptions: Number(form.subscriptions || 0),
      shopping: Number(form.shopping || 0),
      others: Number(form.others || 0),
    }

    try {
      const data = await analyzeFinances(payload)
      saveAnalysis(data)
      onAnalysisComplete(data, 'overview')
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      setError(err.response?.data?.error || err.message || 'Failed to analyze finances.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="dashboard-view is-visible">
      <article className="panel-card">
        <header className="panel-card__header">
          <h2 className="panel-card__title">Monthly inputs</h2>
          <p className="panel-card__desc">Enter income and expenses in INR</p>
        </header>
        <div className="panel-card__body">
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="expense-form__grid">
              {[
                ['income', 'Income', true],
                ['rent', 'Rent', false],
                ['food', 'Food', false],
                ['transport', 'Transport', false],
                ['subscriptions', 'Subscriptions', false],
                ['shopping', 'Shopping', false],
                ['others', 'Others', false],
              ].map(([name, label, required]) => (
                <label key={name} className="form-field">
                  <span className="form-field__label">{label}</span>
                  <input
                    className="form-field__input"
                    type="number"
                    min="0"
                    step="100"
                    required={required}
                    placeholder="0"
                    value={form[name]}
                    onChange={(e) => updateField(name, e.target.value)}
                  />
                </label>
              ))}
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="button button--primary" disabled={loading}>
              {loading ? 'Analyzing…' : 'Analyze finances'}
            </button>
          </form>
        </div>
      </article>
    </section>
  )
}
