import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { loginUsuario } from "../services/authService";
import logoNexoVault from "../assets/logo-nexovault.png";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  function alterarCampo(event) { const { name, value } = event.target; setForm((atual) => ({ ...atual, [name]: value })); }
  async function entrar(event) {
    event.preventDefault(); setErro("");
    try { await loginUsuario(form); navigate("/dashboard"); } catch { setErro("E-mail ou senha inválidos."); }
  }
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>< img src={logoNexoVault} alt="Logo NexoVault" className="auth-logo" /></div>
        <div>
          <h1>Gerenciador de Senhas</h1>
        </div>
        <p>Acesse sua conta para gerenciar suas senhas.</p>
        {erro &&
          <div className="alert alert-error">{erro}</div>}
        <form onSubmit={entrar}>
          <label>E-mail
            <input name="email" type="email" value={form.email} onChange={alterarCampo} required />
          </label>
          <label>Senha<input name="senha" type="password" value={form.senha} onChange={alterarCampo} required />
          </label>
          <button className="btn btn-primary full-button" type="submit">Entrar</button>
        </form>
        <p className="auth-link">Não tem conta?
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
  );
}
export default Login;
