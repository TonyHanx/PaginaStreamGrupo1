import { Link } from "react-router-dom";
import "../styles/auth.css";

import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";
import appleIcon from "../assets/icons/apple.svg";

export default function Register() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí luego se podrá agregar la lógica de registro (por ejemplo, enviar datos a un backend)
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Registrarse</h1>

        <form onSubmit={onSubmit}>
          {/* Nombre de usuario */}
          <label className="form-label">Nombre de usuario</label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="tuUsuario"
              required
            />
          </div>

          {/* Correo electrónico */}
          <label className="form-label">E-mail</label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          {/* Contraseña */}
          <label className="form-label">Contraseña</label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirmar contraseña */}
          <label className="form-label">Confirmar contraseña</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="primary-btn mt-3">
            Registrarte
          </button>
        </form>

        {/* Separador */}
        <div className="divider my-4">
          <span>O continúa con</span>
        </div>

        {/* Botones sociales */}
        <div className="d-flex justify-content-center gap-3 mb-2">
          <button className="provider-btn" type="button" aria-label="Google">
            <img src={googleIcon} alt="Google" />
          </button>
          <button className="provider-btn" type="button" aria-label="Facebook">
            <img src={facebookIcon} alt="Facebook" />
          </button>
          <button className="provider-btn" type="button" aria-label="Apple">
            <img src={appleIcon} alt="Apple" />
          </button>
        </div>

        {/* Texto legal */}
        <p className="auth-foot">
          Al registrarte, aceptas nuestra{" "}
          <a className="auth-link" href="#">
            Política de Privacidad
          </a>{" "}
          y nuestros{" "}
          <a className="auth-link" href="#">
            Términos y Condiciones
          </a>.
        </p>

        {/* Enlace a login */}
        <p className="auth-foot">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="auth-link fw-semibold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}