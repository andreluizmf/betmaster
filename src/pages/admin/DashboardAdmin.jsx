import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { buscarEventos, buscarApostas, buscarUsuarios } from '../../services/api'
import NavbarAdmin from '../../components/NavbarAdmin'
import FooterBet from '../../components/FooterBet'
import { CalendarDays, Trophy, Users, TrendingUp } from 'lucide-react'
import '../../styles/Dashboard.css'

function DashboardAdmin() {
  const { user } = useAuth()
  const [eventos,  setEventos]  = useState([])
  const [apostas,  setApostas]  = useState([])
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    buscarEventos().then(setEventos).catch(console.error)
    buscarApostas().then(setApostas).catch(console.error)
    buscarUsuarios().then(setUsuarios).catch(console.error)
  }, [])

  const eventosAbertos    = eventos.filter((e) => e.status === 'aberto').length
  const eventosEncerrados = eventos.filter((e) => e.status === 'encerrado').length
  const eventosAguardando = eventos.filter((e) => e.status === 'aguardando').length
  const totalApostas      = apostas.length
  const totalJogadores    = usuarios.filter((u) => u.perfil === 'usuario').length
  const totalMovimentado  = apostas.reduce((acc, a) => acc + Number(a.valor), 0)

  return (
    <div className="page-wrapper">
      <NavbarAdmin />
      <main className="conteudo-principal">
        <div className="container">
        <div className="page-header">
          <h2 className="page-titulo">Dashboard Administrativo</h2>
          <p className="page-subtitulo">Olá, {user?.nome} — visão geral da plataforma</p>
        </div>

        <div className="metricas-grid">
          <div className="metrica-card">
            <div className="metrica-icone verde"><CalendarDays size={20} /></div>
            <div className="metrica-info">
              <span className="metrica-valor">{eventosAbertos}</span>
              <span className="metrica-label">Eventos Abertos</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icone amarelo"><CalendarDays size={20} /></div>
            <div className="metrica-info">
              <span className="metrica-valor">{eventosAguardando}</span>
              <span className="metrica-label">Ag. Resultado</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icone vermelho"><CalendarDays size={20} /></div>
            <div className="metrica-info">
              <span className="metrica-valor">{eventosEncerrados}</span>
              <span className="metrica-label">Encerrados</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icone azul"><TrendingUp size={20} /></div>
            <div className="metrica-info">
              <span className="metrica-valor">{totalApostas}</span>
              <span className="metrica-label">Total Apostas</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icone laranja"><Users size={20} /></div>
            <div className="metrica-info">
              <span className="metrica-valor">{totalJogadores}</span>
              <span className="metrica-label">Jogadores</span>
            </div>
          </div>
          <div className="metrica-card">
            <div className="metrica-icone roxo"><Trophy size={20} /></div>
            <div className="metrica-info">
              <span className="metrica-valor">R${totalMovimentado.toFixed(0)}</span>
              <span className="metrica-label">Movimentado</span>
            </div>
          </div>
        </div>

        <div className="acoes-rapidas mt-3">
          <h3>Ações Rápidas</h3>
          <div className="acoes-grid">
            <Link to="/admin/eventos"    className="acao-card"><CalendarDays size={22} /><span>Gerenciar Eventos</span></Link>
            <Link to="/admin/resultados" className="acao-card"><Trophy size={22} /><span>Informar Resultados</span></Link>
          </div>
        </div>

        <div className="panel mt-3">
          <div className="panel-header">
            <h3>Últimas Apostas</h3>
            <span className="count">{totalApostas}</span>
          </div>
          {apostas.length === 0 ? (
            <p className="empty">Nenhuma aposta registrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table-betmaster">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Usuário</th>
                    <th>Evento</th>
                    <th>Palpite</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Retorno</th>
                  </tr>
                </thead>
                <tbody>
                  {apostas.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.usuarioId}</td>
                      <td>{a.eventoId}</td>
                      <td><strong>{a.palpite}</strong></td>
                      <td>R$ {Number(a.valor).toFixed(2)}</td>
                      <td><span className={`badge-status badge-${a.status}`}>{a.status}</span></td>
                      <td>R$ {Number(a.retorno).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
      </main>
      <FooterBet />
    </div>
  )
}

export default DashboardAdmin
