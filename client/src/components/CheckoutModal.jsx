import { useState, useEffect } from 'react';
import { useStore } from './StoreContext.jsx';
import { useBusinessInfo } from './BusinessInfoContext.jsx';

const STEPS = ['Datos de Contacto', 'Método de Pago', 'Confirmar Pedido'];

const PAYMENT_METHODS = [
  { value: 'pago_movil', label: 'Pago Móvil', icon: '📱', description: 'Transferencia bancaria nacional (VES)' },
  { value: 'zelle', label: 'Zelle', icon: '💵', description: 'Transferencia en USD vía Zelle' },
  { value: 'cash_usd', label: 'Efectivo USD', icon: '💲', description: 'Pago contra entrega o retiro' },
  { value: 'cash_cop', label: 'Efectivo COP', icon: '💲', description: 'Pago contra entrega en pesos colombianos' },
];

export default function CheckoutModal({ open, onClose }) {
  const {
    cart,
    clearCart,
    cartTotalUsd,
    cartTotalConverted,
    convertPrice,
    formatPrice,
    selectedCurrency,
  } = useStore();
  const { getWhatsAppUrl, info: bizInfo } = useBusinessInfo();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proofDetails, setProofDetails] = useState({});

  // Payment config from DB
  const [paymentConfig, setPaymentConfig] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Load payment config when modal opens
  useEffect(() => {
    if (open) {
      setLoadingConfig(true);
      fetch('/api/payment-config')
        .then((r) => r.json())
        .then((data) => setPaymentConfig(Array.isArray(data) ? data : []))
        .catch(() => setPaymentConfig([]))
        .finally(() => setLoadingConfig(false));
    }
  }, [open]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep(0);
      setError('');
      setSuccess(false);
      setSubmitting(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setPaymentMethod('');
      setProofDetails({});
    }
  }, [open]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setError('Nombre y teléfono son obligatorios.');
        return;
      }
    }
    if (step === 1) {
      if (!paymentMethod) {
        setError('Selecciona un método de pago.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      const body = {
        customerName,
        customerPhone,
        customerAddress,
        selectedCurrency,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceUsd: item.priceUsd,
        })),
        proofDetails,
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear el pedido');
      }

      setSuccess(true);
      clearCart();

      // Redirigir a WhatsApp con resumen (usa el WhatsApp configurado en el admin)
      const phoneDigits = (bizInfo?.whatsappNumber || '541127258138').replace(/\D/g, '');
      const whatsappMsg = encodeURIComponent(
        `🐾 *Nuevo Pedido - Veterinaria Mariangel*\n\n` +
        `*Cliente:* ${customerName}\n*Teléfono:* ${customerPhone}\n*Dirección:* ${customerAddress || 'No especificada'}\n` +
        `*Método de pago:* ${PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label || paymentMethod}\n` +
        `*Total:* ${formatPrice(cartTotalConverted)}\n` +
        `*ID Orden:* ${data.orderId || ''}\n\n` +
        `_El pago está pendiente de verificación._`
      );

      // Abrir WhatsApp después de 2 segundos
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send/?phone=${phoneDigits}&text=${whatsappMsg}&type=phone_number&app_absent=0`, '_blank');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Obtener config del método seleccionado
  const selectedConfig = paymentConfig.find((c) => c.method === paymentMethod);

  if (!open) return null;

  // Pantalla de éxito
  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-slide-up">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">¡Pedido Registrado!</h2>
          <p className="text-slate-600 mb-4">
            Tu pedido ha sido registrado y está <strong>pendiente de verificación</strong>.
            El equipo de Veterinaria Mariangel revisará tu pago y te contactará pronto.
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Se abrirá WhatsApp para que puedas enviarnos tu comprobante directamente.
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>🛒</span> Finalizar Pedido
            </h2>
            <button
              onClick={handleClose}
              disabled={submitting}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((label, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    i < step
                      ? 'bg-green-500 text-white'
                      : i === step
                      ? 'bg-medical-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    i <= step ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Resumen del carrito */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-slate-700 text-sm mb-2">Resumen del Pedido</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {item.name} <span className="text-slate-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatPrice(item.priceUsd * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-extrabold text-medical-700 text-lg">
                  {formatPrice(selectedCurrency === 'USD' ? cartTotalUsd : cartTotalConverted)}
                </span>
              </div>
            </div>
          </div>

          {/* ===== STEP 0: Datos de contacto ===== */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: María Pérez"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej: +584141234567"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ej: Calle Principal, Edif. X, Apto 3"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* ===== STEP 1: Método de pago ===== */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 mb-2">
                Selecciona cómo deseas pagar. Los pagos digitales serán verificados por nuestro equipo.
              </p>
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.value}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === pm.value
                      ? 'border-medical-500 bg-medical-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-0.5 accent-medical-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-xl">{pm.icon}</span> {pm.label}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{pm.description}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* ===== STEP 2: Confirmar pedido ===== */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Datos de contacto */}
              <div className="p-3 bg-slate-50 rounded-xl text-sm">
                <p className="text-slate-500"><strong>Nombre:</strong> {customerName}</p>
                <p className="text-slate-500"><strong>Teléfono:</strong> {customerPhone}</p>
                {customerAddress && <p className="text-slate-500"><strong>Dirección:</strong> {customerAddress}</p>}
                <p className="text-slate-500"><strong>Método de pago:</strong> {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}</p>
              </div>

              {/* Datos bancarios según método seleccionado */}
              {selectedConfig && (
                <div className="p-4 bg-aqua-50 border border-aqua-200 rounded-xl">
                  <h4 className="font-bold text-aqua-800 text-sm mb-2">
                    Datos para el pago — {selectedConfig.label}
                  </h4>
                  {selectedConfig.bankName && (
                    <p className="text-sm text-aqua-700"><strong>Banco:</strong> {selectedConfig.bankName}</p>
                  )}
                  {selectedConfig.accountHolder && (
                    <p className="text-sm text-aqua-700"><strong>Titular:</strong> {selectedConfig.accountHolder}</p>
                  )}
                  {selectedConfig.accountNumber && (
                    <p className="text-sm text-aqua-700"><strong>Cuenta:</strong> {selectedConfig.accountNumber}</p>
                  )}
                  {selectedConfig.phone && (
                    <p className="text-sm text-aqua-700"><strong>Teléfono:</strong> {selectedConfig.phone}</p>
                  )}
                  {selectedConfig.instructions && (
                    <p className="text-sm text-aqua-700 mt-2 italic">{selectedConfig.instructions}</p>
                  )}
                  <div className="mt-3 p-2 bg-white rounded-lg text-center">
                    <span className="text-xs text-aqua-600">Monto a transferir:</span>
                    <p className="text-xl font-extrabold text-aqua-800">
                      {formatPrice(selectedCurrency === 'USD' ? cartTotalUsd : cartTotalConverted)}
                    </p>
                  </div>
                </div>
              )}

              {/* Campos de comprobante para pagos digitales */}
              {(paymentMethod === 'pago_movil' || paymentMethod === 'zelle') && (
                <div className="space-y-3 mt-4">
                  <h4 className="font-bold text-slate-700 text-sm">Datos del Comprobante</h4>

                  {paymentMethod === 'pago_movil' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Banco de Origen
                        </label>
                        <input
                          type="text"
                          value={proofDetails.bankOrigin || ''}
                          onChange={(e) => setProofDetails((p) => ({ ...p, bankOrigin: e.target.value }))}
                          placeholder="Ej: Banesco, Mercantil..."
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Fecha de la Transferencia
                        </label>
                        <input
                          type="date"
                          value={proofDetails.transferDate || ''}
                          onChange={(e) => setProofDetails((p) => ({ ...p, transferDate: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Últimos 4 dígitos de la Referencia
                        </label>
                        <input
                          type="text"
                          value={proofDetails.referenceDigits || ''}
                          onChange={(e) => setProofDetails((p) => ({ ...p, referenceDigits: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          maxLength={4}
                          placeholder="Ej: 1234"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                        />
                      </div>
                    </>
                  )}

                  {paymentMethod === 'zelle' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          value={proofDetails.accountHolder || ''}
                          onChange={(e) => setProofDetails((p) => ({ ...p, accountHolder: e.target.value }))}
                          placeholder="Nombre de quien envía el Zelle"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Número de Confirmación / Referencia Zelle
                        </label>
                        <input
                          type="text"
                          value={proofDetails.confirmationNumber || ''}
                          onChange={(e) => setProofDetails((p) => ({ ...p, confirmationNumber: e.target.value }))}
                          placeholder="Ej: ZELLE-ABC123"
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Para efectivo, solo confirmación */}
              {(paymentMethod === 'cash_usd' || paymentMethod === 'cash_cop') && (
                <div className="p-3 bg-emergency-50 border border-emergency-200 rounded-xl">
                  <p className="text-sm text-emergency-700">
                    ⚠️ El pago se realizará <strong>contra entrega o retiro en tienda</strong>.
                    Un miembro de nuestro equipo te contactará para coordinar la entrega.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 rounded-b-2xl flex gap-3">
          {step > 0 && !success && (
            <button
              onClick={handleBack}
              disabled={submitting}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              ← Atrás
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition"
            >
              Continuar →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || cart.length === 0}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                '✓ Confirmar Pedido'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}