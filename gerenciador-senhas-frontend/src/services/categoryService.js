import api from "./api";

export async function listarCategorias(usuarioId) {
  const response = await api.get(`/categories?usuarioId=${usuarioId}`);
  return response.data;
}

export async function cadastrarCategoria(dados) {
  const response = await api.post("/categories", dados);
  return response.data;
}

export async function atualizarCategoria(id, dados) {
  const response = await api.put(`/categories/${id}`, dados);
  return response.data;
}

export async function excluirCategoria(id, usuarioId) {
  await api.delete(`/categories/${id}?usuarioId=${usuarioId}`);
}