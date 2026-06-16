import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { buscarEventoPorId, criarAposta, atualizarUsuario, criarExtrato } from '../../services/api'
import NavbarUsuario from '../../components/NavbarUsuario'
import FooterBet from '../../components/FooterBet'
import Sidebar from '../../components/Sidebar'
import Feedback from '../../components/Feedback'
import { Swords, Calendar } from 'lucide-react'
import '../../styles/TelaAposta.css'

function TelaAposta() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { user, atualizarSaldo } = useAuth()

  const [evento,     setEvento]     = useState(null)
  const [palpite,    setPalpite]    = useState('')
  const [valor,      setValor]      = useState('')
  const [feedback,   setFeedback]   = useState(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    buscarEventoPorId(id).then(setEvento).catch(console.error)
  }, [id])

  function mostrarFeedback(tipo, mensagem) {
    setFeedback({ tipo, mensagem })
    setTimeout(() => setFeedback(null), 5000)
  }

  function getOdd(p) {
    if (!evento) return 1
    if (p === evento.timeA)  return Number(evento.oddA)
    if (p === evento.timeB)  return Number(evento.oddB)
    if (p === 'Empate')      return Number(evento.oddEmpate)
    return 1
  }

  const oddSelecionada   = getOdd(palpite)
  const retornoPotencial = palpite && valor ? (Number(valor) * oddSelecionada).toFixed(2) : '0.00'

  async function handleApostar(e) {
    e.preventDefault()
    if (!palpite) { mostrarFeedback('erro', 'Selecione um palpite.'); return }
    const valorNum = Number(valor)
    if (!valorNum || valorNum <= 0)          { mostrarFeedback('erro', 'Informe um valor válido.'); return }
    if (valorNum > Number(user.saldo))       { mostrarFeedback('erro', 'Saldo insuficiente.'); return }
    if (valorNum < 1)                        { mostrarFeedback('erro', 'Valor mínimo: R$ 1,00.'); return }

    setCarregando(true)
    try {
      await criarAposta({
        usuarioId: user.id,
        eventoId:  evento.id,
        palpite,
        valor:     valorNum,
        odd:       oddSelecionada,
        status:    'pendente',
        retorno:   0,
        data:      new Date().toISOString().split('T')[0],
      })

      const novoSaldo = Number(user.saldo) - valorNum
      await atualizarUsuario(user.id, { saldo: novoSaldo })
      atualizarSaldo(novoSaldo)

      await criarExtrato({
        usuarioId: user.id,
        tipo:      'aposta',
        descricao: `Aposta: ${evento.timeA} vs ${evento.timeB} — ${palpite}`,
        valor:     -valorNum,
        data:      new Date().toISOString().split('T')[0],
      })

      mostrarFeedback('sucesso', `Aposta de R$ ${valorNum.toFixed(2)} em "${palpite}" confirmada!`)
      setPalpite(''); setValor('')
      setTimeout(() => navigate('/usuario/historico'), 2000)
    } catch (err) {
      console.error(err)
      mostrarFeedback('erro', 'Erro ao registrar aposta.')
    }
    setCarregando(false)
  }

  if (!evento) return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar />
        <main className="conteudo-principal"><p className="loading">Carregando evento...</p></main>
      </div>
    </div>
  )

  if (evento.status !== 'aberto') return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar />
        <main className="conteudo-principal">
          <div className="panel text-center">
            <h3>Este evento não está disponível para apostas.</h3>
            <button className="btn-primary mt-3" style={{width:'auto', padding:'8px 24px'}} onClick={() => navigate('/usuario/eventos')}>
              Ver Outros Eventos
            </button>
          </div>
        </main>
      </div>
      <FooterBet />
    </div>
  )

  const opcoes = [
    { label: evento.timeA, odd: evento.oddA },
    ...(evento.oddEmpate > 0 ? [{ label: 'Empate', odd: evento.oddEmpate }] : []),
    { label: evento.timeB, odd: evento.oddB },
  ]

  return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar />
        <main className="conteudo-principal">

          <div className="page-header">
            <h2 className="page-titulo">Realizar Aposta</h2>
            <p className="page-subtitulo">Selecione seu palpite e defina o valor fictício</p>
          </div>

          <div className="aposta-layout">
            <div className="aposta-evento panel">
              <span className="badge-status badge-aberto" style={{marginBottom:'10px', display:'inline-block'}}>
                {evento.esporte}
              </span>
              <div className="aposta-times">
                <span className="time-nome-grande">{evento.timeA}</span>
                <Swords size={20} style={{color:'#475569', flexShrink:0}} />
                <span className="time-nome-grande">{evento.timeB}</span>
              </div>
              <div className="aposta-data">
                <Calendar size={13} />
                {new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div className="aposta-form panel">
              <form onSubmit={handleApostar}>
                <div className="form-group mb-3">
                  <label>Seu palpite:</label>
                  <div className="palpite-opcoes">
                    {opcoes.map((op) => (
                      <button
                        key={op.label}
                        type="button"
                        className={`btn-palpite ${palpite === op.label ? 'selecionado' : ''}`}
                        onClick={() => setPalpite(op.label)}
                      >
                        <span className="palpite-nome">{op.label}</span>
                        <span className="palpite-odd">×{Number(op.odd).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="valor">Valor da Aposta (R$)</label>
                  <input
                    id="valor" type="number" min="1" step="0.01"
                    placeholder="Ex: 50.00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                  />
                  <span className="saldo-disponivel">
                    Saldo disponível: R$ {Number(user?.saldo || 0).toFixed(2)}
                  </span>
                </div>

                {palpite && valor && (
                  <div className="retorno-preview">
                    <span>Retorno potencial:</span>
                    <strong>R$ {retornoPotencial}</strong>
                    <span className="odd-info">(×{oddSelecionada.toFixed(2)})</span>
                  </div>
                )}

                <Feedback feedback={feedback} />

                <button type="submit" className="btn-primary mt-3" disabled={carregando}>
                  {carregando ? 'Processando...' : 'Confirmar Aposta'}
                </button>
              </form>
            </div>
          </div>

        </main>
      </div>
      <FooterBet />
    </div>
  )
}

export default TelaAposta
