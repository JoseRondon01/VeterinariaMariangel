import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TeamPreview() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        setTeam(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white" aria-labelledby="team-preview-title">
      <div className="section">
        <div className="text-center mb-12">
          <span className="chip bg-medical-100 text-medical-700 mb-4">
            Equipo médico
          </span>
          <h2 id="team-preview-title" className="section-title">
            Profesionales que cuidan con pasión
          </h2>
          <p className="section-subtitle">
            Veterinarios certificados con años de experiencia y vocación de
            servicio.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 text-center animate-pulse">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <article
                key={member.id}
                className="card-hover p-6 text-center group"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={`Foto de ${member.name}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-medical-100 group-hover:border-medical-300 transition-colors"
                    loading="lazy"
                    width="96"
                    height="96"
                  />
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm text-medical-600 font-medium mt-1">
                  {member.role}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {member.experience} de experiencia
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/equipo" className="btn-secondary">
            Conoce a todo el equipo
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
          </Link>
        </div>
      </div>
    </section>
  );
}