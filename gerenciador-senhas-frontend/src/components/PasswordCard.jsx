import { useState } from "react";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";

function PasswordCard({ senha, onEditar, onExcluir }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <article className="password-card">
      <div className="password-card-header">
        <div>
          <h3>{senha.nomeServico}</h3>
          <p>{senha.url || "Sem URL cadastrada"}</p>
        </div>

        <span className="badge">{senha.categoriaNome || "Sem categoria"}</span>
      </div>

      <div className="password-info">
        <p>
          <strong>Login:</strong> {senha.loginServico || "Não informado"}
        </p>

        <div className="password-row">
          <p>
            <strong>Senha:</strong>{" "}
            <span className="password-value">
              {visivel ? senha.senha : "••••••••••••"}
            </span>
          </p>

          <button
            type="button"
            className="icon-button"
            onClick={() => setVisivel(!visivel)}
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
            title={visivel ? "Ocultar senha" : "Mostrar senha"}
          >
            {visivel ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {senha.observacoes && (
          <p>
            <strong>Observações:</strong> {senha.observacoes}
          </p>
        )}
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onEditar(senha)}
        >
          <Edit size={16} />
          Editar
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onExcluir(senha.id)}
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>
    </article>
  );
}

export default PasswordCard;