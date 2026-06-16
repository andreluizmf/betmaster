import { useEffect, useState } from 'react'
import { buscarEventos, criarEvento, atualizarEvento, deletarEvento } from '../../services/api'
import NavbarAdmin from '../../components/NavbarAdmin'
import FooterBet from '../../components/FooterBet'
import CardEvento from '../../components/CardEvento'
import Feedback from '../../components/Feedback'
import '../../styles/GerenciarEventos.css'

const esportes = ['Futebol', 'Basquete', 'Tênis', 'Vôlei', 'Futebol Americano', 'MMA', 'Natação', 'Fórmula 1', 'Ciclismo', 'Beisebol']
const formInicial = { timeA: '', timeB: '', esporte: 'Futebol', data: '', oddA: '', oddB: '', oddEmpate: '' }

function GerenciarEventos() {
  const [eventos,       setEventos]       = useState([])
  const [form,          setForm]          = useState(formInicial)
  const [feedback,      setFeedback]      = useState(null)
  const [filtroEsporte, setFiltroEsporte] = useState('Todos')

  useEffect(() => { carregarEventos() }, [])

  function carregarEventos() {
    buscarEventos().then(setEventos).catch(() => mostrarFeedback('erro', 'Erro ao carregar eventos.'))
  }

  function mostrarFeedback(tipo, mensagem) {
    setFeedback({ tipo, mensagem })
    setTimeout(() => setFeedback(null), 4000)
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.timeA || !form.timeB || !form.data || !form.oddA || !form.oddB) {
      mostrarFeedback('erro', 'Preencha todos os campos obrigatórios.')
      return
    }
    try {
      await criarEvento({
        timeA: form.timeA, timeB: form.timeB, esporte: form.esporte,
        data: form.data, status: 'aberto', resultado: '',
        oddA: Number(form.oddA), oddB: Number(form.oddB),
        oddEmpate: Number(form.oddEmpate) || 0,
      })
      setForm(formInicial)
      carregarEventos()
      mostrarFeedback('sucesso', 'Evento cadastrado com sucesso!')
    } catch { mostrarFeedback('erro', 'Erro ao cadastrar evento.') }
  }

  async function handleEncerrar(id) {
    if (!confirm('Encerrar apostas deste evento?')) return
    try {
      await atualizarEvento(id, { status: 'aguardando' })
      carregarEventos()
      mostrarFeedback('sucesso', 'Evento encerrado para novas apostas.')
    } catch { mostrarFeedback('erro', 'Erro ao encerrar evento.') }
  }

  async function handleDeletar(id) {
    if (!confirm('Excluir este evento?')) return
    try {
      await deletarEvento(id)
      carregarEventos()
      mostrarFeedback('sucesso', 'Evento excluído.')
    } catch { mostrarFeedback('erro', 'Erro ao excluir evento.') }
  }

  const esportesDisponiveis = ['Todos', ...new Set(eventos.map((e) => e.esporte))]
  const eventosFiltrados    = filtroEsporte === 'Todos' ? eventos : eventos.filter((e) => e.esporte === filtroEsporte)

  return (
    <div className="page-wrapper">
      <NavbarAdmin />
      <main className="conteudo-principal">
        <div className="container">

        <div className="page-header">
          <h2 className="page-titulo">Gerenciar Eventos</h2>
          <p className="page-subtitulo">Cadastre e controle os eventos esportivos da plataforma</p>
        </div>

        <div className="panel mb-3">
          <div className="panel-header"><h3>Novo Evento</h3></div>
          <form onSubmit={handleSubmit} className="form-evento" autoComplete="off">
            <div className="form-row">
              <div className="form-group">
                <label>Time A *</label>
                <input name="timeA" type="text" placeholder="Ex: Brasil" value={form.timeA} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time B *</label>
                <input name="timeB" type="text" placeholder="Ex: Argentina" value={form.timeB} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Esporte *</label>
                <select name="esporte" value={form.esporte} onChange={handleChange}>
                  {esportes.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Data *</label>
                <input name="data" type="date" value={form.data} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row tres-colunas">
              <div className="form-group">
                <label>Odd {form.timeA || 'Time A'} *</label>
                <input name="oddA" type="number" step="0.01" min="1" placeholder="Ex: 1.80" value={form.oddA} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Odd Empate (0 = sem empate)</label>
                <input name="oddEmpate" type="number" step="0.01" min="0" placeholder="Ex: 3.20" value={form.oddEmpate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Odd {form.timeB || 'Time B'} *</label>
                <input name="oddB" type="number" step="0.01" min="1" placeholder="Ex: 2.10" value={form.oddB} onChange={handleChange} required />
              </div>
            </div>
            <Feedback feedback={feedback} />
            <button type="submit" className="btn-primary">Cadastrar Evento</button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Eventos Cadastrados</h3>
            <div className="filtro-esporte">
              <select value={filtroEsporte} onChange={(e) => setFiltroEsporte(e.target.value)}>
                {esportesDisponiveis.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          {eventosFiltrados.length === 0 ? (
            <p className="empty">Nenhum evento encontrado.</p>
          ) : (
            <div className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <CardEvento key={evento.id} evento={evento} modoAdmin={true} onEncerrar={handleEncerrar} onDeletar={handleDeletar} />
              ))}
            </div>
          )}
        </div>

      </div>
      </main>
      <FooterBet />
    </div>
  )
}

export default GerenciarEventos
