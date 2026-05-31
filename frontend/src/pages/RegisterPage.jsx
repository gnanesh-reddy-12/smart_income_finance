import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../components/auth/AuthBrandPanel'
import { useAuth } from '../context/AuthContext'

const BRAND = {
  tagline: 'Create your account and start analyzing your monthly finances.',
  items: ['Private workspace per user', 'Track spending with charts', 'Smart recommendations'],
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
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
            <h2>Create account</h2>
            <p className="auth-card__subtitle">Your finance data stays on your account.</p>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label className="form-field">
                <span className="form-field__label">Full name</span>
                <input
                  className="form-field__input"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
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
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="form-field">
                <span className="form-field__label">Confirm password</span>
                <input
                  className="form-field__input"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="button button--primary button--full" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <p className="auth-card__footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
