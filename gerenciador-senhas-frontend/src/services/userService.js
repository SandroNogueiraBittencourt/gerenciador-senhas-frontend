import api from "./api";

export async function buscarInformacoesConta() {
  const response = await api.get("/users/account-info");
  return response.data;
}

export async function alterarSenha(dados) {
  const response = await api.put("/users/change-password", dados);
  return response.data;
}

export async function alterarEmail(dados) {
  const response = await api.put("/users/change-email", dados);
  return response.data;
}

export async function exportarDados() {
  const response = await api.get("/users/export-data", {
    responseType: "blob",
  });

  return response;
}

export async function excluirConta(dados) {
  const response = await api.delete("/users/delete-account", {
    data: dados,
  });

  return response.data;
}
