const BASE_URL = 'http://localhost:3000'

// JSON Server 1.x beta retorna { value: [...], Count: N } em vez de array
// Esta função normaliza a resposta para sempre retornar um array
function normalizar(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.value)) return data.value
  if (data && typeof data === 'object' && !data.id) return []
  return data // objeto único (busca por ID)
}

// ── Usuários ──────────────────────────────────────────────
export function buscarUsuarios() {
  return fetch(`${BASE_URL}/usuarios`)
    .then((res) => res.json())
    .then(normalizar)
}

export function buscarUsuarioPorId(id) {
  return fetch(`${BASE_URL}/usuarios/${id}`)
    .then((res) => res.json())
}

export function atualizarUsuario(id, dados) {
  return fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => res.json())
}

// ── Eventos ───────────────────────────────────────────────
export function buscarEventos() {
  return fetch(`${BASE_URL}/eventos`)
    .then((res) => res.json())
    .then(normalizar)
}

export function buscarEventoPorId(id) {
  return fetch(`${BASE_URL}/eventos/${id}`)
    .then((res) => res.json())
}

export function criarEvento(dados) {
  return fetch(`${BASE_URL}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => res.json())
}

export function atualizarEvento(id, dados) {
  return fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => res.json())
}

export function deletarEvento(id) {
  return fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'DELETE',
  })
}

// ── Apostas ───────────────────────────────────────────────
export function buscarApostas() {
  return fetch(`${BASE_URL}/apostas`)
    .then((res) => res.json())
    .then(normalizar)
}

export function buscarApostasPorUsuario(usuarioId) {
  return fetch(`${BASE_URL}/apostas`)
    .then((res) => res.json())
    .then(normalizar)
    .then((lista) =>
      lista.filter((a) => String(a.usuarioId) === String(usuarioId))
    )
}

export function buscarApostasPorEvento(eventoId) {
  return fetch(`${BASE_URL}/apostas`)
    .then((res) => res.json())
    .then(normalizar)
    .then((lista) =>
      lista.filter((a) => String(a.eventoId) === String(eventoId))
    )
}

export function criarAposta(dados) {
  return fetch(`${BASE_URL}/apostas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => res.json())
}

export function atualizarAposta(id, dados) {
  return fetch(`${BASE_URL}/apostas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => res.json())
}

// ── Extrato ───────────────────────────────────────────────
export function buscarExtratoPorUsuario(usuarioId) {
  return fetch(`${BASE_URL}/extrato`)
    .then((res) => res.json())
    .then(normalizar)
    .then((lista) =>
      lista.filter((e) => String(e.usuarioId) === String(usuarioId))
    )
}

export function criarExtrato(dados) {
  return fetch(`${BASE_URL}/extrato`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then((res) => res.json())
}
