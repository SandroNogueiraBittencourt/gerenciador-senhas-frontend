import api from "./api";

export async function listarSenhas(usuarioId) {
  const response = await api.get(`/passwords?usuarioId=${usuarioId}`);
  return response.data;
}

export async function cadastrarSenha(dados) {
  const response = await api.post("/passwords", dados);
  return response.data;
}

export async function atualizarSenha(id, dados) {
  const response = await api.put(`/passwords/${id}`, dados);
  return response.data;
}

export async function excluirSenha(id, usuarioId) {
  await api.delete(`/passwords/${id}?usuarioId=${usuarioId}`);
}
