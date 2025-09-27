import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Iniciar sesión</h1>
      <p>
        ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
      </p>
    </div>
  );
}
