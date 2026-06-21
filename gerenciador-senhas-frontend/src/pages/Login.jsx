import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginUsuario, verificarMfaLogin } from "../services/authService";
import logoNexoVault from "../assets/logo-nexovault-transparent.svg";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [codigoMfa, setCodigoMfa] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [mfaPendente, setMfaPendente] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemRecuperacao, setMensagemRecuperacao] = useState("");

  function alterarCampo(event) {
    const { name, value } = event.target;

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  async function entrar(event) {
    event.preventDefault();
    setErro("");

    try {
      const resposta = await loginUsuario(form);

      if (resposta.status === "MFA_REQUIRED") {
        setMfaToken(resposta.mfaToken);
        setMfaPendente(true);
        setCodigoMfa("");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setErro("E-mail ou senha inválidos.");
    }
  }

  async function confirmarMfa(event) {
    event.preventDefault();
    setErro("");

    try {
      await verificarMfaLogin(mfaToken, codigoMfa);
      navigate("/dashboard");
    } catch (error) {
      setErro("Código MFA inválido ou expirado.");
    }
  }

  function voltarParaLogin() {
    setMfaPendente(false);
    setMfaToken("");
    setCodigoMfa("");
    setErro("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo-wrapper">
          <img
            src={logoNexoVault}
            alt="Logo NexoVault"
            className="auth-logo"
          />
        </div>

        <h1>Gerenciador de Senhas</h1>
        <p>
          {mfaPendente
            ? "Digite o código do aplicativo autenticador."
            : "Acesse sua conta para gerenciar suas senhas."}
        </p>

        {erro && <div className="alert alert-error">{erro}</div>}

        {!mfaPendente ? (
          <form onSubmit={entrar}>
            <label>
              E-mail
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={alterarCampo}
                required
              />
            </label>

            <label>
              Senha
              <div className="password-input-wrapper">
                <input
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={form.senha}
                  onChange={alterarCampo}
                  required
                />

                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <button className="btn btn-primary full-button" type="submit">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={confirmarMfa}>
            <div className="mfa-login-icon">
              <ShieldCheck size={36} />
            </div>

            <label>
              Código MFA
              <input
                value={codigoMfa}
                onChange={(event) =>
                  setCodigoMfa(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                required
              />
            </label>

            <button className="btn btn-primary full-button" type="submit">
              Verificar código
            </button>

            <button
              className="btn btn-outline full-button"
              type="button"
              onClick={voltarParaLogin}
            >
              Voltar
            </button>
          </form>
        )}

        {!mfaPendente && (
          <>
            <p className="auth-link">
              Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>

            <div className="forgot-password-area">
              <button
                type="button"
                className="forgot-password-button"
                onClick={() =>
                  setMensagemRecuperacao(
                    "Sentimos muito pela sua perda, mas por motivos de segurança não realizamos recuperação de senha de login!"
                  )
                }
              >
                Esqueceu senha?
              </button>

              {mensagemRecuperacao && (
                <div className="alert alert-warning recovery-message">
                  {mensagemRecuperacao}
                </div>
              )}
            </div>
          </>
        )}

      </section>
    </main>
  );
}

export default Login;
