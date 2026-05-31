import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '../services/api'
import { clearSavedAnalysis } from '../utils/financeHelpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const data = await fetchCurrentUser()
      setUser(data)
      return data
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const login = useCallback(
    async (email, password) => {
      const data = await apiLogin(email, password)
      setUser(data.user)
      return data
    },
    [],
  )

  const register = useCallback(async (name, email, password) => {
    const data = await apiRegister(name, email, password)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    clearSavedAnalysis()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
