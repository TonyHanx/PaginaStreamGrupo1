import { useModalContext } from "../context/ModalContext";
import "../Styles/auth.css";

import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";
import appleIcon from "../assets/icons/apple.svg";

import { useState } from "react";

export default function Register({ onShowLogin, onClose }: { onShowLogin?: () => void; onClose?: () => void }) {

  const { showTerminos, showPoliticas } = useModalContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!username || !email || !password) {
      setError("Completa todos los campos");
      return;
    }

    const userId = Date.now().toString();
    const userData = { username, email, password, puntos: 0, monedas: 500, userId };
    localStorage.setItem("USUARIO_REGISTRADO", JSON.stringify(userData));

    setSuccess(true);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">

        {/* Botón X */}
        <button className="close-btn" onClick={onClose} aria-label="Cerrar registro">
          <i className="bi bi-x-lg"></i>
        </button>

        <h1 className="auth-title">Registrarse</h1>

        <form onSubmit={onSubmit}>
          
          <label className="form-label">Nombre de usuario</label>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-person" /></span>
            <input
              type="text"
              className="form-control auth-input"
              placeholder="tuUsuario"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <label className="form-label">E-mail</label>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-envelope" /></span>
            <input
              type="email"
              className="form-control auth-input"
              placeholder="correo@ejemplo.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <label className="form-label">Contraseña</label>
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="bi bi-lock" /></span>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="••••••••"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <label className="form-label">Confirmar contraseña</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock" /></span>
            <input
              type="password"
              className="form-control auth-input"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">¡Registro exitoso! Ahora puedes iniciar sesión.</div>}

          <button type="submit" className="primary-btn mt-3">
            Registrarte
          </button>
        </form>

        <div className="divider my-4">
          <span>O continúa con</span>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-2">
          <button className="provider-btn" type="button">
            <img src={googleIcon} alt="Google" />
          </button>
          <button className="provider-btn" type="button">
            <img src={facebookIcon} alt="Facebook" />
          </button>
          <button className="provider-btn" type="button">
            <img src={appleIcon} alt="Apple" />
          </button>
        </div>

        <p className="auth-foot">
          Al registrarte, aceptas nuestra{" "}
          <button type="button" className="auth-link-button" onClick={showPoliticas}>
            Política de privacidad
          </button>{" "}
          y nuestros{" "}
          <button type="button" className="auth-link-button" onClick={showTerminos}>
            Términos y Condiciones
          </button>.
        </p>

        <p className="auth-foot">
          ¿Ya tienes una cuenta?{" "}
          <button type="button" className="auth-link-button" onClick={onShowLogin}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}
