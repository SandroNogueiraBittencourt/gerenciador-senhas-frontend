import api from "./api";

export async function listarCategorias(usuarioId) {
  const response = await api.get(`/categories?usuarioId=${usuarioId}`);
  return response.data;
}

export async function cadastrarCategoria(dados) {
  const response = await api.post("/categories", dados);
  return response.data;
}
