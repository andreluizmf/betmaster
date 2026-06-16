import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { buscarUsuarios, buscarApostas } from '../../services/api'
import NavbarUsuario from '../../components/NavbarUsuario'
import FooterBet from '../../components/FooterBet'
import Sidebar from '../../components/Sidebar'
import '../../styles/Ranking.css'

function Ranking() {
  const { user }   = useAuth()
  const [ranking, setRanking] = useState([])

  useEffect(() => { calcularRanking() }, [])

  async function calcularRanking() {
    try {
      const [usuarios, apostas] = await Promise.all([buscarUsuarios(), buscarApostas()])
      const jogadores = usuarios.filter((u) => u.perfil === 'usuario')

      const rankingCalculado = jogadores.map((jogador) => {
        const mine        = apostas.filter((a) => a.usuarioId === jogador.id)
        const vencidas    = mine.filter((a) => a.status === 'vencida').length
        const totalGanho  = mine.filter((a) => a.status === 'vencida').reduce((acc, a) => acc + Number(a.retorno), 0)
        const taxaVitoria = mine.length > 0 ? ((vencidas / mine.length) * 100).toFixed(0) : 0
        const pontos      = Math.round(vencidas * 100 + Number(jogador.saldo) / 10)
        return { ...jogador, totalApostas: mine.length, vencidas, totalGanho, taxaVitoria, pontos }
      })

      rankingCalculado.sort((a, b) => b.pontos - a.pontos)
      setRanking(rankingCalculado)
    } catch (e) { console.error(e) }
  }

  const medalhas = ['1.', '2.', '3.']

  return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar />
        <main className="conteudo-principal">

          <div className="page-header">
            <h2 className="page-titulo">Ranking de Jogadores</h2>
            <p className="page-subtitulo">Classificação fictícia por vitórias e saldo acumulado</p>
          </div>

          <div className="ranking-formula panel mb-3">Pontuação = (Vitórias x 100) + (Saldo ÷ 10)
          </div>

          {ranking.length === 0 ? (
            <div className="panel"><p className="empty">Carregando ranking...</p></div>
          ) : (
            <>
              <div className="ranking-podio">
                {ranking.slice(0, 3).map((jogador, i) => (
                  <div key={jogador.id} className={`podio-card posicao-${i + 1}`}>
                    <span className="podio-medalha">{medalhas[i]}</span>
                    <div className="podio-avatar">{jogador.nome.charAt(0).toUpperCase()}</div>
                    <strong>{jogador.nome}</strong>
                    <span className="podio-pontos">{jogador.pontos} pts</span>
                    <span className="podio-info">{jogador.vencidas} vitórias</span>
                    {jogador.id === user?.id && <span className="podio-voce">Você</span>}
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Classificação Geral</h3>
                  <span className="count">{ranking.length} jogadores</span>
                </div>
                <div className="table-responsive">
                  <table className="table-betmaster">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Jogador</th>
                        <th>Pontos</th>
                        <th>Apostas</th>
                        <th>Vitórias</th>
                        <th>Taxa</th>
                        <th>Ganhos</th>
                        <th>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((jogador, i) => (
                        <tr key={jogador.id} className={jogador.id === user?.id ? 'linha-destacada' : ''}>
                          <td>{i < 3 ? medalhas[i] : <span className="posicao-numero">{i + 1}º</span>}</td>
                          <td>
                            <div className="jogador-cell">
                              <div className="mini-avatar">{jogador.nome.charAt(0).toUpperCase()}</div>
                              <span>{jogador.nome}</span>
                              {jogador.id === user?.id && <span className="badge-voce">Você</span>}
                            </div>
                          </td>
                          <td><strong>{jogador.pontos}</strong></td>
                          <td>{jogador.totalApostas}</td>
                          <td>{jogador.vencidas}</td>
                          <td>{jogador.taxaVitoria}%</td>
                          <td className="valor-positivo">R$ {jogador.totalGanho.toFixed(2)}</td>
                          <td>R$ {Number(jogador.saldo).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
      <FooterBet />
    </div>
  )
}

export default Ranking
