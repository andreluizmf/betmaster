import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, LayoutDashboard, CalendarDays, Trophy } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import '../styles/Navbar.css'

function NavbarAdmin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar-betmaster navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand betmaster-brand" to="/admin/dashboard">
          BETMASTER
          <span className="badge-admin ms-2">Admin</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navAdmin"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navAdmin">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                <LayoutDashboard size={16} className="me-1" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/eventos">
                <CalendarDays size={16} className="me-1" />
                Eventos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/resultados">
                <Trophy size={16} className="me-1" />
                Resultados
              </Link>
            </li>
          </ul>

          <div className="navbar-user d-flex align-items-center gap-3">
            <span className="navbar-nome">Olá, {user?.nome}</span>
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

export default NavbarAdmin
