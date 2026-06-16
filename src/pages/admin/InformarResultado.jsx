import { useEffect, useState } from 'react'
import {
  buscarEventos,
  atualizarEvento,
  buscarApostasPorEvento,
  atualizarAposta,
  buscarUsuarioPorId,
  atualizarUsuario,
  criarExtrato,
} from '../../services/api'
import NavbarAdmin from '../../components/NavbarAdmin'
import FooterBet from '../../components/FooterBet'
import Feedback from '../../components/Feedback'
import '../../styles/InformarResultado.css'

function InformarResultado() {
  const [eventos, setEventos] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [processando, setProcessando] = useState(null)

  useEffect(() => {
    carregarEventos()
  }, [])

  function carregarEventos() {
    buscarEventos()
      .then((data) => setEventos(data.filter((e) => e.status === 'aguardando')))
      .catch(console.error)
  }

  function mostrarFeedback(tipo, mensagem) {
    setFeedback({ tipo, mensagem })
    setTimeout(() => setFeedback(null), 5000)
  }

  async function handleInformarResultado(evento, resultado) {
    if (!resultado) {
      mostrarFeedback('erro', 'Selecione um resultado.')
      return
    }

    setProcessando(evento.id)

    try {
      // 1. Atualizar o evento
      await atualizarEvento(evento.id, { status: 'encerrado', resultado })

      // 2. Buscar todas as apostas do evento
      const apostas = await buscarApostasPorEvento(evento.id)

      // 3. Processar cada aposta
      for (const aposta of apostas) {
        const venceu = aposta.palpite === resultado
        const retorno = venceu ? Number(aposta.valor) * Number(aposta.odd) : 0
        const novoStatus = venceu ? 'vencida' : 'perdida'

        await atualizarAposta(aposta.id, { status: novoStatus, retorno })

        if (venceu) {
          const usuario = await buscarUsuarioPorId(aposta.usuarioId)
          const novoSaldo = Number(usuario.saldo) + retorno
          await atualizarUsuario(aposta.usuarioId, { saldo: novoSaldo })

          await criarExtrato({
            usuarioId: aposta.usuarioId,
            tipo: 'premio',
            descricao: `Prêmio: ${evento.timeA} vs ${evento.timeB} (vencida)`,
            valor: retorno,
            data: new Date().toISOString().split('T')[0],
          })
        }
      }

      mostrarFeedback('sucesso', `Resultado "${resultado}" registrado! Apostas processadas com sucesso.`)
      carregarEventos()
    } catch (error) {
      console.error(error)
      mostrarFeedback('erro', 'Erro ao processar resultado.')
    }

    setProcessando(null)
  }

  return (
    <div className="page-wrapper">
      <NavbarAdmin />
      <main className="conteudo-principal">
        <div className="container">
        <div className="page-header">
          <h2 className="page-titulo">Informar Resultados</h2>
          <p className="page-subtitulo">
            Eventos aguardando resultado. Ao informar, as apostas serão processadas automaticamente.
          </p>
        </div>

        <Feedback feedback={feedback} />

        {eventos.length === 0 ? (
          <div className="panel">
            <p className="empty">
              Nenhum evento aguardando resultado. <br />
              Encerre eventos na tela de <strong>Gerenciar Eventos</strong> primeiro.
            </p>
          </div>
        ) : (
          <div className="resultado-lista">
            {eventos.map((evento) => (
              <ResultadoCard
                key={evento.id}
                evento={evento}
                processando={processando === evento.id}
                onConfirmar={handleInformarResultado}
              />
            ))}
          </div>
        )}
        </div>
      </main>
      <FooterBet />
    </div>
  )
}

function ResultadoCard({ evento, processando, onConfirmar }) {
  const [resultado, setResultado] = useState('')

  const opcoes = [evento.timeA, evento.timeB]
  if (evento.oddEmpate > 0) opcoes.push('Empate')

  return (
    <div className="resultado-card panel">
      <div className="resultado-evento-info">
        <span className="resultado-esporte">{evento.esporte}</span>
        <h3>{evento.timeA} vs {evento.timeB}</h3>
        <span className="resultado-data">
          {new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR')}
        </span>
      </div>

      <div className="resultado-form">
        <label>Selecione o resultado:</label>
        <div className="resultado-opcoes">
          {opcoes.map((op) => (
            <button
              key={op}
              type="button"
              className={`btn-resultado-opcao ${resultado === op ? 'selecionado' : ''}`}
              onClick={() => setResultado(op)}
            >
              {op}
            </button>
          ))}
        </div>
        <button
          className="btn-primary mt-3"
          disabled={!resultado || processando}
          onClick={() => onConfirmar(evento, resultado)}
        >
          {processando ? 'Processando...' : 'Confirmar Resultado'}
        </button>
      </div>
    </div>
  )
}

export default InformarResultado
