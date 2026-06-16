import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { buscarApostasPorUsuario, buscarEventos } from '../../services/api'
import NavbarUsuario from '../../components/NavbarUsuario'
import FooterBet from '../../components/FooterBet'
import Sidebar from '../../components/Sidebar'
import '../../styles/HistoricoApostas.css'

const statusConfig = {
  vencida:  { label: 'Vencida',  classe: 'badge-vencida'  },
  perdida:  { label: 'Perdida',  classe: 'badge-perdida'  },
  pendente: { label: 'Pendente', classe: 'badge-pendente' },
}

function HistoricoApostas() {
  const { user } = useAuth()
  const [apostas, setApostas] = useState([])
  const [eventos, setEventos] = useState([])
  const [filtro,  setFiltro]  = useState('Todos')

  useEffect(() => {
    if (user) {
      buscarApostasPorUsuario(user.id).then(setApostas).catch(console.error)
      buscarEventos().then(setEventos).catch(console.error)
    }
  }, [user])

  function getNomeEvento(eventoId) {
    const ev = eventos.find((e) => e.id === eventoId)
    return ev ? `${ev.timeA} vs ${ev.timeB}` : `Evento #${eventoId}`
  }

  const apostasFiltradas = filtro === 'Todos'
    ? apostas
    : apostas.filter((a) => a.status === filtro.toLowerCase())

  const vencidas  = apostas.filter((a) => a.status === 'vencida').length
  const perdidas  = apostas.filter((a) => a.status === 'perdida').length
  const pendentes = apostas.filter((a) => a.status === 'pendente').length

  return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar />
        <main className="conteudo-principal">

          <div className="page-header">
            <h2 className="page-titulo">Histórico de Apostas</h2>
            <p className="page-subtitulo">Todas as suas apostas fictícias</p>
          </div>

          <div className="historico-resumo">
            <div className="resumo-pill total">Total: {apostas.length}</div>
            <div className="resumo-pill vencidas">Vencidas: {vencidas}</div>
            <div className="resumo-pill perdidas">Perdidas: {perdidas}</div>
            <div className="resumo-pill pendentes">Pendentes: {pendentes}</div>
          </div>

          <div className="filtros-bar mb-3">
            <label>Status:</label>
            <div className="filtro-botoes">
              {['Todos', 'Pendente', 'Vencida', 'Perdida'].map((f) => (
                <button key={f} className={`btn-filtro ${filtro === f ? 'ativo' : ''}`} onClick={() => setFiltro(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            {apostasFiltradas.length === 0 ? (
              <p className="empty">Nenhuma aposta encontrada.</p>
            ) : (
              <div className="table-responsive">
                <table className="table-betmaster">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Evento</th>
                      <th>Palpite</th>
                      <th>Odd</th>
                      <th>Apostado</th>
                      <th>Retorno</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apostasFiltradas.map((a) => (
                      <tr key={a.id}>
                        <td>{new Date(a.data + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                        <td>{getNomeEvento(a.eventoId)}</td>
                        <td><strong>{a.palpite}</strong></td>
                        <td>×{Number(a.odd).toFixed(2)}</td>
                        <td>R$ {Number(a.valor).toFixed(2)}</td>
                        <td className={a.status === 'vencida' ? 'valor-positivo' : ''}>
                          {a.status === 'vencida' ? `R$ ${Number(a.retorno).toFixed(2)}` : '—'}
                        </td>
                        <td>
                          <span className={`badge-status ${statusConfig[a.status]?.classe || ''}`}>
                            {statusConfig[a.status]?.label || a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
      <FooterBet />
    </div>
  )
}

export default HistoricoApostas
