import { useEffect, useState } from 'react';
import { useBooking } from './BookingContext.jsx';

const iconMap = {
  stethoscope: (
    <path d="M19 8h-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2H9a2 2 0 00-2 2v8a2 2 0 002 2h2v2a2 2 0 002 2h2a2 2 0 002-2v-2h2a2 2 0 002-2v-8a2 2 0 00-2-2zm-6-2h2v2h-2V6zm2 12h-2v-2h2v2zm4-2h-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2H9v-8h10v8z" />
  ),
  scalpel: (
    <path d="M21 3L8.5 15.5l-4 4L3 18l4-4L19 5l2-2zm-9.5 9.5L5 19l-1 1 1.5-1.5L12 12l-.5.5z" />
  ),
  scissors: (
    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" />
  ),
  flask: (
    <path d="M15 7.5V2H9v5.5l-4.5 9C3.5 18.5 4.5 20 6 20h12c1.5 0 2.5-1.5 1.5-3.5L15 7.5zM11 4h2v4h-2V4zm-2.5 9l2-4v1h3v-1l2 4h-7z" />
  ),
  paw: (
    <path d="M11 4c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-4 4c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm8 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm4 4c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-8 4c-2 0-4 1.8-4 4 0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2 0-2.2-2-4-4-4z" />
  ),
  alert: (
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  ),
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useBooking();

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section
      id="servicios"
      className="bg-slate-50"
      aria-labelledby="services-title"
    >
      <div className="section">
        <div className="text-center mb-12">
          <span className="chip bg-aqua-100 text-aqua-700 mb-4">
            Nuestros servicios
          </span>
          <h2 id="services-title" className="section-title">
            Atención integral para cada necesidad
          </h2>
          <p className="section-subtitle">
            Desde una consulta de rutina hasta una cirugía compleja, cubrimos
            todas las etapas de la vida de tu mascota con excelencia médica.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="card p-6 animate-pulse"
                aria-hidden="true"
              >
                <div className="w-14 h-14 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <article
                key={service.id}
                className="card-hover p-6 group"
                aria-labelledby={`service-${service.id}-title`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-100 to-aqua-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 text-medical-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {iconMap[service.icon]}
                  </svg>
                </div>

                <h3
                  id={`service-${service.id}-title`}
                  className="text-xl font-bold text-slate-900 mb-2"
                >
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-4">{service.description}</p>

                <ul className="space-y-2 mb-5">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <svg
                        className="w-4 h-4 text-aqua-600 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={openBooking}
                  className="text-medical-600 font-semibold text-sm hover:text-medical-700 inline-flex items-center gap-1 group/btn"
                  aria-label={`Reservar cita para ${service.title}`}
                >
                  Reservar cita
                  <svg
                    className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}