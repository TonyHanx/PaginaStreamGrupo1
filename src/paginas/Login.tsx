import { useState } from "react";
// import { Link } from "react-router-dom";
import "../styles/auth.css";

import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";
import appleIcon from "../assets/icons/apple.svg";

export default function Login({ onShowRegister }: { onShowRegister?: () => void }) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="auth-wrap">
			<div className="auth-card">
				<h1 className="auth-title">Iniciar sesión</h1>

				<form>
					<label className="form-label">Correo electrónico o nombre de usuario</label>
					<div className="input-group mb-3">
						<span className="input-group-text">
							<i className="bi bi-person" />
						</span>
						<input
							type="text"
							className="form-control auth-input"
							placeholder="usuario@correo.com"
							required
						/>
					</div>

					<label className="form-label">Contraseña</label>
					<div className="input-group">
						<span className="input-group-text">
							<i className="bi bi-lock" />
						</span>
						<input
							type={showPassword ? "text" : "password"}
							className="form-control auth-input"
							placeholder="••••••••"
							required
						/>
						<button
							type="button"
							className="input-group-text bg-transparent border-0"
							onClick={() => setShowPassword((v) => !v)}
							aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
							title={showPassword ? "Ocultar" : "Mostrar"}
						>
							<i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
						</button>
					</div>

					<div className="text-end mt-1">
						<a href="#" className="auth-link">¿Olvidaste tu contraseña?</a>
					</div>

					<button type="submit" className="primary-btn mt-3">
						Iniciar sesión
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
					   ¿No tienes una cuenta?{" "}
					   <button
						   type="button"
						   className="auth-link fw-semibold"
						   style={{background:'none',border:'none',color:'var(--primary)',cursor:'pointer',padding:0}}
						   onClick={onShowRegister}
					   >
						   Registrarse
					   </button>
				   </p>
			</div>
		</div>
	);
}
// ...existing code from Login.tsx...