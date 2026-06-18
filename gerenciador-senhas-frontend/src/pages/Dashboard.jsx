import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import PasswordCard from "../components/PasswordCard";
import PasswordForm from "../components/PasswordForm";
import CategoryManager from "../components/CategoryManager";
import MfaManager from "../components/MfaManager";
import { getUsuarioLogado } from "../services/authService";
import {
  atualizarSenha,
  cadastrarSenha,
  excluirSenha,
  listarSenhas,
} from "../services/passwordService";
import {
  atualizarCategoria,
  cadastrarCategoria,
  excluirCategoria,
  listarCategorias,
} from "../services/categoryService";

function Dashboard() {
  const usuario = getUsuarioLogado();

  const [senhas, setSenhas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [senhaEditando, setSenhaEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarDados() {
    try {
      const [senhasData, categoriasData] = await Promise.all([
        listarSenhas(usuario.id),
        listarCategorias(usuario.id),
      ]);

      setSenhas(senhasData);
      setCategorias(categoriasData);
    } catch (error) {
      setErro("Não foi possível carregar os dados.");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const senhasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return senhas.filter((item) => {
      const correspondeBusca =
        !termo ||
        [item.nomeServico, item.url, item.loginServico, item.categoriaNome]
          .filter(Boolean)
          .some((valor) => valor.toLowerCase().includes(termo));

      const correspondeCategoria =
        categoriaFiltro === "todas" ||
        (categoriaFiltro === "sem-categoria" && !item.categoriaId) ||
        String(item.categoriaId) === categoriaFiltro;

      return correspondeBusca && correspondeCategoria;
    });
  }, [busca, categoriaFiltro, senhas]);

  async function salvarSenha(dados) {
    setMensagem("");
    setErro("");

    try {
      if (senhaEditando) {
        await atualizarSenha(senhaEditando.id, dados);
        setMensagem("Senha atualizada com sucesso.");
      } else {
        await cadastrarSenha(dados);
        setMensagem("Senha cadastrada com sucesso.");
      }

      setSenhaEditando(null);
      await carregarDados();
    } catch (error) {
      setErro("Erro ao salvar a senha.");
    }
  }

  async function removerSenha(id) {
    const confirmar = window.confirm("Deseja realmente excluir esta senha?");

    if (!confirmar) {
      return;
    }

    setMensagem("");
    setErro("");

    try {
      await excluirSenha(id, usuario.id);
      setMensagem("Senha excluída com sucesso.");
      await carregarDados();
    } catch (error) {
      setErro("Erro ao excluir a senha.");
    }
  }

  async function adicionarCategoria(dados) {
    setMensagem("");
    setErro("");

    try {
      await cadastrarCategoria(dados);
      setMensagem("Categoria cadastrada com sucesso.");
      await carregarDados();
    } catch (error) {
      setErro("Erro ao cadastrar categoria.");
    }
  }

  async function editarCategoria(id, dados) {
    setMensagem("");
    setErro("");

    try {
      await atualizarCategoria(id, dados);
      setMensagem("Categoria atualizada com sucesso.");
      await carregarDados();
    } catch (error) {
      setErro("Erro ao atualizar categoria.");
    }
  }

  async function removerCategoria(id) {
    setMensagem("");
    setErro("");

    try {
      await excluirCategoria(id, usuario.id);
      setMensagem("Categoria excluída com sucesso.");

      if (categoriaFiltro === String(id)) {
        setCategoriaFiltro("todas");
      }

      await carregarDados();
    } catch (error) {
      setErro(
        "Erro ao excluir categoria. Verifique se ela está vinculada a alguma senha."
      );
    }
  }


  return (
    <main className="dashboard">
      <Header usuario={usuario} />

      <section className="dashboard-grid">
        <aside className="sidebar">
          <PasswordForm
            categorias={categorias}
            usuarioId={usuario.id}
            senhaEditando={senhaEditando}
            onSalvar={salvarSenha}
            onCancelar={() => setSenhaEditando(null)}
          />

          <CategoryManager
            categorias={categorias}
            usuarioId={usuario.id}
            onCadastrar={adicionarCategoria}
            onAtualizar={editarCategoria}
            onExcluir={removerCategoria}
          />

          <MfaManager />
        </aside>

        <section className="content">
          <div className="content-header">
            <div>
              <h2>Senhas cadastradas</h2>
              <p>Gerencie suas credenciais salvas.</p>
            </div>

            <div className="filters-area">
              <input
                className="search-input"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por serviço, login ou categoria"
              />

              <select
                className="category-filter"
                value={categoriaFiltro}
                onChange={(event) => setCategoriaFiltro(event.target.value)}
              >
                <option value="todas">Todas as categorias</option>
                <option value="sem-categoria">Sem categoria</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={String(categoria.id)}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mensagem && <div className="alert alert-success">{mensagem}</div>}
          {erro && <div className="alert alert-error">{erro}</div>}

          <div className="filter-summary">
            <span>
              Exibindo {senhasFiltradas.length} de {senhas.length} senha(s)
            </span>

            {(busca || categoriaFiltro !== "todas") && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={() => {
                  setBusca("");
                  setCategoriaFiltro("todas");
                }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="password-list">
            {senhasFiltradas.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhuma senha encontrada</h3>
                <p>
                  Cadastre uma nova senha ou ajuste os filtros de busca e
                  categoria.
                </p>
              </div>
            ) : (
              senhasFiltradas.map((senha) => (
                <PasswordCard
                  key={senha.id}
                  senha={senha}
                  onEditar={setSenhaEditando}
                  onExcluir={removerSenha}
                />
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;