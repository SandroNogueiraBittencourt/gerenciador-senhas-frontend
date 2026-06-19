import { Edit, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

function CategoryManager({
  categorias,
  onCadastrar,
  onAtualizar,
  onExcluir,
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formEdicao, setFormEdicao] = useState({
    nome: "",
    descricao: "",
  });

  async function cadastrar(event) {
    event.preventDefault();

    if (!nome.trim()) {
      return;
    }

    await onCadastrar({
      nome: nome.trim(),
      descricao: descricao.trim(),
    });

    setNome("");
    setDescricao("");
  }

  function iniciarEdicao(categoria) {
    setCategoriaEditando(categoria.id);
    setFormEdicao({
      nome: categoria.nome || "",
      descricao: categoria.descricao || "",
    });
  }

  function cancelarEdicao() {
    setCategoriaEditando(null);
    setFormEdicao({
      nome: "",
      descricao: "",
    });
  }

  async function salvarEdicao(categoriaId) {
    if (!formEdicao.nome.trim()) {
      return;
    }

    await onAtualizar(categoriaId, {
      nome: formEdicao.nome.trim(),
      descricao: formEdicao.descricao.trim(),
    });

    cancelarEdicao();
  }

  async function excluir(categoriaId) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta categoria?"
    );

    if (!confirmar) {
      return;
    }

    await onExcluir(categoriaId);
  }

  return (
    <section className="category-manager">
      <form className="category-form" onSubmit={cadastrar}>
        <h3>Gerenciar categorias</h3>

        <input
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder="Nome da categoria"
        />

        <input
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Descrição"
        />

        <button className="btn btn-secondary" type="submit">
          Adicionar categoria
        </button>
      </form>

      <div className="category-list-box">
        <h4>Categorias cadastradas</h4>

        {categorias.length === 0 ? (
          <p className="category-empty">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="category-list">
            {categorias.map((categoria) => (
              <div className="category-item" key={categoria.id}>
                {categoriaEditando === categoria.id ? (
                  <div className="category-edit-form">
                    <input
                      value={formEdicao.nome}
                      onChange={(event) =>
                        setFormEdicao((atual) => ({
                          ...atual,
                          nome: event.target.value,
                        }))
                      }
                      placeholder="Nome da categoria"
                    />

                    <input
                      value={formEdicao.descricao}
                      onChange={(event) =>
                        setFormEdicao((atual) => ({
                          ...atual,
                          descricao: event.target.value,
                        }))
                      }
                      placeholder="Descrição"
                    />

                    <div className="category-actions">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => salvarEdicao(categoria.id)}
                        title="Salvar categoria"
                        aria-label="Salvar categoria"
                      >
                        <Save size={17} />
                      </button>

                      <button
                        type="button"
                        className="icon-button"
                        onClick={cancelarEdicao}
                        title="Cancelar edição"
                        aria-label="Cancelar edição"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="category-info">
                      <strong>{categoria.nome}</strong>
                      <span>
                        {categoria.descricao || "Sem descrição cadastrada"}
                      </span>
                    </div>

                    <div className="category-actions">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => iniciarEdicao(categoria)}
                        title="Editar categoria"
                        aria-label="Editar categoria"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        className="icon-button danger-icon"
                        onClick={() => excluir(categoria.id)}
                        title="Excluir categoria"
                        aria-label="Excluir categoria"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoryManager;