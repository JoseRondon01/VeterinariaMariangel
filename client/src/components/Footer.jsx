import { Link } from 'react-router-dom';
import { useBooking } from './BookingContext.jsx';
import { useBusinessInfo } from './BusinessInfoContext.jsx';

export default function Footer() {
  const { openBooking } = useBooking();
  const {
    getPhoneDisplay,
    getScheduleArray,
    getSocialLinks,
    getWhatsAppUrl,
    info,
  } = useBusinessInfo();

  const phoneDisplay = getPhoneDisplay();
  const phoneDigits = phoneDisplay.replace(/\D/g, '');
  const emergencyTel = `tel:+${phoneDigits}`;
  const schedule = getScheduleArray();
  const socialLinks = getSocialLinks().filter((s) => s.href);
  const email = info.email || 'contacto@veterinariamariangel.com';
  const address = info.address || 'Av. Rotaria, San Cristóbal, Táchira';
  const mapUrl =
    info.mapEmbedUrl ||
    'https://www.openstreetmap.org/export/embed.html?bbox=-72.2320%2C7.7610%2C-72.2180%2C7.7710&layer=mapnik&marker=7.7660%2C-72.2250';

  return (
    <footer className="bg-slate-900 text-slate-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Pie de página - Contacto y ubicación
      </h2>

      {/* CTA superior del footer */}
      <div className="bg-gradient-to-r from-medical-700 to-aqua-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              ¿Tu mascota necesita atención?
            </h3>
            <p className="text-medical-100 mt-2">
              Agenda online en 3 pasos o llama a nuestra línea 24/7.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openBooking}
              className="btn bg-white text-medical-700 hover:bg-medical-50"
              aria-label="Agendar cita online"
            >
              Agendar Cita
            </button>
            <a
              href={emergencyTel}
              className="btn bg-emergency-500 text-white hover:bg-emergency-600"
              aria-label={`Llamar al ${phoneDisplay}`}
            >
              📞 {phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Contenido principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Marca + redes */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl" role="img" aria-hidden="true">🐾</span>
              <span className="font-display font-extrabold text-xl text-white">
                {info.businessName || 'Veterinaria Mariangel'}
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-5">
              {info.tagline || 'Clínica veterinaria comprometida con el bienestar de tu mascota.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-medical-600 flex items-center justify-center transition-colors"
                    aria-label={`Visitar nuestro perfil de ${social.name}`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="font-bold text-white mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-aqua-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="hover:text-aqua-400 transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/equipo" className="hover:text-aqua-400 transition-colors">
                  Nuestro Equipo
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-aqua-400 transition-colors">
                  Blog de Salud
                </Link>
              </li>
              <li>
                <button
                  onClick={openBooking}
                  className="hover:text-aqua-400 transition-colors text-left"
                >
                  Agendar Cita
                </button>
              </li>
            </ul>
          </nav>

          {/* Columna 3: Horarios */}
          <div>
            <h3 className="font-bold text-white mb-4">Horarios de atención</h3>
            <ul className="space-y-3 text-sm">
              {schedule.map((s) => (
                <li
                  key={s.label}
                  className={`flex justify-between gap-2 ${
                    s.highlight ? 'text-emergency-400 font-semibold' : ''
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="text-slate-400 text-right">{s.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto + mapa */}
          <div>
            <h3 className="font-bold text-white mb-4">Contacto y ubicación</h3>
            <address className="not-italic text-sm space-y-2 mb-4">
              <p className="flex items-start gap-2">
                <span aria-hidden="true">📍</span>
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">📞</span>
                <a
                  href={emergencyTel}
                  className="hover:text-aqua-400 transition-colors"
                >
                  {phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">✉️</span>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-aqua-400 transition-colors"
                >
                  {email}
                </a>
              </p>
            </address>

            {/* Mapa interactivo embebido */}
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <iframe
                title="Ubicación de Veterinaria Mariangel en el mapa"
                src={mapUrl}
                className="w-full h-40"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {info.businessName || 'Veterinaria Mariangel'}. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-aqua-400 transition-colors">
              Política de privacidad
            </a>
            <a href="#" className="hover:text-aqua-400 transition-colors">
              Términos de servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}