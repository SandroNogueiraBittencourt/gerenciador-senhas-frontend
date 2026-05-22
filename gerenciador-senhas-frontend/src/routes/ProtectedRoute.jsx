import { Navigate } from "react-router-dom";
import { getUsuarioLogado } from "../services/authService";

function ProtectedRoute({ children }) {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
