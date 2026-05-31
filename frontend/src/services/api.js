import axios from 'axios'

export const api = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchCurrentUser() {
  const { data } = await api.get('/api/users/me')
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

export async function register(name, email, password) {
  const { data } = await api.post('/api/auth/register', { name, email, password })
  return data
}

export async function logout() {
  const { data } = await api.post('/api/auth/logout')
  return data
}

export async function analyzeFinances(payload) {
  const { data } = await api.post('/api/analyze', payload)
  return data
}
