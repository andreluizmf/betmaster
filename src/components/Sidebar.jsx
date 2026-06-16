import { Trophy, Circle, Dumbbell, Bike, Zap, Target, Waves, Flag, Award, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/Sidebar.css'

const esportes = [
  { nome: 'Futebol',           Icone: Circle   },
  { nome: 'Tennis',            Icone: Activity },
  { nome: 'Basquete',          Icone: Circle   },
  { nome: 'Volei',             Icone: Target   },
  { nome: 'Futebol Americano', Icone: Zap      },
  { nome: 'MMA',               Icone: Dumbbell },
  { nome: 'Natacao',           Icone: Waves    },
  { nome: 'Formula 1',         Icone: Flag     },
  { nome: 'Ciclismo',          Icone: Bike     },
  { nome: 'Beisebol',          Icone: Award    },
]

function Sidebar({ filtroAtivo, onFiltrar }) {
  const navigate = useNavigate()

  function handleClick(nome) {
    if (onFiltrar) {
      onFiltrar(nome)
    } else {
      navigate('/usuario/eventos?esporte=' + encodeURIComponent(nome))
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-titulo">Esportes</div>
      <ul className="sidebar-lista">
        <li
          className={`sidebar-item ${!filtroAtivo || filtroAtivo === 'Todos' ? 'ativo' : ''}`}
          onClick={() => handleClick('Todos')}
        >
          <Trophy size={16} className="sidebar-icone-svg" />
          <span className="sidebar-nome">Todos</span>
        </li>
        {esportes.map(({ nome, Icone }) => (
          <li
            key={nome}
            className={`sidebar-item ${filtroAtivo === nome ? 'ativo' : ''}`}
            onClick={() => handleClick(nome)}
          >
            <Icone size={16} className="sidebar-icone-svg" />
            <span className="sidebar-nome">{nome}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
