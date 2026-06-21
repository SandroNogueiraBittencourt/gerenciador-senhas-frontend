import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  atualizarUsuarioLogado,
  getUsuarioLogado,
  logoutUsuario,
} from "../services/authService";
import {
  alterarEmail,
  alterarSenha,
  buscarInformacoesConta,
  excluirConta,
  exportarDados,
} from "../services/userService";

const senhaInicial = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const emailInicial = {
  newEmail: "",
  confirmNewEmail: "",
};

function calcularCriteriosSenha(senha) {
  return {
    tamanhoMinimo: senha.length >= 8,
    letraMaiuscula: /[A-Z]/.test(senha),
    letraMinuscula: /[a-z]/.test(senha),
    numero: /[0-9]/.test(senha),
    caractereEspecial: /[^A-Za-z0-9]/.test(senha),
  };
}

function calcularForcaSenha(criterios) {
  const totalAtendidos = Object.values(criterios).filter(Boolean).length;

  if (totalAtendidos <= 2) {
    return {
      texto: "Fraca",
      classe: "fraca",
      porcentagem: 33,
    };
  }

  if (totalAtendidos <= 4) {
    return {
      texto: "Média",
      classe: "media",
      porcentagem: 66,
    };
  }

  return {
    texto: "Forte",
    classe: "forte",
    porcentagem: 100,
  };
}

function ItemCriterio({ valido, texto }) {
  return (
    <li className={valido ? "criterio valido" : "criterio invalido"}>
      <span>{valido ? "✓" : "•"}</span>
      {texto}
    </li>
  );
}

function extrairMensagemErro(error, fallback) {
  return (
    error.response?.data?.erro ||
    error.response?.data?.message ||
    Object.values(error.response?.data?.erros || {})[0] ||
    fallback
  );
}

function formatarData(data) {
  if (!data) {
    return "-";
  }

  return new Date(data).toLocaleString("pt-BR");
}

function obterNomeArquivo(response, email) {
  const contentDisposition = response.headers?.["content-disposition"];
  const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);

  if (match?.[1]) {
    return decodeURIComponent(match[1]);
  }

  const agora = new Date();
  const partes = [
    String(agora.getDate()).padStart(2, "0"),
    String(agora.getMonth() + 1).padStart(2, "0"),
    agora.getFullYear(),
    String(agora.getHours()).padStart(2, "0"),
    String(agora.getMinutes()).padStart(2, "0"),
    String(agora.getSeconds()).padStart(2, "0"),
  ];

  const emailSeguro = (email || "usuario").replace(/[^A-Za-z0-9._-]/g, "_");
  return `NexoVault-${emailSeguro}-${partes.join("-")}.txt`;
}

