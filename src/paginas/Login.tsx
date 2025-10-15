import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/auth.css";
import googleIcon from "../assets/icons/google.svg";
import facebookIcon from "../assets/icons/facebook.svg";
import appleIcon from "../assets/icons/apple.svg";

export default function Login({ onShowRegister, onLoginSuccess }: { onShowRegister?: () => void; onLoginSuccess?: () => void }) {
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Validar contra usuario registrado en localStorage
		const userDataStr = localStorage.getItem("USUARIO_REGISTRADO");
		if (userDataStr) {
			const userData = JSON.parse(userDataStr);
			if (
				(username === userData.username || username === userData.email) &&
				password === userData.password
			) {
				setError("");
				sessionStorage.setItem("USUARIO", JSON.stringify({ 
					username: userData.username, 
					puntos: userData.puntos || 0,
					monedas: userData.monedas || 1000 // Monedas iniciales para demo
				}));
				
				// Si hay callback de éxito (modo modal), ejecutarlo en lugar de navegar
				if (onLoginSuccess) {
					onLoginSuccess();
				} else {
					navigate("/usuario");
				}
				return;
			}
		}
		// Validación simple: usuario "grupo1" y contraseña "123"
		if (username === "grupo1" && password === "123") {
			setError("");
			sessionStorage.setItem("USUARIO", JSON.stringify({ 
				username, 
				puntos: 0,
				monedas: 1000 // Monedas iniciales para demo
			}));
			
			// Si hay callback de éxito (modo modal), ejecutarlo en lugar de navegar
			if (onLoginSuccess) {
				onLoginSuccess();
			} else {
				navigate("/usuario");
			}
		} else {
			setError("Ingreso incorrecto");
		}
	};

	return (
		<div className="auth-wrap">
			<div className="auth-card">
				<h1 className="auth-title">Iniciar sesión</h1>

				<form onSubmit={handleSubmit}>
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
							value={username}
							onChange={e => setUsername(e.target.value)}
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
							value={password}
							onChange={e => setPassword(e.target.value)}
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

					{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

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