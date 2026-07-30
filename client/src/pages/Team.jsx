import { useEffect, useState } from 'react';
import { useBooking } from '../components/BookingContext.jsx';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useBooking();

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        setTeam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div id="main-content">
      {/* Header de la página */}
      <section className="bg-gradient-to-br from-medical-50 to-aqua-50 py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="chip bg-medical-100 text-medical-700 mb-4">
            Nuestro Equipo
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Conoce a quienes cuidan a tu mascota
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Un equipo multidisciplinario de veterinarios certificados, unidos por
            la pasión por el bienestar animal y la medicina de excelencia.
          </p>
        </div>
      </section>

      {/* Grid de perfiles */}
      <section className="section" aria-labelledby="team-list-title">
        <h2 id="team-list-title" className="sr-only">
          Lista de veterinarios
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex gap-5">
                  <div className="w-32 h-32 bg-slate-200 rounded-2xl shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded w-2/3 mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member) => (
              <article
                key={member.id}
                className="card-hover p-6 md:p-8 animate-slide-up"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Imagen */}
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <img
                      src={member.image}
                      alt={`Foto de ${member.name}`}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-medical-100"
                      loading="lazy"
                      width="128"
                      height="128"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-slate-900">
                      {member.name}
                    </h3>
                    <p className="text-medical-600 font-medium text-sm mt-1">
                      {member.role}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {member.experience} de experiencia
                    </p>

                    <p className="text-sm text-slate-600 mt-3">{member.bio}</p>

                    {/* Especialidad */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Especialidad
                      </p>
                      <p className="text-sm text-slate-700">
                        {member.specialty}
                      </p>
                    </div>

                    {/* Certificaciones */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Certificaciones
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {member.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="chip bg-aqua-50 text-aqua-700 text-xs"
                          >
                            ✓ {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-5 pt-5 border-t border-slate-100 text-center sm:text-left">
                  <button
                    onClick={openBooking}
                    className="text-medical-600 font-semibold text-sm hover:text-medical-700 inline-flex items-center gap-1"
                    aria-label={`Agendar cita con ${member.name}`}
                  >
                    Agendar cita con {member.name.split(' ').slice(0, 2).join(' ')}
                    <svg
                      className="w-4 h-4"
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
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}