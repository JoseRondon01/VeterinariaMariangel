import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-rotación del carrusel
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

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

        {/* Carrusel */}
        <div className="max-w-3xl mx-auto">
          <div
            className="card p-8 md:p-10 text-center animate-fade-in"
            key={current.id}
          >
            <StarRating rating={current.rating} />

            <blockquote className="mt-5 text-lg md:text-xl text-slate-700 italic leading-relaxed">
              "{current.text}"
            </blockquote>

            <div className="mt-6 flex items-center justify-center gap-4">
              <img
                src={current.avatar}
                alt={`Foto de ${current.name}`}
                className="w-14 h-14 rounded-full object-cover border-2 border-medical-200"
                loading="lazy"
                width="56"
                height="56"
              />
              <div className="text-left">
                <p className="font-bold text-slate-900">{current.name}</p>
                <p className="text-sm text-slate-500">{current.pet}</p>
              </div>
            </div>
          </div>

          {/* Controles del carrusel */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === active
                    ? 'w-8 bg-medical-600'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ver testimonio ${i + 1} de ${testimonials.length}`}
                aria-current={i === active}
              />
            ))}
          </div>

          {/* Botones prev/next */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() =>
                setActive((prev) =>
                  prev === 0 ? testimonials.length - 1 : prev - 1
                )
              }
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md transition-all"
              aria-label="Testimonio anterior"
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
            </button>
            <button
              onClick={() =>
                setActive((prev) => (prev + 1) % testimonials.length)
              }
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:shadow-md transition-all"
              aria-label="Testimonio siguiente"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}