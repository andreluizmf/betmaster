import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { buscarExtratoPorUsuario } from '../../services/api'
import NavbarUsuario from '../../components/NavbarUsuario'
import FooterBet from '../../components/FooterBet'
import Sidebar from '../../components/Sidebar'
import '../../styles/Extrato.css'

const tipoConfig = {
  bonus_cadastro: { label: 'Bônus de Cadastro',  icone: '+', classe: 'positivo' },
  aposta:         { label: 'Aposta Realizada',    icone: '-', classe: 'negativo' },
  premio:         { label: 'Prêmio',              icone: '*', classe: 'positivo' },
  bonus:          { label: 'Bônus',               icone: '+', classe: 'positivo' },
}

function Extrato() {
  const { user } = useAuth()
  const [extrato, setExtrato] = useState([])
  const [filtro,  setFiltro]  = useState('Todos')

  useEffect(() => {
    if (user) buscarExtratoPorUsuario(user.id).then(setExtrato).catch(console.error)
  }, [user])

  const extratoFiltrado = filtro === 'Todos'
    ? extrato
    : extrato.filter((e) => e.tipo === filtro)

  const totalEntradas = extrato.filter((e) => e.valor > 0).reduce((acc, e) => acc + Number(e.valor), 0)
  const totalSaidas   = extrato.filter((e) => e.valor < 0).reduce((acc, e) => acc + Number(e.valor), 0)

  return (
    <div className="page-wrapper">
      <NavbarUsuario />
      <div className="layout-com-sidebar">
        <Sidebar />
        <main className="conteudo-principal">

          <div className="page-header">
            <h2 className="page-titulo">Extrato de Movimentações</h2>
            <p className="page-subtitulo">Funcionalidade extra — histórico financeiro fictício</p>
          </div>

          <div className="extrato-resumo">
            <div className="extrato-card-saldo">
              <span className="extrato-saldo-label">Saldo Atual</span>
              <span className="extrato-saldo-valor">R$ {Number(user?.saldo || 0).toFixed(2)}</span>
            </div>
            <div className="extrato-card">
              <span>Entradas</span>
              <span className="valor-positivo">+R$ {totalEntradas.toFixed(2)}</span>
            </div>
            <div className="extrato-card">
              <span>Saídas</span>
              <span className="valor-negativo">-R$ {Math.abs(totalSaidas).toFixed(2)}</span>
            </div>
          </div>

          <div className="filtros-bar mb-3">
            <label>Tipo:</label>
            <div className="filtro-botoes">
              {['Todos', 'aposta', 'premio', 'bonus_cadastro'].map((f) => (
                <button key={f} className={`btn-filtro ${filtro === f ? 'ativo' : ''}`} onClick={() => setFiltro(f)}>
                  {f === 'Todos' ? 'Todos' : tipoConfig[f]?.label || f}
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            {extratoFiltrado.length === 0 ? (
              <p className="empty">Nenhuma movimentação encontrada.</p>
            ) : (
              <div className="extrato-lista">
                {[...extratoFiltrado].reverse().map((item) => {
                  const cfg = tipoConfig[item.tipo] || { label: item.tipo, icone: '·', classe: 'neutro' }
                  return (
                    <div key={item.id} className={`extrato-item ${cfg.classe}`}>
                      <div className="extrato-icone">{cfg.icone}</div>
                      <div className="extrato-descricao">
                        <strong>{cfg.label}</strong>
                        <span>{item.descricao}</span>
                        <small>{new Date(item.data + 'T12:00:00').toLocaleDateString('pt-BR')}</small>
                      </div>
                      <div className={`extrato-valor ${item.valor > 0 ? 'valor-positivo' : 'valor-negativo'}`}>
                        {item.valor > 0 ? '+' : ''} R$ {Number(item.valor).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </main>
      </div>
      <FooterBet />
    </div>
  )
}

export default Extrato
