import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem('betmaster_user')
    return salvo ? JSON.parse(salvo) : null
  })

  const login = (usuario) => {
    setUser(usuario)
    localStorage.setItem('betmaster_user', JSON.stringify(usuario))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('betmaster_user')
  }

  const atualizarSaldo = (novoSaldo) => {
    const atualizado = { ...user, saldo: novoSaldo }
    setUser(atualizado)
    localStorage.setItem('betmaster_user', JSON.stringify(atualizado))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, atualizarSaldo }}>
      {children}
    </AuthContext.Provider>
  )
}
