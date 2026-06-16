import { useEffect, useState } from 'react'
import { buscarEventos } from '../../services/api'
import NavbarUsuario from '../../components/NavbarUsuario'
import FooterBet from '../../components/FooterBet'
import Sidebar from '../../components/Sidebar'
import CardEvento from '../../components/CardEvento'
import '../../styles/EventosDisponiveis.css'

function EventosDisponiveis() {
  const [eventos, setEventos] = useState([])
  const [filtroEsporte, setFiltroEsporte] = useState('Todos')
  const [filtroStatus, setFiltroStatus] = useState('aberto')

  useEffect(() => {
    buscarEventos().then(setEventos).catch(console.error)
  }, [])

  const eventosFiltrados = eventos.filter((e) => {
    const passaEsporte = filtroEsporte === 'Todos' || e.esporte === filtroEsporte
    const passaStatus  = filtroStatus  === 'Todos' || e.status  === filtroStatus
    return passaEsporte && passaStatus
  })

  return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar filtroAtivo={filtroEsporte} onFiltrar={setFiltroEsporte} />

        <main className="conteudo-principal">
          {/* Filtro de status no topo */}
          <div className="eventos-status-bar">
            {['aberto', 'aguardando', 'encerrado', 'Todos'].map((s) => (
              <button
                key={s}
                className={`btn-status ${filtroStatus === s ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus(s)}
              >
                {s === 'Todos' ? 'Todos' : s === 'aberto' ? 'Abertos' : s === 'aguardando' ? 'Ag. Resultado' : 'Encerrados'}
              </button>
            ))}
          </div>

          <div className="eventos-header-linha">
            <span className="eventos-secao-titulo">
              {filtroEsporte === 'Todos' ? 'Todos os Eventos' : `${filtroEsporte}`}
            </span>
            <span className="eventos-count">{eventosFiltrados.length} eventos</span>
          </div>

          {eventosFiltrados.length === 0 ? (
            <div className="panel">
              <p className="empty">Nenhum evento encontrado.</p>
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

export default EventosDisponiveis
