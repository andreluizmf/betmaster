import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import '../styles/ThemeToggle.css'

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <button className="btn-theme-toggle" onClick={toggleTheme} title={darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      <span>{darkMode ? 'Claro' : 'Escuro'}</span>
    </button>
  )
}

export default ThemeToggle
