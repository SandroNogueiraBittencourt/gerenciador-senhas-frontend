import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import PasswordCard from "../components/PasswordCard";
import PasswordForm from "../components/PasswordForm";
import CategoryForm from "../components/CategoryForm";
import { getUsuarioLogado } from "../services/authService";
import { atualizarSenha, cadastrarSenha, excluirSenha, listarSenhas } from "../services/passwordService";
import { cadastrarCategoria, listarCategorias } from "../services/categoryService";

function Dashboard() {
  const usuario = getUsuarioLogado();
  const [senhas, setSenhas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [senhaEditando, setSenhaEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarDados() {
    try {
      const [senhasData, categoriasData] = await Promise.all([listarSenhas(usuario.id), listarCategorias(usuario.id)]);
      setSenhas(senhasData); setCategorias(categoriasData);
    } catch { setErro("Não foi possível carregar os dados."); }
  }
  useEffect(() => { carregarDados(); }, []);

  const senhasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return senhas;
    return senhas.filter((item) => [item.nomeServico, item.url, item.loginServico, item.categoriaNome].filter(Boolean).some((valor) => valor.toLowerCase().includes(termo)));
  }, [busca, senhas]);

  async function salvarSenha(dados) {
    setMensagem(""); setErro("");
    try {
      if (senhaEditando) { await atualizarSenha(senhaEditando.id, dados); setMensagem("Senha atualizada com sucesso."); }
      else { await cadastrarSenha(dados); setMensagem("Senha cadastrada com sucesso."); }
      setSenhaEditando(null); await carregarDados();
    } catch { setErro("Erro ao salvar a senha."); }
  }
  async function removerSenha(id) {
    if (!window.confirm("Deseja realmente excluir esta senha?")) return;
    setMensagem(""); setErro("");
    try { await excluirSenha(id, usuario.id); setMensagem("Senha excluída com sucesso."); await carregarDados(); } catch { setErro("Erro ao excluir a senha."); }
  }
  async function adicionarCategoria(dados) {
    setMensagem(""); setErro("");
    try { await cadastrarCategoria(dados); setMensagem("Categoria cadastrada com sucesso."); await carregarDados(); } catch { setErro("Erro ao cadastrar categoria."); }
  }

  return (
    <main className="dashboard"><Header usuario={usuario} /><section className="dashboard-grid"><aside className="sidebar"><PasswordForm categorias={categorias} usuarioId={usuario.id} senhaEditando={senhaEditando} onSalvar={salvarSenha} onCancelar={() => setSenhaEditando(null)} /><CategoryForm usuarioId={usuario.id} onCadastrar={adicionarCategoria} /></aside><section className="content"><div className="content-header"><div><h2>Senhas cadastradas</h2><p>Gerencie suas credenciais salvas.</p></div><input className="search-input" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por serviço, login ou categoria" /></div>{mensagem && <div className="alert alert-success">{mensagem}</div>}{erro && <div className="alert alert-error">{erro}</div>}<div className="password-list">{senhasFiltradas.length === 0 ? <div className="empty-state"><h3>Nenhuma senha encontrada</h3><p>Cadastre uma nova senha para começar.</p></div> : senhasFiltradas.map((senha) => <PasswordCard key={senha.id} senha={senha} onEditar={setSenhaEditando} onExcluir={removerSenha} />)}</div></section></section></main>
  );
}
export default Dashboard;
