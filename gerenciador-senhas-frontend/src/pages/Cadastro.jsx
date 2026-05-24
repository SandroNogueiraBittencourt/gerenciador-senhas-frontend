import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { cadastrarUsuario } from "../services/authService";

function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
  const [erro, setErro] = useState("");
  function alterarCampo(event) { const { name, value } = event.target; setForm((atual) => ({ ...atual, [name]: value })); }
  async function cadastrar(event) {
    event.preventDefault(); setErro("");
    if (form.senha !== form.confirmarSenha) { setErro("As senhas não conferem."); return; }
    try { await cadastrarUsuario({ nome: form.nome, email: form.email, senha: form.senha }); navigate("/login"); } catch { setErro("Não foi possível cadastrar o usuário."); }
  }
  return (
    <main className="auth-page"><section className="auth-card"><div className="auth-icon"><UserPlus size={36} /></div><h1>Criar conta</h1><p>Cadastre-se para começar a usar o sistema.</p>{erro && <div className="alert alert-error">{erro}</div>}<form onSubmit={cadastrar}><label>Nome<input name="nome" value={form.nome} onChange={alterarCampo} required /></label><label>E-mail<input name="email" type="email" value={form.email} onChange={alterarCampo} required /></label><label>Senha<input name="senha" type="password" value={form.senha} onChange={alterarCampo} required /></label><label>Confirmar senha<input name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={alterarCampo} required /></label><button className="btn btn-primary full-button" type="submit">Cadastrar</button></form><p className="auth-link">Já tem conta? <Link to="/login">Entrar</Link></p></section></main>
  );
}
export default Cadastro;
