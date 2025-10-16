import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/PoliticaPrivacidad.css";

export default function PoliticaPrivacidad() {
  return (
    <div className="privacy-wrapper text-light">
      <div className="container py-5">
        <div className="privacy-card mx-auto p-5 rounded-4 shadow-lg">
          <h1 className="text-center mb-4 fw-bold text-primary-glow">
            Política de Privacidad
          </h1>
          <p className="text-center text-secondary">
            Última actualización: Octubre 2025
          </p>

          <section className="mt-4">
            <h3 className="text-accent">1. Introducción</h3>
            <p>
              En <strong>Nexus Stream</strong> valoramos tu privacidad. Esta Política explica
              cómo recopilamos, usamos y protegemos tu información cuando utilizas nuestra
              plataforma de streaming.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">2. Información que recopilamos</h3>
            <p>
              Podemos recopilar la siguiente información:
            </p>
            <ul>
              <li>Datos de registro (nombre, correo electrónico, contraseña).</li>
              <li>Información técnica (dirección IP, tipo de dispositivo, navegador).</li>
              <li>Datos de uso (canales vistos, interacciones, mensajes en chat, etc.).</li>
            </ul>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">3. Cómo utilizamos tu información</h3>
            <p>
              Usamos tus datos para:
            </p>
            <ul>
              <li>Proporcionar y mejorar la experiencia de streaming.</li>
              <li>Personalizar el contenido y las recomendaciones.</li>
              <li>Garantizar la seguridad y prevenir actividades fraudulentas.</li>
              <li>Comunicarnos contigo sobre actualizaciones o cambios importantes.</li>
            </ul>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">4. Compartición de datos</h3>
            <p>
              No compartimos tu información personal con terceros, salvo cuando sea
              necesario para cumplir con la ley, proteger nuestros derechos o
              facilitar servicios esenciales (como autenticación o pagos).
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">5. Seguridad de la información</h3>
            <p>
              Implementamos medidas técnicas y organizativas para proteger tus datos contra
              accesos no autorizados, pérdidas o alteraciones.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">6. Tus derechos</h3>
            <p>
              Puedes acceder, actualizar o eliminar tu información personal contactándonos
              en cualquier momento. También puedes solicitar la eliminación de tu cuenta.
            </p>
          </section>

          <section className="mt-4">
            <h3 className="text-accent">7. Cambios en esta política</h3>
            <p>
              Podremos actualizar esta Política periódicamente. Te notificaremos cualquier
              cambio importante a través del sitio web o por correo electrónico.
            </p>
          </section>

          <section className="mt-4 mb-5">
            <h3 className="text-accent">8. Contacto</h3>
            <p>
              Si tienes preguntas sobre esta política o sobre cómo manejamos tus datos,
              escríbenos a: <strong>privacidad@nexusstream.com</strong>
            </p>
          </section>

          <div className="text-center">
            <a href="/register" className="btn btn-lg nexus-btn px-4">
              Volver al registro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


