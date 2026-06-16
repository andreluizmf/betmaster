import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  return useContext(ThemeContext)
}

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const salvo = localStorage.getItem('betmaster_tema')
    return salvo !== null ? JSON.parse(salvo) : true // dark por padrão
  })

  useEffect(() => {
    localStorage.setItem('betmaster_tema', JSON.stringify(darkMode))
    document.body.setAttribute('data-tema', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
