import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUsuario } from "../services/authService";
import logoNexoVaultMinimalista from "../assets/logo-nexovault-minimalista-transparent.svg";

function Header({ usuario }) {
  const navigate = useNavigate();

  function sair() {
    logoutUsuario();
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="brand">
        <img
          src={logoNexoVaultMinimalista}
          alt="Logo NexoVault"
          className="brand-logo"
        />

        <div>
          <h1>NexoVault</h1>
          <p>Bem-vindo, {usuario?.nome || "Usuário"}</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} />
          Configurações
        </button>

        <button className="btn btn-outline" type="button" onClick={sair}>
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
