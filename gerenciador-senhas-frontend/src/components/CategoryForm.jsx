import { useState } from "react";

function CategoryForm({ usuarioId, onCadastrar }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  async function enviar(event) {
    event.preventDefault();
    if (!nome.trim()) return;
    await onCadastrar({ nome, descricao, usuarioId });
    setNome(""); setDescricao("");
  }
  return (
    <form className="category-form" onSubmit={enviar}>
      <h3>Nova categoria</h3>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da categoria" />
      <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" />
      <button className="btn btn-secondary" type="submit">Adicionar</button>
    </form>
  );
}
export default CategoryForm;
