import { Link } from 'react-router-dom';
import { useBooking } from './BookingContext.jsx';

const EMERGENCY_TEL = 'tel:+541127258138';
const EMERGENCY_PHONE = '+54 11 2725 8138';

const schedule = [
  { day: 'Lunes a Viernes', hours: '8:00 AM - 8:00 PM' },
  { day: 'Sábado', hours: '9:00 AM - 2:00 PM' },
  { day: 'Domingo', hours: 'Cerrado (solo urgencias)' },
  { day: 'Urgencias', hours: '24/7 · 365 días', highlight: true },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/vetcareplus',
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/vetcareplus',
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/vetcareplus',
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
];

export default function Footer() {
  const { openBooking } = useBooking();

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
              href={EMERGENCY_TEL}
              className="btn bg-emergency-500 text-white hover:bg-emergency-600"
              aria-label={`Llamar al ${EMERGENCY_PHONE}`}
            >
              📞 {EMERGENCY_PHONE}
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
                VetCare<span className="text-aqua-400">Plus</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-5">
              Clínica veterinaria comprometida con el bienestar de tu mascota.
              Atención humana, tecnología de punta y equipo certificado.
            </p>
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
                  key={s.day}
                  className={`flex justify-between gap-2 ${
                    s.highlight ? 'text-emergency-400 font-semibold' : ''
                  }`}
                >
                  <span>{s.day}</span>
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
                <span>Av. Principal de Las Mercedes, Edif. VetCare, Local 1, Caracas</span>
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">📞</span>
                <a
                  href={EMERGENCY_TEL}
                  className="hover:text-aqua-400 transition-colors"
                >
                  {EMERGENCY_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">✉️</span>
                <a
                  href="mailto:contacto@vetcareplus.com"
                  className="hover:text-aqua-400 transition-colors"
                >
                  contacto@vetcareplus.com
                </a>
              </p>
            </address>

            {/* Mapa interactivo embebido */}
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <iframe
                title="Ubicación de Veterinaria Mariangel en el mapa"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-66.8756%2C10.4798%2C-66.8556%2C10.4898&layer=mapnik&marker=10.4848%2C-66.8656"
                className="w-full h-40"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Veterinaria Mariangel. Todos los derechos reservados.</p>
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