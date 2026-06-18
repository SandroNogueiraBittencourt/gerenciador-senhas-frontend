import api from "./api";

export async function consultarStatusMfa() {
  const response = await api.get("/mfa/status");
  return response.data;
}

export async function iniciarConfiguracaoMfa() {
  const response = await api.post("/mfa/setup");
  return response.data;
}

export async function confirmarConfiguracaoMfa(codigo) {
  const response = await api.post("/mfa/confirm", { codigo });
  return response.data;
}

export async function desativarMfa(senhaAtual, codigo) {
  const response = await api.post("/mfa/disable", {
    senhaAtual,
    codigo,
  });

  return response.data;
}
