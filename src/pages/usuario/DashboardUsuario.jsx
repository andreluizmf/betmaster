import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { buscarApostasPorUsuario, buscarEventos } from '../../services/api'
import NavbarUsuario from '../../components/NavbarUsuario'
import FooterBet from '../../components/FooterBet'
import Sidebar from '../../components/Sidebar'
import CardEvento from '../../components/CardEvento'
import '../../styles/DashboardUsuario.css'

const statusOpcoes = [
  { valor: 'aberto',     label: 'Abertos'        },
  { valor: 'aguardando', label: 'Ag. Resultado'   },
  { valor: 'encerrado',  label: 'Encerrados'      },
  { valor: 'Todos',      label: 'Todos'              },
]

function DashboardUsuario() {
  const { user }  = useAuth()
  const [eventos,       setEventos]       = useState([])
  const [apostas,       setApostas]       = useState([])
  const [filtroEsporte, setFiltroEsporte] = useState('Todos')
  const [filtroStatus,  setFiltroStatus]  = useState('aberto')

  useEffect(() => {
    buscarEventos().then(setEventos).catch(console.error)
    if (user) buscarApostasPorUsuario(user.id).then(setApostas).catch(console.error)
  }, [user])

  const eventosFiltrados = eventos.filter((e) => {
    const passaEsporte = filtroEsporte === 'Todos' || e.esporte === filtroEsporte
    const passaStatus  = filtroStatus  === 'Todos' || e.status  === filtroStatus
    return passaEsporte && passaStatus
  })

  const totalApostas    = apostas.length
  const apostasVencidas = apostas.filter((a) => a.status === 'vencida').length
  const apostasPendentes= apostas.filter((a) => a.status === 'pendente').length

  return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">

        {/* Sidebar funcional com filtro de esporte */}
        <Sidebar filtroAtivo={filtroEsporte} onFiltrar={setFiltroEsporte} />

        <main className="conteudo-principal">

          {/* Barra de saldo compacta */}
          <div className="dash-saldo-bar">
            <div className="dash-saldo-info">
              <span className="dash-saldo-label">Saldo fictício</span>
              <span className="dash-saldo-valor">R$ {Number(user?.saldo || 0).toFixed(2)}</span>
            </div>
            <div className="dash-mini-stats">
              <div className="mini-stat">
                <span className="mini-stat-valor">{totalApostas}</span>
                <span className="mini-stat-label">Apostas</span>
              </div>
              <div className="mini-stat destaque-verde">
                <span className="mini-stat-valor">{apostasVencidas}</span>
                <span className="mini-stat-label">Vencidas</span>
              </div>
              <div className="mini-stat destaque-amarelo">
                <span className="mini-stat-valor">{apostasPendentes}</span>
                <span className="mini-stat-label">Pendentes</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-valor">
                  {totalApostas > 0 ? ((apostasVencidas / totalApostas) * 100).toFixed(0) : 0}%
                </span>
                <span className="mini-stat-label">Taxa vitória</span>
              </div>
            </div>
          </div>

          {/* Filtro de status */}
          <div className="dash-status-bar">
            {statusOpcoes.map((s) => (
              <button
                key={s.valor}
                className={`btn-status-tab ${filtroStatus === s.valor ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus(s.valor)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Cabeçalho da listagem */}
          <div className="dash-lista-header">
            <span className="dash-lista-titulo">
              {filtroEsporte === 'Todos' ? 'Apostas Esportivas' : filtroEsporte}
            </span>
            <span className="dash-lista-count">{eventosFiltrados.length} eventos</span>
          </div>

          {/* Cabeçalho de colunas estilo Betano */}
          {eventosFiltrados.length > 0 && (
            <div className="eventos-col-header">
              <span className="col-h-evento">Evento</span>
              <span className="col-h-odds">1 &nbsp;&nbsp; X &nbsp;&nbsp; 2</span>
            </div>
          )}

          {/* Lista de eventos */}
          {eventosFiltrados.length === 0 ? (
            <div className="dash-vazio">
              <span>Nenhum evento encontrado para os filtros selecionados.</span>
            </div>
          ) : (
            <div className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <CardEvento key={evento.id} evento={evento} modoAdmin={false} />
              ))}
            </div>
          )}

        </main>
      </div>
      <FooterBet />
    </div>
  )
}

export default DashboardUsuario
