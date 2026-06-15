import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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

  const criteriosSenha = {
    tamanhoMinimo: form.senha.length >= 8,
    letraMaiuscula: /[A-Z]/.test(form.senha),
    letraMinuscula: /[a-z]/.test(form.senha),
    numero: /[0-9]/.test(form.senha),
    caractereEspecial: /[^A-Za-z0-9]/.test(form.senha),
    senhasConferem:
      form.senha.length > 0 &&
      form.confirmarSenha.length > 0 &&
      form.senha === form.confirmarSenha,
  };

  const senhaValida =
    criteriosSenha.tamanhoMinimo &&
    criteriosSenha.letraMaiuscula &&
    criteriosSenha.letraMinuscula &&
    criteriosSenha.numero &&
    criteriosSenha.caractereEspecial &&
    criteriosSenha.senhasConferem;

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

    if (!senhaValida) {
      setErro("A senha não atende aos critérios de segurança.");
      return;
    }

    try {
      await cadastrarUsuario({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });

      navigate("/login");
    } catch (error) {
      setErro("Não foi possível cadastrar o usuário.");
    }
  }

  function ItemCriterio({ valido, texto }) {
    return (
      <li className={valido ? "criterio valido" : "criterio invalido"}>
        <span>{valido ? "✓" : "•"}</span>
        {texto}
      </li>
    );
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

          <label>
            Confirmar senha
            <div className="password-input-wrapper">
              <input
                name="confirmarSenha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={form.confirmarSenha}
                onChange={alterarCampo}
                required
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setMostrarConfirmarSenha(!mostrarConfirmarSenha)
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

          <div className="password-criteria-box">
            <p>Critérios da senha:</p>

            <ul>
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
                valido={criteriosSenha.senhasConferem}
                texto="Senha e confirmação devem ser iguais"
              />
            </ul>
          </div>

          <button
            className="btn btn-primary full-button"
            type="submit"
            disabled={!senhaValida}
          >
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