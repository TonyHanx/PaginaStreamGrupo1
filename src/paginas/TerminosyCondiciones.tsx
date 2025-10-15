import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/TerminosYCondiciones.css";

export default function TerminosYCondiciones() {
  return (
    <div className="terms-wrapper text-light">
      <div className="container py-5">
        <div className="terms-card mx-auto p-5 rounded-4 shadow-lg">
          <h1 className="text-center mb-4 fw-bold text-primary-glow">
            Términos y Condiciones
          </h1>
          <p className="text-center text-secondary">
            Última actualización: Octubre 2025
          </p>

          <section className="mt-4">
            <h3 className="text-accent">1. Aceptación de los términos</h3>
            <p>
              Al acceder y utilizar <strong>Nexus Stream</strong>, aceptas cumplir con estos
              términos y condiciones, así como con todas las leyes y regulaciones
              aplicables. Si no estás de acuerdo, te pedimos no utilizar la plataforma.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">2. Uso del sitio</h3>
            <p>
              Los contenidos de este sitio están destinados exclusivamente a fines de
              entretenimiento y streaming. Está prohibido el uso de la plataforma para
              actividades ilegales, ofensivas o que infrinjan los derechos de terceros.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">3. Propiedad intelectual</h3>
            <p>
              Todos los derechos de autor, logotipos, gráficos, interfaces y materiales
              audiovisuales pertenecen a <strong>Nexus Stream</strong> o a sus respectivos
              propietarios. No está permitido su uso sin autorización previa.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">4. Privacidad</h3>
            <p>
              Nos comprometemos a proteger la privacidad de los usuarios. Los datos
              personales serán tratados de acuerdo con nuestra{" "}
              <a href="#" className="text-link">Política de Privacidad</a>.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">5. Modificaciones</h3>
            <p>
              Nexus Stream puede actualizar estos términos en cualquier momento. Los
              cambios serán efectivos desde su publicación en esta página.
            </p>
          </section>

          <section className="mt-4 mb-5">
            <h3 className="text-accent">6. Contacto</h3>
            <p>
              Si tienes preguntas o comentarios sobre estos términos, contáctanos en:
              <br />
              <strong>soporte@nexusstream.com</strong>
            </p>
          </section>

          <div className="text-center">
            <a
              href="/register"
              className="btn btn-lg nexus-btn px-4"
            >
              Volver al registro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}