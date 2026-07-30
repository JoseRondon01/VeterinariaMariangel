import { useBooking } from './BookingContext.jsx';

const EMERGENCY_TEL = 'tel:+582125550199';

export default function HeroSection() {
  const { openBooking } = useBooking();

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-medical-50 via-white to-aqua-50"
      aria-labelledby="hero-title"
    >
      {/* Formas decorativas de fondo */}
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-aqua-200/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-medical-200/30 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"
        aria-hidden="true"
      />

      <div className="relative section pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna de texto */}
          <div className="text-center lg:text-left animate-slide-up">
            {/* Badge superior */}
            <span className="chip bg-emergency-100 text-emergency-700 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emergency-500"></span>
              </span>
              Urgencias disponibles 24/7
            </span>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-5"
            >
              Cuidamos a tu mascota{' '}
              <span className="text-medical-600">como parte de la familia</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Clínica veterinaria con equipo médico certificado, tecnología de
              punta y trato humano. Agenda tu cita online en solo 3 pasos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={openBooking}
                className="btn-primary text-lg px-8 py-4"
                aria-label="Agendar cita online ahora"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Agendar Cita
              </button>

              <a
                href={EMERGENCY_TEL}
                className="btn-emergency text-lg px-8 py-4"
                aria-label="Emergencia veterinaria 24 horas - Llamar ahora"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                Emergencia 24/7
              </a>
            </div>

            {/* Mini métricas de confianza */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-medical-600">5,000+</span>
                <span className="text-sm text-slate-600">mascotas atendidas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-aqua-600">4.9★</span>
                <span className="text-sm text-slate-600">487 reseñas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-medical-600">12+</span>
                <span className="text-sm text-slate-600">años de experiencia</span>
              </div>
            </div>
          </div>

          {/* Columna de imagen */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-square">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=800&fit=crop"
                alt="Veterinaria atendiendo con cariño a un perro en consulta"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                width="800"
                height="800"
              />
            </div>

            {/* Card flotante - Certificación */}
            <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-aqua-100 flex items-center justify-center text-2xl shrink-0">
                🏆
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Fear Free Certified</p>
                <p className="text-xs text-slate-500">Atención sin estrés</p>
              </div>
            </div>

            {/* Card flotante - Disponibilidad */}
            <div className="absolute -top-4 -right-3 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Abierto ahora</p>
                <p className="text-xs text-slate-500">Guardia 24/7 activa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}