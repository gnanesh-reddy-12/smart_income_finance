import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../components/auth/AuthBrandPanel'
import { useAuth } from '../context/AuthContext'

const BRAND = {
  tagline: 'Track income, spending, and your financial health score in one place.',
  items: ['Expense breakdown chart', 'Health score 0–100', 'Actionable recommendations'],
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <AuthBrandPanel features={BRAND} />
        <section className="auth-layout__panel">
          <div className="auth-card">
            <h2>Welcome back</h2>
            <p className="auth-card__subtitle">Sign in to open your dashboard.</p>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label className="form-field">
                <span className="form-field__label">Email</span>
                <input
                  className="form-field__input"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="form-field">
                <span className="form-field__label">Password</span>
                <input
                  className="form-field__input"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="button button--primary button--full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className="auth-card__footer">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
