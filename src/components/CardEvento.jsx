import { useNavigate } from 'react-router-dom'
import '../styles/CardEvento.css'

const iconeEsporte = {
  Futebol:             '',
  Basquete:            '',
  Tênis:               '',
  Vôlei:               '',
  'Futebol Americano': '',
  MMA:                 '',
  Natação:             '',
  'Fórmula 1':         '',
  Ciclismo:            '',
  Beisebol:            '',
}

function CardEvento({ evento, modoAdmin = false, onEncerrar, onDeletar }) {
  const navigate = useNavigate()

  const dataFmt = new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit',
  })

  const statusTag = {
    aberto:     <span className="ev-tag aberto">Aberto</span>,
    encerrado:  <span className="ev-tag encerrado">Encerrado</span>,
    aguardando: <span className="ev-tag aguardando">Ag. Resultado</span>,
  }

  function irParaAposta() {
    navigate(`/usuario/aposta/${evento.id}`)
  }

  return (
    <div className={`ev-linha ev-${evento.status}`}>

      {/* Coluna esquerda: data + esporte + status */}
      <div className="ev-col-meta">
        <span className="ev-data">
          {iconeEsporte[evento.esporte] || ''} {dataFmt}
        </span>
        {statusTag[evento.status]}
      </div>

      {/* Coluna central: nomes dos times */}
      <div className="ev-col-times" onClick={!modoAdmin && evento.status === 'aberto' ? irParaAposta : undefined}
           style={{ cursor: !modoAdmin && evento.status === 'aberto' ? 'pointer' : 'default' }}>
        <div className="ev-time">
          <span className="ev-time-nome">{evento.timeA}</span>
        </div>
        <div className="ev-time">
          <span className="ev-time-nome">{evento.timeB}</span>
        </div>
        {evento.resultado && (
          <div className="ev-resultado"> {evento.resultado}</div>
        )}
      </div>

      {/* Coluna odds — usuário */}
      {!modoAdmin && evento.status === 'aberto' && (
        <div className="ev-col-odds">
          <button className="ev-odd" onClick={irParaAposta} title={`${evento.timeA} vence`}>
            <span className="ev-odd-label">1</span>
            <span className="ev-odd-val">{Number(evento.oddA).toFixed(2)}</span>
          </button>

          {evento.oddEmpate > 0 ? (
            <button className="ev-odd" onClick={irParaAposta} title="Empate">
              <span className="ev-odd-label">X</span>
              <span className="ev-odd-val">{Number(evento.oddEmpate).toFixed(2)}</span>
            </button>
          ) : (
            <div className="ev-odd desativado">
              <span className="ev-odd-label">X</span>
              <span className="ev-odd-val">—</span>
            </div>
          )}

          <button className="ev-odd" onClick={irParaAposta} title={`${evento.timeB} vence`}>
            <span className="ev-odd-label">2</span>
            <span className="ev-odd-val">{Number(evento.oddB).toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Odds desativadas para eventos não abertos */}
      {!modoAdmin && evento.status !== 'aberto' && (
        <div className="ev-col-odds">
          <div className="ev-odd desativado"><span className="ev-odd-label">1</span><span className="ev-odd-val">—</span></div>
          <div className="ev-odd desativado"><span className="ev-odd-label">X</span><span className="ev-odd-val">—</span></div>
          <div className="ev-odd desativado"><span className="ev-odd-label">2</span><span className="ev-odd-val">—</span></div>
        </div>
      )}

      {/* Ações admin */}
      {modoAdmin && (
        <div className="ev-col-acoes">
          {evento.status === 'aberto' && (
            <button className="ev-btn-acao encerrar" onClick={() => onEncerrar(evento.id)}>
              Encerrar
            </button>
          )}
          <button className="ev-btn-acao deletar" onClick={() => onDeletar(evento.id)}>
            Excluir
          </button>
        </div>
      )}

    </div>
  )
}

export default CardEvento
