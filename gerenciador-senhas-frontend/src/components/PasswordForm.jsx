import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const estadoInicial = {
  nomeServico: "",
  url: "",
  loginServico: "",
  senha: "",
  observacoes: "",
  categoriaId: "",
};

function calcularCriteriosSenha(senha) {
  return {
    tamanhoMinimo: senha.length >= 8,
    letraMaiuscula: /[A-Z]/.test(senha),
    letraMinuscula: /[a-z]/.test(senha),
    numero: /[0-9]/.test(senha),
    caractereEspecial: /[^A-Za-z0-9]/.test(senha),
  };
}

function calcularForcaSenha(criterios) {
  const totalAtendidos = Object.values(criterios).filter(Boolean).length;

  if (totalAtendidos <= 2) {
    return {
      texto: "Fraca",
      classe: "fraca",
      porcentagem: 33,
    };
  }

  if (totalAtendidos <= 4) {
    return {
      texto: "Média",
      classe: "media",
      porcentagem: 66,
    };
  }

  return {
    texto: "Forte",
    classe: "forte",
    porcentagem: 100,
  };
}

function ItemCriterio({ valido, texto }) {
  return (
    <li className={valido ? "criterio valido" : "criterio invalido"}>
      <span>{valido ? "✓" : "•"}</span>
      {texto}
    </li>
  );
}

function PasswordForm({
  categorias,
  usuarioId,
  senhaEditando,
  onSalvar,
  onCancelar,
}) {
  const [form, setForm] = useState(estadoInicial);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const criteriosSenha = useMemo(
    () => calcularCriteriosSenha(form.senha),
    [form.senha]
  );

  const forcaSenha = useMemo(
    () => calcularForcaSenha(criteriosSenha),
    [criteriosSenha]
  );

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
    } else {
      setForm(estadoInicial);
    }

    setMostrarSenha(false);
  }, [senhaEditando]);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  function enviar(event) {
    event.preventDefault();

    const dados = {
      ...form,
      usuarioId,
      categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
    };

    onSalvar(dados);
    setForm(estadoInicial);
    setMostrarSenha(false);
  }

  return (
    <form className="form-card" onSubmit={enviar} autoComplete="off">
      <h2>{senhaEditando ? "Editar senha" : "Cadastrar nova senha"}</h2>

      <div className="form-grid">
        <label>
          Nome do serviço *
          <input
            name="nomeServico"
            value={form.nomeServico}
            onChange={alterarCampo}
            placeholder="Ex: GitHub"
            required
          />
        </label>

        <label>
          URL
          <input
            name="url"
            value={form.url}
            onChange={alterarCampo}
            placeholder="https://github.com"
          />
        </label>

        <label>
          Login ou e-mail
          <input
            name="loginServico"
            value={form.loginServico}
            onChange={alterarCampo}
            placeholder="usuario@email.com"
          />
        </label>

        <label>
          Senha *
          <div className="password-input-wrapper">
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              value={form.senha}
              onChange={alterarCampo}
              placeholder="Digite a senha"
              required
              autoComplete="new-password"
            />

            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {form.senha && (
            <div className="password-strength-box">
              <div className="password-strength-header">
                <span>Força da senha:</span>
                <strong className={`strength-label ${forcaSenha.classe}`}>
                  {forcaSenha.texto}
                </strong>
              </div>

              <div className="strength-bar">
                <div
                  className={`strength-bar-fill ${forcaSenha.classe}`}
                  style={{ width: `${forcaSenha.porcentagem}%` }}
                />
              </div>

              <ul className="password-criteria-list">
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
              </ul>
            </div>
          )}
        </label>

        <label>
          Categoria
          <select
            name="categoriaId"
            value={form.categoriaId}
            onChange={alterarCampo}
          >
            <option value="">Sem categoria</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="full">
          Observações
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={alterarCampo}
            placeholder="Informações adicionais"
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          {senhaEditando ? "Salvar alterações" : "Cadastrar senha"}
        </button>

        {senhaEditando && (
          <button className="btn btn-outline" type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default PasswordForm;