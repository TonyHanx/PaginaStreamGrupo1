import React, { useState, useEffect } from "react";
import { obtenerMonedasUsuario, agregarMonedas } from "../../utils/monedas";
import BunnySVG from "../Icons/BunnySVG";
import "./ModalRecargaMonedas.css";

type CompraSeleccionada = {
  monedas: number;
  usd: number;
};

const TASA_CAMBIO = 95;

const METODOS = ["Tarjeta", "Yape", "Plin", "Paypal", "Crypto"];

const ModalRecargaMonedas: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [tabActiva, setTabActiva] = useState<"paquetes" | "personalizado">(
    "paquetes"
  );
  const [mostrarPasarela, setMostrarPasarela] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] =
    useState<CompraSeleccionada | null>(null);

  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string | null>(
    null
  );
  const [showMetodoModal, setShowMetodoModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<Record<string, any>>({});

  // Tarjeta data
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [pagoError, setPagoError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  // DESCARGAR COMPROBANTE TXT
  const descargarComprobante = (
    monedas: number,
    usd: number,
    saldoAnterior: number,
    metodo: string | null = null,
    extraInfo?: any
  ) => {
    const fecha = new Date().toLocaleString();
    const usuarioStr = sessionStorage.getItem("USUARIO");

    let username = "Invitado";
    try {
      const u = usuarioStr ? JSON.parse(usuarioStr) : null;
      username = u?.username || username;
    } catch {}

    const saldoNuevo = saldoAnterior + monedas;
    const transactionId = Date.now().toString();

    const contenido = `Comprobante de pago
Fecha: ${fecha}
Usuario: ${username}
Transacción ID: ${transactionId}
Monedas compradas: ${monedas}
Monto USD: $${usd.toFixed(2)}
Método de pago: ${metodo}
Detalle método: ${extraInfo ? JSON.stringify(extraInfo) : "N/A"}
Saldo anterior: ${saldoAnterior}
Saldo nuevo: ${saldoNuevo}

Gracias por su compra.`;

    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comprobante_${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const procesarCompra = (
    monedas: number,
    usd: number,
    metodo: string,
    extraData?: any
  ) => {
    const saldoAnterior = saldo;
    agregarMonedas(monedas);
    setSaldo((prev) => prev + monedas);

    window.dispatchEvent(new CustomEvent("monedas-actualizadas"));

    descargarComprobante(monedas, usd, saldoAnterior, metodo, extraData);

    setMostrarModal(false);
    setMostrarPasarela(false);
    setCompraSeleccionada(null);
  };

  const [montoUsd, setMontoUsd] = useState("");
  const [cantidadMonedasPers, setCantidadMonedasPers] = useState("");

  useEffect(() => {
    const actualizar = () => {
      const datos = obtenerMonedasUsuario();
      setSaldo(datos?.monedas ?? 0);
    };

    const abrir = () => {
      actualizar();
      setMostrarModal(true);
    };

    window.addEventListener("abrirTiendaMonedas", abrir);
    window.addEventListener("monedas-actualizadas", actualizar);

    return () => {
      window.removeEventListener("abrirTiendaMonedas", abrir);
      window.removeEventListener("monedas-actualizadas", actualizar);
    };
  }, []);

  const opciones = [
    { cantidad: 100, precioTexto: "1,09 US$", precioUsd: 1.09 },
    { cantidad: 250, precioTexto: "2,69 US$", precioUsd: 2.69 },
    { cantidad: 500, precioTexto: "5,29 US$", precioUsd: 5.29 },
    { cantidad: 1000, precioTexto: "10,55 US$", precioUsd: 10.55 },
    { cantidad: 2500, precioTexto: "26,35 US$", precioUsd: 26.35 },
    { cantidad: 5000, precioTexto: "52,69 US$", precioUsd: 52.69 },
    { cantidad: 10000, precioTexto: "105,29 US$", precioUsd: 105.29 },
  ];

  const abrirPasarela = (monedas: number, usd: number) => {
    setCompraSeleccionada({ monedas, usd });
    setMetodoSeleccionado("Tarjeta");
    setMostrarPasarela(true);
  };

  const validarTarjeta = () => {
    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvc) {
      setPagoError("Completa todos los datos de la tarjeta.");
      return false;
    }
    return true;
  };

  const abrirMetodoModal = (metodo: string) => {
    setMetodoSeleccionado(metodo);

    const datos = paymentInfo[metodo];

    if (metodo === "Tarjeta") {
      setCardHolder(datos?.cardHolder || "");
      setCardNumber(datos?.cardNumber || "");
      setCardExpiry(datos?.cardExpiry || "");
      setCardCvc(datos?.cardCvc || "");
    }

    setShowMetodoModal(true);
  };

  const guardarDatosMetodo = (metodo: string, data: any) => {
    setPaymentInfo((prev) => ({ ...prev, [metodo]: data }));
    setShowMetodoModal(false);
  };

  const handleConfirmarPago = () => {
    if (!compraSeleccionada || procesando || !metodoSeleccionado) return;

    if (metodoSeleccionado === "Tarjeta" && !validarTarjeta()) return;

    setProcesando(true);

    setTimeout(() => {
      procesarCompra(
        compraSeleccionada.monedas,
        compraSeleccionada.usd,
        metodoSeleccionado,
        paymentInfo[metodoSeleccionado] || {}
      );
      setProcesando(false);
    }, 1000);
  };

  if (!mostrarModal) return null;

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <div className="modal-recarga-overlay" onClick={() => setMostrarModal(false)}>
        <div className="modal-recarga-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-recarga-close" onClick={() => setMostrarModal(false)}>
            ×
          </button>

          <h2>Recargar MONEDAS</h2>

          <div className="modal-recarga-saldo-label">Tu saldo:</div>
          <div className="modal-recarga-saldo-row">
            <BunnySVG className="bunny-anim" />
            <span>{saldo}</span>
          </div>

          {/* TABS */}
          <div className="modal-recarga-tabs">
            <button
              className={`modal-recarga-tab ${tabActiva === "paquetes" ? "activo" : ""}`}
              onClick={() => setTabActiva("paquetes")}
            >
              Paquetes
            </button>
            <button
              className={`modal-recarga-tab ${tabActiva === "personalizado" ? "activo" : ""}`}
              onClick={() => setTabActiva("personalizado")}
            >
              Personalizado
            </button>
          </div>

          {tabActiva === "paquetes" && (
            <div className="modal-recarga-grid">
              {opciones.map((op) => (
                <div
                  key={op.cantidad}
                  className="modal-recarga-opcion"
                  onClick={() => abrirPasarela(op.cantidad, op.precioUsd)}
                >
                  <BunnySVG className="bunny-anim" />
                  <div>{op.cantidad} MONEDAS</div>
                  <div className="modal-recarga-precio">{op.precioTexto}</div>
                </div>
              ))}
            </div>
          )}

          {tabActiva === "personalizado" && (
            <div className="modal-recarga-personalizado">
              <div className="personalizado-bloque">
                <label>Ingresa USD</label>
                <input
                  type="number"
                  value={montoUsd}
                  onChange={(e) => setMontoUsd(e.target.value)}
                />
                <button onClick={() => abrirPasarela(parseFloat(montoUsd) * TASA_CAMBIO, parseFloat(montoUsd))}>
                  Comprar ${montoUsd || "0.00"}
                </button>
              </div>

              <div className="personalizado-separador">o</div>

              <div className="personalizado-bloque">
                <label>Monedas</label>
                <input
                  type="number"
                  value={cantidadMonedasPers}
                  onChange={(e) => setCantidadMonedasPers(e.target.value)}
                />
                <button
                  onClick={() =>
                    abrirPasarela(
                      parseInt(cantidadMonedasPers),
                      parseInt(cantidadMonedasPers) / TASA_CAMBIO
                    )
                  }
                >
                  Comprar {cantidadMonedasPers || 0}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PASARELA */}
      {mostrarPasarela && compraSeleccionada && (
        <div className="modal-pago-overlay" onClick={() => setMostrarPasarela(false)}>
          <div className="modal-pago-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-recarga-close" onClick={() => setMostrarPasarela(false)}>
              ×
            </button>

            <h2>Completar compra</h2>

            <div className="pago-resumen">
              <div>
                <div className="pago-resumen-titulo">
                  {compraSeleccionada.monedas} MONEDAS
                </div>
                <div className="pago-resumen-sub">Pago único</div>
              </div>
              <div className="pago-resumen-cantidad">x1</div>
            </div>

            <div className="pago-total">
              <div className="pago-total-monto">
                Total: <span>${compraSeleccionada.usd.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="pago-metodos-titulo">Método de pago</div>

            {/* LISTA COMPLETA DE MÉTODOS */}
            <div className="pago-metodos">
              {METODOS.map((m) => (
                <button
                  key={m}
                  className={`pago-metodo ${metodoSeleccionado === m ? "selected" : ""}`}
                  onClick={() => abrirMetodoModal(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* SUBMODAL TARJETA */}
            {showMetodoModal && metodoSeleccionado === "Tarjeta" && (
              <div className="modal-metodo-overlay" onClick={() => setShowMetodoModal(false)}>
                <div className="modal-metodo" onClick={(e) => e.stopPropagation()}>
                  <h3>Tarjeta</h3>

                  <input
                    placeholder="Titular"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                  <input
                    placeholder="Número de tarjeta"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(
                        e.target.value
                          .replace(/[^\d]/g, "")
                          .replace(/(.{4})/g, "$1 ")
                          .trim()
                      )
                    }
                  />
                  <input
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) =>
                      setCardExpiry(
                        e.target.value.replace(/[^\d/]/g, "").slice(0, 5)
                      )
                    }
                  />
                  <input
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) =>
                      setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />

                  {pagoError && <div className="modal-metodo-error">{pagoError}</div>}

                  <button
                    className="modal-metodo-btn guardar"
                    onClick={() =>
                      guardarDatosMetodo("Tarjeta", {
                        cardHolder,
                        cardNumber: cardNumber.replace(/\s/g, ""),
                        cardExpiry,
                        cardCvc,
                      })
                    }
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* SUBMODAL YAPE */}
            {showMetodoModal && metodoSeleccionado === "Yape" && (
              <div className="modal-metodo-overlay" onClick={() => setShowMetodoModal(false)}>
                <div className="modal-metodo" onClick={(e) => e.stopPropagation()}>
                  <h3>Yape</h3>

                  <input
                    placeholder="Número Yape"
                    value={paymentInfo["Yape"]?.numero || ""}
                    onChange={(e) =>
                      setPaymentInfo((prev) => ({
                        ...prev,
                        Yape: { numero: e.target.value },
                      }))
                    }
                  />

                  <button
                    className="modal-metodo-btn guardar"
                    onClick={() => guardarDatosMetodo("Yape", paymentInfo["Yape"])}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* SUBMODAL PLIN */}
            {showMetodoModal && metodoSeleccionado === "Plin" && (
              <div className="modal-metodo-overlay" onClick={() => setShowMetodoModal(false)}>
                <div className="modal-metodo" onClick={(e) => e.stopPropagation()}>
                  <h3>Plin</h3>

                  <input
                    placeholder="Número Plin"
                    value={paymentInfo["Plin"]?.numero || ""}
                    onChange={(e) =>
                      setPaymentInfo((prev) => ({
                        ...prev,
                        Plin: { numero: e.target.value },
                      }))
                    }
                  />

                  <button
                    className="modal-metodo-btn guardar"
                    onClick={() => guardarDatosMetodo("Plin", paymentInfo["Plin"])}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* SUBMODAL PAYPAL */}
            {showMetodoModal && metodoSeleccionado === "Paypal" && (
              <div className="modal-metodo-overlay" onClick={() => setShowMetodoModal(false)}>
                <div className="modal-metodo" onClick={(e) => e.stopPropagation()}>
                  <h3>Paypal</h3>

                  <input
                    placeholder="Correo Paypal"
                    value={paymentInfo["Paypal"]?.correo || ""}
                    onChange={(e) =>
                      setPaymentInfo((prev) => ({
                        ...prev,
                        Paypal: { correo: e.target.value },
                      }))
                    }
                  />

                  <button
                    className="modal-metodo-btn guardar"
                    onClick={() => guardarDatosMetodo("Paypal", paymentInfo["Paypal"])}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* SUBMODAL CRYPTO */}
            {showMetodoModal && metodoSeleccionado === "Crypto" && (
              <div className="modal-metodo-overlay" onClick={() => setShowMetodoModal(false)}>
                <div className="modal-metodo" onClick={(e) => e.stopPropagation()}>
                  <h3>Crypto (USDT/Binance Pay)</h3>

                  <input
                    placeholder="Wallet / Binance ID"
                    value={paymentInfo["Crypto"]?.wallet || ""}
                    onChange={(e) =>
                      setPaymentInfo((prev) => ({
                        ...prev,
                        Crypto: { wallet: e.target.value },
                      }))
                    }
                  />

                  <button
                    className="modal-metodo-btn guardar"
                    onClick={() => guardarDatosMetodo("Crypto", paymentInfo["Crypto"])}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            <button
              className="btn-confirmar"
              disabled={procesando}
              onClick={handleConfirmarPago}
            >
              {procesando ? "Procesando..." : "Pagar ahora"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalRecargaMonedas;