function Settings() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const [conta, setConta] = useState(null);
  const [senhaForm, setSenhaForm] = useState(senhaInicial);
  const [emailForm, setEmailForm] = useState(emailInicial);
  const [senhaExclusao, setSenhaExclusao] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarNovaSenha, setMostrarConfirmarNovaSenha] = useState(false);
  const [mostrarSenhaExclusao, setMostrarSenhaExclusao] = useState(false);

  const criteriosSenha = useMemo(
    () => calcularCriteriosSenha(senhaForm.newPassword),
    [senhaForm.newPassword]
  );

  const forcaSenha = useMemo(
    () => calcularForcaSenha(criteriosSenha),
    [criteriosSenha]
  );

  const novaSenhaForte = useMemo(
    () => Object.values(criteriosSenha).every(Boolean),
    [criteriosSenha]
  );

  const senhasIguais = useMemo(() => {
    return (
      senhaForm.newPassword.length > 0 &&
      senhaForm.confirmNewPassword.length > 0 &&
      senhaForm.newPassword === senhaForm.confirmNewPassword
    );
  }, [senhaForm.newPassword, senhaForm.confirmNewPassword]);

  async function carregarConta() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await buscarInformacoesConta();
      setConta(dados);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Erro ao carregar informações da conta."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarConta();
  }, []);

  function alterarCampoSenha(event) {
    const { name, value } = event.target;
    setSenhaForm((atual) => ({ ...atual, [name]: value }));
  }

  function alterarCampoEmail(event) {
    const { name, value } = event.target;
    setEmailForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviarAlteracaoSenha(event) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    if (!novaSenhaForte) {
      setErro(
        "A nova senha deve atender todos os critérios de segurança: mínimo de 8 caracteres, letra maiúscula, letra minúscula, número e caractere especial."
      );
      return;
    }

    if (senhaForm.newPassword !== senhaForm.confirmNewPassword) {
      setErro("A nova senha e a confirmação devem ser idênticas.");
      return;
    }

    setProcessando(true);

    try {
      await alterarSenha({
        currentPassword: senhaForm.currentPassword,
        newPassword: senhaForm.newPassword,
      });

      setSenhaForm(senhaInicial);
      setMostrarSenhaAtual(false);
      setMostrarNovaSenha(false);
      setMostrarConfirmarNovaSenha(false);
      setMensagem("Senha atualizada com sucesso.");
    } catch (error) {
      setErro(extrairMensagemErro(error, "Erro ao alterar senha."));
    } finally {
      setProcessando(false);
    }
  }

  async function enviarAlteracaoEmail(event) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    if (emailForm.newEmail !== emailForm.confirmNewEmail) {
      setErro("O novo e-mail e a confirmação devem ser idênticos.");
      return;
    }

    setProcessando(true);

    try {
      await alterarEmail({ newEmail: emailForm.newEmail });
      const contaAtualizada = await buscarInformacoesConta();
      setConta(contaAtualizada);

      if (usuario) {
        atualizarUsuarioLogado({ ...usuario, email: contaAtualizada.email });
      }

      setEmailForm(emailInicial);
      setMensagem("E-mail atualizado com sucesso.");
    } catch (error) {
      setErro(extrairMensagemErro(error, "Erro ao alterar e-mail."));
    } finally {
      setProcessando(false);
    }
  }

  async function baixarExportacao() {
    setMensagem("");
    setErro("");
    setProcessando(true);

    try {
      const response = await exportarDados();
      const nomeArquivo = obterNomeArquivo(response, conta?.email || usuario?.email);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");

      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMensagem("Dados exportados com sucesso.");
    } catch (error) {
      setErro(extrairMensagemErro(error, "Erro ao exportar dados."));
    } finally {
      setProcessando(false);
    }
  }

  async function confirmarExclusaoConta(event) {
    event.preventDefault();
    setMensagem("");
    setErro("");

    if (!senhaExclusao.trim()) {
      setErro("Informe sua senha atual para confirmar a exclusão da conta.");
      return;
    }

    setProcessando(true);

    try {
      await excluirConta({ currentPassword: senhaExclusao });
      logoutUsuario();
      navigate("/login", { replace: true });
    } catch (error) {
      setErro(extrairMensagemErro(error, "Erro ao excluir conta."));
    } finally {
      setProcessando(false);
    }
  }

  return (
    <main className="dashboard">
      <Header usuario={usuario} />

      <section className="settings-page">
        <div className="settings-header">
          <div>
            <h2>Configurações</h2>
            <p>Gerencie segurança, dados e preferências da sua conta NexoVault.</p>
          </div>

          <button className="btn btn-outline" type="button" onClick={() => navigate("/dashboard")}>
            Voltar ao dashboard
          </button>
        </div>

        {mensagem && <div className="alert alert-success">{mensagem}</div>}
        {erro && <div className="alert alert-error">{erro}</div>}

        {carregando ? (
          <div className="empty-state">Carregando configurações...</div>
        ) : (
          <div className="settings-grid">
            <section className="settings-card">
              <div className="settings-card-header">
                <User size={22} />
                <h3>Informações da Conta</h3>
              </div>

              <div className="account-info-list">
                <div>
                  <span>Nome do Usuário</span>
                  <strong>{conta?.nome || "-"}</strong>
                </div>

                <div>
                  <span>E-mail Atual</span>
                  <strong>{conta?.email || "-"}</strong>
                </div>

                <div>
                  <span>Data de Criação</span>
                  <strong>{formatarData(conta?.dataCriacao)}</strong>
                </div>

                <div>
                  <span>Quantidade de Senhas Salvas</span>
                  <strong>{conta?.quantidadeSenhas ?? 0}</strong>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card-header">
                <KeyRound size={22} />
                <h3>Alterar Senha</h3>
              </div>

              <form className="settings-form" onSubmit={enviarAlteracaoSenha}>
                <label>
                  Senha Atual
                  <div className="password-input-wrapper">
                    <input
                      name="currentPassword"
                      type={mostrarSenhaAtual ? "text" : "password"}
                      value={senhaForm.currentPassword}
                      onChange={alterarCampoSenha}
                      required
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                      aria-label={mostrarSenhaAtual ? "Ocultar senha atual" : "Mostrar senha atual"}
                      title={mostrarSenhaAtual ? "Ocultar senha atual" : "Mostrar senha atual"}
                    >
                      {mostrarSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>

                <label>
                  Confirmar Nova Senha
                  <div className="password-input-wrapper">
                    <input
                      name="confirmNewPassword"
                      type={mostrarConfirmarNovaSenha ? "text" : "password"}
                      value={senhaForm.confirmNewPassword}
                      onChange={alterarCampoSenha}
                      minLength={8}
                      required
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() => setMostrarConfirmarNovaSenha(!mostrarConfirmarNovaSenha)}
                      aria-label={
                        mostrarConfirmarNovaSenha
                          ? "Ocultar confirmação da nova senha"
                          : "Mostrar confirmação da nova senha"
                      }
                      title={
                        mostrarConfirmarNovaSenha
                          ? "Ocultar confirmação da nova senha"
                          : "Mostrar confirmação da nova senha"
                      }
                    >
                      {mostrarConfirmarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>

                <label>
                  Nova Senha
                  <div className="password-input-wrapper">
                    <input
                      name="newPassword"
                      type={mostrarNovaSenha ? "text" : "password"}
                      value={senhaForm.newPassword}
                      onChange={alterarCampoSenha}
                      minLength={8}
                      required
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                      aria-label={mostrarNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"}
                      title={mostrarNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"}
                    >
                      {mostrarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {senhaForm.newPassword && (
                    <div className="password-strength-box">
                      <div className="password-strength-header">
                        <span>Força da senha:</span>
                        <strong className={`strength-label ${forcaSenha.classe}`}>
                          {forcaSenha.texto}
                        </strong>
                      </div>

                      <div className="strength-bar">
                        <div
                          className={`strength-bar-fill ${forcaSenha.classe}`}
                          style={{ width: `${forcaSenha.porcentagem}%` }}
                        />
                      </div>

                      <ul className="password-criteria-list">
                        <ItemCriterio
                          valido={criteriosSenha.tamanhoMinimo}
                          texto="Mínimo de 8 caracteres"
                        />

                        <ItemCriterio
                          valido={criteriosSenha.letraMaiuscula}
                          texto="Pelo menos uma letra maiúscula"
                        />

                        <ItemCriterio
                          valido={criteriosSenha.letraMinuscula}
                          texto="Pelo menos uma letra minúscula"
                        />

                        <ItemCriterio
                          valido={criteriosSenha.numero}
                          texto="Pelo menos um número"
                        />

                        <ItemCriterio
                          valido={criteriosSenha.caractereEspecial}
                          texto="Pelo menos um caractere especial"
                        />
                        <ItemCriterio
                          valido={senhasIguais}
                          texto="Nova senha e confirmação são iguais"
                        />
                      </ul>
                    </div>
                  )}
                </label>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={processando || !novaSenhaForte || !senhasIguais}
                >
                  Atualizar Senha
                </button>
              </form>
            </section>

            <section className="settings-card">
              <div className="settings-card-header">
                <Mail size={22} />
                <h3>Alterar E-mail</h3>
              </div>

              <form className="settings-form" onSubmit={enviarAlteracaoEmail}>
                <label>
                  Novo E-mail
                  <input
                    name="newEmail"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={alterarCampoEmail}
                    required
                  />
                </label>

                <label>
                  Confirmar Novo E-mail
                  <input
                    name="confirmNewEmail"
                    type="email"
                    value={emailForm.confirmNewEmail}
                    onChange={alterarCampoEmail}
                    required
                  />
                </label>

                <button className="btn btn-primary" type="submit" disabled={processando}>
                  Atualizar E-mail
                </button>
              </form>
            </section>

            <section className="settings-card">
              <div className="settings-card-header">
                <Download size={22} />
                <h3>Exportar Dados</h3>
              </div>

              <p className="settings-description">
                Exporta todas as suas senhas e categorias em um arquivo de texto.
                O arquivo conterá senhas em texto plano; guarde-o com cuidado.
              </p>

              <button className="btn btn-secondary" type="button" onClick={baixarExportacao} disabled={processando}>
                Exportar Dados
              </button>
            </section>

            <section className="settings-card danger-card">
              <div className="settings-card-header">
                <AlertTriangle size={22} />
                <h3>Excluir Conta</h3>
              </div>

              <p className="settings-description">
                Esta ação é irreversível. Ela remove permanentemente sua conta,
                senhas, categorias e dados de MFA vinculados ao usuário.
              </p>

              {!confirmarExclusao ? (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => setConfirmarExclusao(true)}
                >
                  <Trash2 size={18} />
                  Excluir Minha Conta
                </button>
              ) : (
                <form className="settings-form" onSubmit={confirmarExclusaoConta}>
                  <label>
                    Digite sua senha atual para confirmar
                    <div className="password-input-wrapper">
                      <input
                        type={mostrarSenhaExclusao ? "text" : "password"}
                        value={senhaExclusao}
                        onChange={(event) => setSenhaExclusao(event.target.value)}
                        required
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        className="password-toggle-button"
                        onClick={() => setMostrarSenhaExclusao(!mostrarSenhaExclusao)}
                        aria-label={mostrarSenhaExclusao ? "Ocultar senha" : "Mostrar senha"}
                        title={mostrarSenhaExclusao ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {mostrarSenhaExclusao ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </label>

                  <div className="form-actions">
                    <button className="btn btn-danger" type="submit" disabled={processando}>
                      Confirmar Exclusão
                    </button>

                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => {
                        setConfirmarExclusao(false);
                        setSenhaExclusao("");
                        setMostrarSenhaExclusao(false);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default Settings;
