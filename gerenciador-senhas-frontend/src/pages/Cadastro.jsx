import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { cadastrarUsuario } from "../services/authService";
import logoNexoVault from "../assets/logo-nexovault.png";

function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  async function cadastrar(event) {
    event.preventDefault();
    setErro("");

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      await cadastrarUsuario({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });

      navigate("/login");
    } catch {
      setErro("Não foi possível cadastrar o usuário.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>
          < img src={logoNexoVault} alt="Logo NexoVault" className="auth-logo" />
        </div>

        <h1>Criar conta</h1>
        <p>Cadastre-se para começar a usar o sistema.</p>

        {erro && <div className="alert alert-error">{erro}</div>}

        <form onSubmit={cadastrar}>
          <label>
            Nome
            <input
              name="nome"
              value={form.nome}
              onChange={alterarCampo}
              placeholder="Seu nome"
              required
            />
          </label>

          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={alterarCampo}
              placeholder="seuemail@email.com"
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
                placeholder="Digite sua senha"
                required
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setMostrarSenha((atual) => !atual)}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>

          <label>
            Confirmar senha
            <div className="password-input-wrapper">
              <input
                name="confirmarSenha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={form.confirmarSenha}
                onChange={alterarCampo}
                placeholder="Confirme sua senha"
                required
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setMostrarConfirmarSenha((atual) => !atual)
                }
                title={
                  mostrarConfirmarSenha
                    ? "Ocultar confirmação de senha"
                    : "Mostrar confirmação de senha"
                }
                aria-label={
                  mostrarConfirmarSenha
                    ? "Ocultar confirmação de senha"
                    : "Mostrar confirmação de senha"
                }
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </label>

          <button className="btn btn-primary full-button" type="submit">
            Cadastrar
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default Cadastro;