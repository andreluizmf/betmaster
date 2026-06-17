# BETMASTER — Plataforma Acadêmica de Apostas Esportivas

 Este projeto possui finalidade exclusivamente acadêmica. Todos os valores, saldos, apostas, prêmios, bônus e movimentações são **fictícios** e utilizados apenas para fins de simulação didática.

 ---

 ## Integrantes

 | Nome | GitHub |
|------|--------|
| André Luiz Martins Fávero | [@andreluizmf](https://github.com/andreluizmf) |
| Guilherme Otto de Souza Leal | [@guilhermeottoSL](https://github.com/guilhermeottoSL) |

---

## Descrição Geral

O **BETMASTER** é uma aplicação web desenvolvida em React que simula uma plataforma de apostas esportivas fictícias para fins acadêmicos. A aplicação contempla dois perfis de usuário: **Administrador** e **Jogador**, com funcionalidades distintas para cada perfil.

O Administrador cadastra eventos esportivos, define odds, controla a abertura e encerramento das apostas e informa resultados. O Jogador visualiza eventos disponíveis, realiza apostas fictícias com seu saldo simulado, acompanha seu histórico e consulta o extrato de movimentações.

---

## Funcionalidade Extra

**Extrato de Movimentações Fictícias**

O extrato é uma tela exclusiva do jogador que registra todas as movimentações da conta fictícia:
- Bônus de boas-vindas ao criar a conta
- Débitos ao realizar apostas
- Créditos de prêmios ao ganhar apostas
- Filtro por tipo de movimentação (aposta, prêmio, bônus)
- Resumo de entradas e saídas totais

Os dados são persistidos no JSON Server (`/extrato`) e atualizados automaticamente a cada aposta realizada ou resultado processado.

---

## Regras de Negócio

1. O usuário só pode apostar em eventos com status `aberto`
2. O saldo mínimo para aposta é R$ 1,00 (fictício)
3. O valor apostado não pode exceder o saldo disponível
4. O retorno é calculado: `valor × odd do palpite`
5. O Administrador encerra eventos (status `aguardando`) antes de informar o resultado
6. Ao informar o resultado, todas as apostas pendentes do evento são processadas automaticamente:
   - Apostas corretas → status `vencida`, saldo do jogador creditado, extrato atualizado
   - Apostas incorretas → status `perdida`
7. O Administrador não pode realizar apostas
8. O Jogador não tem acesso às funcionalidades administrativas
9. O ranking é calculado por: `(vitórias × 100) + (saldo ÷ 10)`
10. Ao realizar uma aposta, o extrato é atualizado automaticamente com o débito

---

## Tecnologias Utilizadas

- **React 19** + **Vite 8**
- **React Router DOM 7** — rotas e navegação
- **React Hooks** — useState, useEffect, useContext, useParams, useNavigate
- **Context API** — gerenciamento de estado global de autenticação
- **JSON Server** — API REST simulada
- **Bootstrap 5** — estilização base
- **CSS Modular** — estilos por componente em `src/styles/`
- **Lucide React** — ícones
- **Fetch API** — consumo da API (sem axios)

---

## Como Executar

### Pré-requisitos
- Node.js instalado
- Dependências instaladas: `npm install`

### 1. Iniciar o JSON Server (API)
```bash
npx json-server db.json --port 3000
```
A API ficará disponível em: `http://localhost:3000`

### 2. Iniciar o React (frontend)
```bash
npm run dev
```
A aplicação ficará disponível em: `http://localhost:5173`

> ⚠️ Os dois processos devem estar rodando simultaneamente.

---

## Usuários de Teste

| Perfil | E-mail | Senha | Saldo Inicial |
|--------|--------|-------|---------------|
| Administrador | admin@bet.com | 123 | — |
| Jogador | joao@bet.com | 123 | R$ 1.100,00 |
| Jogador | maria@bet.com | 123 | R$ 700,00 |

---

## Principais Rotas

| Rota | Perfil | Descrição |
|------|--------|-----------|
| `/` | Público | Tela de Login |
| `/admin/dashboard` | Admin | Dashboard com métricas gerais |
| `/admin/eventos` | Admin | Cadastrar, encerrar e excluir eventos |
| `/admin/resultados` | Admin | Informar resultado dos eventos encerrados |
| `/usuario/dashboard` | Jogador | Dashboard com resumo pessoal |
| `/usuario/eventos` | Jogador | Eventos disponíveis com filtros |
| `/usuario/aposta/:id` | Jogador | Tela de aposta para um evento |
| `/usuario/historico` | Jogador | Histórico de apostas com filtros |
| `/usuario/extrato` | Jogador | **Extrato de movimentações (funcionalidade extra)** |
| `/usuario/ranking` | Jogador | Ranking de jogadores com pódio |

---

## Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── CardEvento.jsx
│   ├── Feedback.jsx
│   ├── FooterBet.jsx
│   ├── NavbarAdmin.jsx
│   └── NavbarUsuario.jsx
├── contexts/
│   └── AuthContext.jsx  # Context API de autenticação
├── pages/
│   ├── Login.jsx
│   ├── admin/
│   │   ├── DashboardAdmin.jsx
│   │   ├── GerenciarEventos.jsx
│   │   └── InformarResultado.jsx
│   └── usuario/
│       ├── DashboardUsuario.jsx
│       ├── EventosDisponiveis.jsx
│       ├── TelaAposta.jsx
│       ├── HistoricoApostas.jsx
│       ├── Extrato.jsx
│       └── Ranking.jsx
├── routes/
│   └── AppRoutes.jsx    # Rotas protegidas por perfil
├── services/
│   └── api.js           # Todas as funções fetch
├── styles/              # CSS modular por componente
├── App.jsx
├── App.css
├── index.css
└── main.jsx
db.json                  # Banco de dados do JSON Server
```

---

## Estrutura do db.json

```json
{
  "usuarios": [...],   // perfil: "admin" | "usuario"
  "eventos": [...],    // status: "aberto" | "aguardando" | "encerrado"
  "apostas": [...],    // status: "pendente" | "vencida" | "perdida"
  "extrato": [...]     // tipo: "bonus_cadastro" | "aposta" | "premio"
}
```

---

## Divisão de Tarefas

| Tarefa | Responsável |
|--------|-------------|
| Estrutura inicial, configuração Vite + JSON Server | André |
| Context API (AuthContext), rotas protegidas | Guilherme e André |
| Login, services/api.js | Guilherme |
| Dashboard Admin, Gerenciar Eventos | Guilherme |
| Informar Resultado (processamento de apostas) | Guilherme |
| Dashboard Usuário, Eventos Disponíveis | André |
| Tela de Aposta, cálculo de saldo | André |
| Histórico de Apostas, filtros | André |
| Extrato de Movimentações (funcionalidade extra) | Guilherme |
| Ranking de Jogadores | Guilherme |
| CSS, responsividade, componentes reutilizáveis | André e Guilherme |
| README, db.json, testes finais | André e Guilherme |

---

## Principais Telas

- **Login** — autenticação por e-mail e senha, redireciona por perfil
- **Dashboard Admin** — métricas da plataforma (eventos, apostas, jogadores, movimentação)
- **Gerenciar Eventos** — CRUD de eventos com definição de odds e filtro por esporte
- **Informar Resultado** — seleciona o resultado e processa todas as apostas automaticamente
- **Dashboard Usuário** — saldo, estatísticas pessoais e atalhos rápidos
- **Eventos Disponíveis** — lista com filtros por esporte e status, odds exibidas
- **Tela de Aposta** — seleção de palpite, cálculo de retorno potencial em tempo real
- **Histórico de Apostas** — tabela com filtros por status
- **Extrato** — movimentações detalhadas com filtros e resumo financeiro
- **Ranking** — pódio visual top-3 + tabela completa com taxa de vitória

---

*Projeto acadêmico — Disciplina de Desenvolvimento Web — React + Vite + JSON Server*