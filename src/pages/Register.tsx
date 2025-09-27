import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Registrarse</h1>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}
