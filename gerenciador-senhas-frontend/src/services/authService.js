import api from "./api";

const USUARIO_KEY = "usuarioLogado";

export async function cadastrarUsuario(dados) {
  const response = await api.post("/auth/register", dados);
  return response.data;
}

export async function loginUsuario(dados) {
  const response = await api.post("/auth/login", dados);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(response.data));
  return response.data;
}

export function getUsuarioLogado() {
  const usuario = localStorage.getItem(USUARIO_KEY);
  return usuario ? JSON.parse(usuario) : null;
}

export function logoutUsuario() {
  localStorage.removeItem(USUARIO_KEY);
}
