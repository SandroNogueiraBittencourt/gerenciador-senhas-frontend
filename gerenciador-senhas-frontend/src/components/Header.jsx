import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUsuario } from "../services/authService";

function Header({ usuario }) {
  const navigate = useNavigate();
  function sair() {
    logoutUsuario();
    navigate("/login");
  }
  return (
    <header className="header">
      <div className="brand">
        <ShieldCheck size={28} />
        <div>
          <h1>Gerenciador de Senhas</h1>
          <p>Bem-vindo, {usuario?.nome || "Usuário"}</p>
        </div>
      </div>
      <button className="btn btn-outline" onClick={sair}>
        <LogOut size={18} /> Sair
      </button>
    </header>
  );
}
export default Header;
