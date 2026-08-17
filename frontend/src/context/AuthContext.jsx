import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'))
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('jwt_user')
    return u ? JSON.parse(u) : null
  })

  const loginWithToken = (token, userData) => {
    localStorage.setItem('jwt_token', token)
    localStorage.setItem('jwt_user', JSON.stringify(userData))
    localStorage.setItem('sentinel_auth', userData.role?.toLowerCase() || 'user')
    setToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('jwt_user')
    localStorage.removeItem('sentinel_auth')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loginWithToken, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
