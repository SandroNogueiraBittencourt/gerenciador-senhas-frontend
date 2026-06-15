import { LogOut } from "lucide-react";
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

      <button className="btn btn-outline" onClick={sair}>
        <LogOut size={18} />
        Sair
      </button>
    </header>
  );
}

export default Header;