import { useEffect, useState } from 'react';
import { useBooking } from './BookingContext.jsx';

const steps = [
  { num: 1, label: 'Especie' },
  { num: 2, label: 'Motivo' },
  { num: 3, label: 'Fecha y datos' },
];

export default function BookingModal() {
  const { isOpen, closeBooking } = useBooking();

  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  // Datos del formulario
  const [form, setForm] = useState({
    speciesId: '',
    reason: '',
    date: '',
    time: '',
    petName: '',
    ownerName: '',
    phone: '',
    notes: '',
  });

  // Carga inicial de datos cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      fetch('/api/booking/species').then((r) => r.json()),
      fetch('/api/booking/reasons').then((r) => r.json()),
      fetch('/api/booking/slots').then((r) => r.json()),
    ])
      .then(([sp, rs, sl]) => {
        setSpecies(sp);
        setReasons(rs);
        setSlots(sl);
        setLoading(false);
      })
      .catch(() => {
        setError('Error cargando datos. Intenta de nuevo.');
        setLoading(false);
      });
  }, [isOpen]);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setSuccess(null);
        setError('');
        setForm({
          speciesId: '',
          reason: '',
          date: '',
          time: '',
          petName: '',
          ownerName: '',
          phone: '',
          notes: '',
        });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) closeBooking();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeBooking, submitting]);

  if (!isOpen) return null;

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const canNext = () => {
    if (step === 1) return form.speciesId !== '';
    if (step === 2) return form.reason !== '';
    return false;
  };

  const next = () => {
    if (canNext()) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prev = () => {
    setStep((s) => Math.max(s - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.time || !form.petName || !form.ownerName || !form.phone) {
      setError('Completa todos los campos obligatorios (*)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al registrar la cita');

      setSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSpecies = species.find((s) => s.id === form.speciesId);
  const selectedSlot = slots.find((s) => s.date === form.date);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !submitting && closeBooking()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 id="booking-title" className="text-xl font-bold text-slate-900">
              Agendar Cita
            </h2>
            {!success && (
              <p className="text-sm text-slate-500">
                Reserva en 3 simples pasos
              </p>
            )}
          </div>
          <button
            onClick={() => !submitting && closeBooking()}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar ventana de reserva"
            disabled={submitting}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Pantalla de éxito */}
          {success ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                ¡Cita registrada!
              </h3>
              <p className="text-slate-600 mb-6">{success.message}</p>

              <div className="bg-medical-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mascota:</span>
                  <span className="font-semibold text-slate-900">
                    {success.appointment.petName} ({selectedSpecies?.label})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Motivo:</span>
                  <span className="font-semibold text-slate-900">
                    {success.appointment.reason}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-semibold text-slate-900">
                    {success.appointment.date} · {success.appointment.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estado:</span>
                  <span className="font-semibold text-amber-600 capitalize">
                    {success.appointment.status}
                  </span>
                </div>
              </div>

              <button onClick={closeBooking} className="btn-primary w-full">
                Listo
              </button>
            </div>
          ) : loading ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 border-4 border-medical-200 border-t-medical-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Cargando disponibilidad...</p>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <nav aria-label="Progreso de reserva" className="mb-8">
                <ol className="flex items-center">
                  {steps.map((s, i) => (
                    <li
                      key={s.num}
                      className={`flex items-center ${
                        i < steps.length - 1 ? 'flex-1' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            step > s.num
                              ? 'bg-green-500 text-white'
                              : step === s.num
                              ? 'bg-medical-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                          aria-current={step === s.num ? 'step' : undefined}
                          aria-label={`Paso ${s.num}: ${s.label}`}
                        >
                          {step > s.num ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            s.num
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            step >= s.num ? 'text-medical-700' : 'text-slate-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 -mt-5 transition-colors ${
                            step > s.num ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>

              {/* Paso 1: Especie */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    ¿Qué especie es tu mascota?
                  </h3>
                  <p className="text-sm text-slate-500 mb-5">
                    Selecciona el tipo de animal para asignarte el especialista
                    adecuado.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {species.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => updateForm('speciesId', sp.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          form.speciesId === sp.id
                            ? 'border-medical-600 bg-medical-50 scale-105'
                            : 'border-slate-200 hover:border-medical-300'
                        }`}
                        aria-pressed={form.speciesId === sp.id}
                        aria-label={`Seleccionar especie ${sp.label}`}
                      >
                        <span
                          className="text-3xl block mb-1"
                          role="img"
                          aria-hidden="true"
                        >
                          {sp.icon}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {sp.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Paso 2: Motivo */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    ¿Cuál es el motivo de la visita?
                  </h3>
                  <p className="text-sm text-slate-500 mb-5">
                    Elige la razón principal de la consulta.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {reasons.map((r) => (
                      <button
                        key={r}
                        onClick={() => updateForm('reason', r)}
                        className={`p-4 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                          form.reason === r
                            ? 'border-medical-600 bg-medical-50 scale-105'
                            : 'border-slate-200 hover:border-medical-300 text-slate-700'
                        }`}
                        aria-pressed={form.reason === r}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Paso 3: Fecha, hora y datos */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="animate-fade-in space-y-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Elige fecha y completa los datos
                  </h3>

                  {/* Selector de fecha */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Fecha disponible
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                      {slots.map((slot) => (
                        <button
                          key={slot.date}
                          type="button"
                          onClick={() => {
                            updateForm('date', slot.date);
                            updateForm('time', '');
                          }}
                          className={`shrink-0 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all capitalize ${
                            form.date === slot.date
                              ? 'border-medical-600 bg-medical-50 text-medical-700'
                              : 'border-slate-200 text-slate-600 hover:border-medical-300'
                          }`}
                          aria-pressed={form.date === slot.date}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selector de hora */}
                  {form.date && selectedSlot && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Hora disponible
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedSlot.hours.map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => updateForm('time', h)}
                            className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              form.time === h
                                ? 'border-medical-600 bg-medical-600 text-white'
                                : 'border-slate-200 text-slate-600 hover:border-medical-300'
                            }`}
                            aria-pressed={form.time === h}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Datos del dueño y mascota */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="petName"
                          className="block text-sm font-semibold text-slate-700 mb-1"
                        >
                          Nombre mascota *
                        </label>
                        <input
                          id="petName"
                          type="text"
                          value={form.petName}
                          onChange={(e) => updateForm('petName', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-medical-500 outline-none transition-colors"
                          placeholder="Ej: Max"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ownerName"
                          className="block text-sm font-semibold text-slate-700 mb-1"
                        >
                          Tu nombre *
                        </label>
                        <input
                          id="ownerName"
                          type="text"
                          value={form.ownerName}
                          onChange={(e) => updateForm('ownerName', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-medical-500 outline-none transition-colors"
                          placeholder="Ej: Juan Pérez"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-slate-700 mb-1"
                      >
                        Teléfono *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-medical-500 outline-none transition-colors"
                        placeholder="Ej: +58 412 555 0199"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-semibold text-slate-700 mb-1"
                      >
                        Notas (opcional)
                      </label>
                      <textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => updateForm('notes', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-medical-500 outline-none transition-colors resize-none"
                        placeholder="Síntomas, observaciones, etc."
                      />
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
                    >
                      {error}
                    </div>
                  )}
                </form>
              )}

              {/* Navegación entre pasos */}
              {!success && !loading && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                  {step > 1 && (
                    <button
                      onClick={prev}
                      className="btn-secondary flex-1"
                      disabled={submitting}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Atrás
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      onClick={next}
                      disabled={!canNext()}
                      className="btn-primary flex-1"
                    >
                      Continuar
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-primary flex-1"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Confirmar Cita
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}