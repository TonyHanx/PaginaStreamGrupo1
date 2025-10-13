// import { Link } from "react-router-dom";
import "../styles/auth.css";

import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";
import appleIcon from "../assets/icons/apple.svg";

export default function Register({ onShowLogin }: { onShowLogin?: () => void }) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: lógica de registro
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Registrarse</h1>

        <form onSubmit={onSubmit}>
          <label className="form-label">Nombre de usuario</label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-person" />
            </span>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="tuUsuario"
              required
            />
          </div>

          <label className="form-label">E-mail</label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-envelope" />
            </span>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <label className="form-label">Contraseña</label>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-lock" />
            </span>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="••••••••"
              required
            />
          </div>

          <label className="form-label">Confirmar contraseña</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-lock" />
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

        <div className="divider my-4">
          <span>O continúa con</span>
        </div>

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

        <p className="auth-foot">
          Al registrarte, aceptas nuestra{" "}
          <a className="auth-link" href="#">
            Política de Privacidad
          </a>{" "}
          y nuestros{" "}
          <a className="auth-link" href="#">
            Términos y Condiciones
          </a>
          .
        </p>

        <p className="auth-foot">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            className="auth-link fw-semibold"
            style={{background:'none',border:'none',color:'var(--primary)',cursor:'pointer',padding:0}}
            onClick={onShowLogin}
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}