import api from "./api";

const USUARIO_KEY = "usuarioLogado";
const TOKEN_KEY = "tokenAcesso";

function salvarSessao(dados) {
  if (dados?.usuario && dados?.token) {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(dados.usuario));
    localStorage.setItem(TOKEN_KEY, dados.token);
  }
}

export async function cadastrarUsuario(dados) {
  const response = await api.post("/auth/register", dados);
  return response.data;
}

export async function loginUsuario(dados) {
  const response = await api.post("/auth/login", dados);

  if (response.data.status === "AUTHENTICATED") {
    salvarSessao(response.data);
  }

  return response.data;
}

export async function verificarMfaLogin(mfaToken, codigo) {
  const response = await api.post("/auth/mfa/verify", {
    mfaToken,
    codigo,
  });

  if (response.data.status === "AUTHENTICATED") {
    salvarSessao(response.data);
  }

  return response.data;
}

export function getUsuarioLogado() {
  const usuario = localStorage.getItem(USUARIO_KEY);
  return usuario ? JSON.parse(usuario) : null;
}

export function getTokenAcesso() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logoutUsuario() {
  localStorage.removeItem(USUARIO_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
