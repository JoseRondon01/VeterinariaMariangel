const certifications = [
  { name: 'Fear Free', icon: '🐾', description: 'Atención sin estrés' },
  { name: 'AAHA', icon: '🏥', description: 'Acreditación hospitalaria' },
  { name: 'ISO 9001', icon: '✅', description: 'Calidad certificada' },
  { name: 'One Health', icon: '🌍', description: 'Salud integral' },
];

const metrics = [
  { value: '5,000+', label: 'Mascotas atendidas' },
  { value: '24/7', label: 'Urgencias activas' },
  { value: '4.9★', label: 'Rating de clientes' },
  { value: '12+', label: 'Años de experiencia' },
];

export default function TrustBand() {
  return (
    <section
      className="bg-white border-y border-slate-100"
      aria-labelledby="trust-title"
    >
      <div className="section py-12 md:py-16">
        <h2 id="trust-title" className="sr-only">
          Certificaciones y métricas de confianza
        </h2>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-medical-50 to-aqua-50"
            >
              <p className="text-3xl md:text-4xl font-extrabold text-medical-600">
                {m.value}
              </p>
              <p className="text-sm md:text-base text-slate-600 mt-1">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Certificaciones */}
        <div className="border-t border-slate-100 pt-10">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Certificaciones y asociaciones
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-medical-200 hover:bg-medical-50/50 transition-colors"
              >
                <span
                  className="text-3xl shrink-0"
                  role="img"
                  aria-hidden="true"
                >
                  {cert.icon}
                </span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{cert.name}</p>
                  <p className="text-xs text-slate-500">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}