import api from "./api";

export async function listarCategorias() {
  const response = await api.get("/categories");
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

export async function excluirCategoria(id) {
  await api.delete(`/categories/${id}`);
}
