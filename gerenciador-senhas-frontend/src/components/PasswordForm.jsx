import { useEffect, useState } from "react";

const estadoInicial = { nomeServico: "", url: "", loginServico: "", senha: "", observacoes: "", categoriaId: "" };

function PasswordForm({ categorias, usuarioId, senhaEditando, onSalvar, onCancelar }) {
  const [form, setForm] = useState(estadoInicial);
  useEffect(() => {
    if (senhaEditando) {
      setForm({
        nomeServico: senhaEditando.nomeServico || "",
        url: senhaEditando.url || "",
        loginServico: senhaEditando.loginServico || "",
        senha: senhaEditando.senha || "",
        observacoes: senhaEditando.observacoes || "",
        categoriaId: senhaEditando.categoriaId || "",
      });
    } else setForm(estadoInicial);
  }, [senhaEditando]);

  function alterarCampo(event) {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }
  function enviar(event) {
    event.preventDefault();
    onSalvar({ ...form, usuarioId, categoriaId: form.categoriaId ? Number(form.categoriaId) : null });
    setForm(estadoInicial);
  }
  return (
    <form className="form-card" onSubmit={enviar} autoComplete="off">
      <h2>{senhaEditando ? "Editar senha" : "Cadastrar nova senha"}</h2>
      <div className="form-grid">
        <label>Nome do serviço *<input name="nomeServico" value={form.nomeServico} onChange={alterarCampo} placeholder="Ex: GitHub" required /></label>
        <label>URL<input name="url" value={form.url} onChange={alterarCampo} placeholder="https://github.com" /></label>
        <label>Login ou e-mail<input name="loginServico" value={form.loginServico} onChange={alterarCampo} placeholder="usuario@email.com" /></label>
        <label>Senha *<input name="senha" type="password" value={form.senha} onChange={alterarCampo} placeholder="Digite a senha" required /></label>
        <label>Categoria<select name="categoriaId" value={form.categoriaId} onChange={alterarCampo}><option value="">Sem categoria</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select></label>
        <label className="full">Observações<textarea name="observacoes" value={form.observacoes} onChange={alterarCampo} placeholder="Informações adicionais" /></label>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">{senhaEditando ? "Salvar alterações" : "Cadastrar senha"}</button>
        {senhaEditando && <button className="btn btn-outline" type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  );
}
export default PasswordForm;
