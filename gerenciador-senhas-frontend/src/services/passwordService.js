import api from "./api";

export async function listarSenhas() {
  const response = await api.get("/passwords");
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

export async function excluirSenha(id) {
  await api.delete(`/passwords/${id}`);
}
