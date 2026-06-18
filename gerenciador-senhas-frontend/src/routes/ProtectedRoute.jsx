import { Navigate } from "react-router-dom";
import { getTokenAcesso, getUsuarioLogado } from "../services/authService";

function ProtectedRoute({ children }) {
  const usuario = getUsuarioLogado();
  const token = getTokenAcesso();

  if (!usuario || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
