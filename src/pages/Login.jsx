import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { buscarUsuarios } from '../services/api'
import Feedback from '../components/Feedback'
import '../styles/Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setCarregando(true)

    try {
      const usuarios = await buscarUsuarios()
      const usuario = usuarios.find(
        (u) => u.email === email && u.senha === senha
      )

      if (usuario) {
        login(usuario)
        if (usuario.perfil === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/usuario/dashboard')
        }
      } else {
        setFeedback({ tipo: 'erro', mensagem: 'E-mail ou senha incorretos.' })
        setTimeout(() => setFeedback(null), 4000)
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível conectar ao servidor. Verifique se o JSON Server está rodando.' })
      setTimeout(() => setFeedback(null), 5000)
    }

    setCarregando(false)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-titulo">BETMASTER</h1>
        <p className="login-subtitulo">Plataforma Acadêmica de Apostas Esportivas</p>

        <div className="login-form-box">
          <form onSubmit={handleLogin} className="login-form" autoComplete="off">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <Feedback feedback={feedback} />

            <button type="submit" className="btn-login" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-dica">
            <p>Contas de teste:</p>
            <div className="dica-cards">
              <div className="dica-card">
                <span className="dica-perfil admin">Admin</span>
                <span>admin@bet.com / 123</span>
              </div>
              <div className="dica-card">
                <span className="dica-perfil usuario">Jogador</span>
                <span>joao@bet.com / 123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="login-aviso">Plataforma exclusivamente acadêmica. Valores fictícios.</p>
      </div>
    </div>
  )
}

export default Login
