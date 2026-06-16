import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, LayoutDashboard, CalendarDays, History, Receipt, Trophy } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import '../styles/Navbar.css'

function NavbarUsuario() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar-betmaster navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand betmaster-brand" to="/usuario/dashboard">
          BETMASTER
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navUsuario"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navUsuario">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/usuario/dashboard">
                <LayoutDashboard size={16} className="me-1" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuario/eventos">
                <CalendarDays size={16} className="me-1" />
                Eventos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuario/historico">
                <History size={16} className="me-1" />
                Histórico
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuario/extrato">
                <Receipt size={16} className="me-1" />
                Extrato
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/usuario/ranking">
                <Trophy size={16} className="me-1" />
                Ranking
              </Link>
            </li>
          </ul>

          <div className="navbar-user d-flex align-items-center gap-3">
            <span className="navbar-nome">Olá, {user?.nome}</span>
            <span className="navbar-saldo">
              R$ {Number(user?.saldo || 0).toFixed(2)}
            </span>
            <ThemeToggle />
            <button className="btn btn-logout" onClick={handleLogout}>
              <LogOut size={16} className="me-1" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarUsuario
