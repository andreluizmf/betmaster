import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import Login from '../pages/Login'

// Admin
import DashboardAdmin from '../pages/admin/DashboardAdmin'
import GerenciarEventos from '../pages/admin/GerenciarEventos'
import InformarResultado from '../pages/admin/InformarResultado'

// Usuario
import DashboardUsuario from '../pages/usuario/DashboardUsuario'
import EventosDisponiveis from '../pages/usuario/EventosDisponiveis'
import TelaAposta from '../pages/usuario/TelaAposta'
import HistoricoApostas from '../pages/usuario/HistoricoApostas'
import Extrato from '../pages/usuario/Extrato'
import Ranking from '../pages/usuario/Ranking'

function RotaProtegidaAdmin({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (user.perfil !== 'admin') return <Navigate to="/usuario/dashboard" replace />
  return children
}

function RotaProtegidaUsuario({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (user.perfil !== 'usuario') return <Navigate to="/admin/dashboard" replace />
  return children
}

function RotaInicial() {
  const { user } = useAuth()
  if (!user) return <Login />
  if (user.perfil === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/usuario/dashboard" replace />
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RotaInicial />} />

        {/* Rotas Admin */}
        <Route path="/admin/dashboard" element={
          <RotaProtegidaAdmin><DashboardAdmin /></RotaProtegidaAdmin>
        } />
        <Route path="/admin/eventos" element={
          <RotaProtegidaAdmin><GerenciarEventos /></RotaProtegidaAdmin>
        } />
        <Route path="/admin/resultados" element={
          <RotaProtegidaAdmin><InformarResultado /></RotaProtegidaAdmin>
        } />

        {/* Rotas Usuario */}
        <Route path="/usuario/dashboard" element={
          <RotaProtegidaUsuario><DashboardUsuario /></RotaProtegidaUsuario>
        } />
        <Route path="/usuario/eventos" element={
          <RotaProtegidaUsuario><EventosDisponiveis /></RotaProtegidaUsuario>
        } />
        <Route path="/usuario/aposta/:id" element={
          <RotaProtegidaUsuario><TelaAposta /></RotaProtegidaUsuario>
        } />
        <Route path="/usuario/historico" element={
          <RotaProtegidaUsuario><HistoricoApostas /></RotaProtegidaUsuario>
        } />
        <Route path="/usuario/extrato" element={
          <RotaProtegidaUsuario><Extrato /></RotaProtegidaUsuario>
        } />
        <Route path="/usuario/ranking" element={
          <RotaProtegidaUsuario><Ranking /></RotaProtegidaUsuario>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
