import { useEffect, useState, useRef } from 'react';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`Calificación ${rating} de 5 estrellas`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  const [formName, setFormName] = useState('');
  const [formPet, setFormPet] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState('');

  const modalRef = useRef(null);

  const fetchTestimonials = () => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTestimonials(); }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleSubmit = async () => {
    if (!formName.trim() || !formText.trim()) {
      setFormMsg('❌ Nombre y experiencia son obligatorios');
      setTimeout(() => setFormMsg(''), 3000);
      return;
    }
    setSubmitting(true); setFormMsg('');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim(), pet: formPet.trim(), rating: formRating, text: formText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormMsg('✅ ¡Gracias por tu reseña!');
      setFormName(''); setFormPet(''); setFormRating(5); setFormText('');
      setTimeout(() => { setShowForm(false); setFormMsg(''); fetchTestimonials(); }, 1500);
    } catch (err) {
      setFormMsg('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white" aria-labelledby="testimonials-title">
        <div className="section">
          <div className="text-center mb-12">
            <h2 id="testimonials-title" className="section-title">
              Lo que dicen nuestras familias
            </h2>
          </div>
          <div className="max-w-2xl mx-auto card p-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const current = testimonials[active];

  return (
    <>
      <section
        className="bg-gradient-to-br from-medical-50 to-aqua-50"
        aria-labelledby="testimonials-title"
      >
        <div className="section">
          <div className="text-center mb-12">
            <span className="chip bg-amber-100 text-amber-700 mb-4">
              ⭐ Testimonios reales
            </span>
            <h2 id="testimonials-title" className="section-title">
              Lo que dicen nuestras familias
            </h2>
            <p className="section-subtitle">
              La confianza de cientos de dueños respalda nuestro trabajo diario.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="card p-8 md:p-10 text-center animate-fade-in" key={current.id}>
              <StarRating rating={current.rating} />
              <blockquote className="mt-5 text-lg md:text-xl text-slate-700 italic leading-relaxed">
                &ldquo;{current.text}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-4">
                <img
                  src={current.avatar}
                  alt={`Foto de ${current.name}`}
                  className="w-14 h-14 rounded-full object-cover border-2 border-medical-200"
                  loading="lazy"
                  width="56"
                  height="56"
                  onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e8f0" width="100" height="100"/><text x="50" y="60" text-anchor="middle" font-size="40">👤</text></svg>'; }}
                />
                <div className="text-left">
                  <p className="font-bold text-slate-900">{current.name}</p>
                  <p className="text-sm text-slate-500">{current.pet}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActive(i)}
                  className={`h-2.5 rounded-full transition-all ${i === active ? 'w-8 bg-medical-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Ver testimonio ${i + 1} de ${testimonials.length}`}
                  aria-current={i === active}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setActive((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md transition-all"
                aria-label="Testimonio anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActive((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md transition-all"
                aria-label="Testimonio siguiente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Botón Dejar Reseña */}
          <div className="text-center mt-10">
            <button onClick={() => setShowForm(true)} className="btn-secondary">
              ✏️ Dejar una reseña
            </button>
          </div>
        </div>
      </section>

      {/* Modal: Dejar Reseña */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          ref={modalRef}
          onClick={(e) => { if (e.target === modalRef.current) setShowForm(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">✏️ Dejar una Reseña</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">
                &times;
              </button>
            </div>

            {formMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${formMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {formMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tu nombre *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                  placeholder="Ej: María González" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tu mascota</label>
                <input type="text" value={formPet} onChange={(e) => setFormPet(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                  placeholder="Ej: Luna · Golden 3 años" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Calificación</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormRating(star)}
                      className="text-2xl transition-transform hover:scale-110"
                      aria-label={`${star} estrella${star > 1 ? 's' : ''}`}>
                      {star <= formRating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tu experiencia *</label>
                <textarea value={formText} onChange={(e) => setFormText(e.target.value)} rows="4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
                  placeholder="Cuéntanos tu experiencia con Veterinaria Mariangel..." />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 px-5 py-2.5 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50">
                {submitting ? 'Enviando...' : 'Enviar Reseña'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}