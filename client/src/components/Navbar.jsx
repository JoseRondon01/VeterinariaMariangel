import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBooking } from './BookingContext.jsx';

const EMERGENCY_PHONE = '+541127258138';
const EMERGENCY_TEL = 'https://api.whatsapp.com/send/?phone=541127258138&text&type=phone_number&app_absent=0';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/equipo', label: 'Nuestro Equipo' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();

  // Detecta scroll para aplicar sombra/fondo al navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* Skip link para accesibilidad WCAG */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-medical-600 focus:text-white focus:rounded-lg"
      >
        Saltar al contenido principal
      </a>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Navegación principal"
        >
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              onClick={handleNavClick}
              className="flex items-center gap-2 shrink-0"
              aria-label="Veterinaria Mariangel - Inicio"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                🐾
              </span>
              <span className="font-display font-extrabold text-lg md:text-2xl neon-text">
                Veterinaria <span className="neon-text-aqua">Mariangel</span>
              </span>
            </Link>

            {/* Navegación desktop */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'text-medical-700 bg-medical-50'
                          : 'text-slate-700 hover:text-medical-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Acciones desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Botón de Emergencia - STICKY, alto contraste, siempre visible */}
              <a
                href={EMERGENCY_TEL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emergency text-sm px-4 py-2.5"
                aria-label={`WhatsApp de emergencia ${EMERGENCY_PHONE}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.182-.988-.332-2.597-1.108-4.296-3.771-4.425-3.945-.13-.175-.946-1.257-.946-2.397 0-1.14.599-1.701.811-1.933.212-.232.462-.29.616-.29.154 0 .308.002.443.01.144.007.332-.054.519.396.186.449.637 1.553.694 1.664.057.111.11.242.033.387-.077.145-.116.235-.232.358-.116.123-.243.275-.348.37-.116.098-.237.205-.101.406.136.201.606 1.001 1.301 1.621.894.797 1.646 1.044 1.881 1.16.235.116.372.097.511-.056.139-.153.596-.694.755-.933.159-.239.318-.199.539-.119.221.08 1.398.658 1.638.779.24.121.4.18.458.283.058.103.058.594-.086.999z" />
                </svg>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-normal opacity-90">
                    Emergencia 24/7
                  </span>
                  <span className="font-bold">WhatsApp</span>
                </span>
              </a>

              <button
                onClick={openBooking}
                className="btn-primary text-sm px-5 py-2.5"
                aria-label="Agendar cita online"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Agendar Cita
              </button>
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Menú móvil */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="md:hidden fixed inset-0 top-16 z-40 bg-white animate-fade-in"
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                      isActive
                        ? 'text-medical-700 bg-medical-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    handleNavClick();
                    openBooking();
                  }}
                  className="btn-primary w-full"
                  aria-label="Agendar cita online"
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Agendar Cita
                </button>

                {/* Botón emergencia móvil - 100% táctil, alto contraste */}
                <a
                  href={EMERGENCY_TEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-emergency w-full"
                  aria-label={`WhatsApp de emergencia ${EMERGENCY_PHONE}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.182-.988-.332-2.597-1.108-4.296-3.771-4.425-3.945-.13-.175-.946-1.257-.946-2.397 0-1.14.599-1.701.811-1.933.212-.232.462-.29.616-.29.154 0 .308.002.443.01.144.007.332-.054.519.396.186.449.637 1.553.694 1.664.057.111.11.242.033.387-.077.145-.116.235-.232.358-.116.123-.243.275-.348.37-.116.098-.237.205-.101.406.136.201.606 1.001 1.301 1.621.894.797 1.646 1.044 1.881 1.16.235.116.372.097.511-.056.139-.153.596-.694.755-.933.159-.239.318-.199.539-.119.221.08 1.398.658 1.638.779.24.121.4.18.458.283.058.103.058.594-.086.999z" />
                  </svg>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-normal opacity-90">
                      Emergencia 24/7
                    </span>
                    <span className="font-bold">WhatsApp</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Barra flotante de WhatsApp para móvil - siempre visible al hacer scroll */}
      <a
        href={EMERGENCY_TEL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-40 btn-emergency rounded-full w-16 h-16 p-0 shadow-2xl"
        aria-label={`WhatsApp veterinaria 24/7 - ${EMERGENCY_PHONE}`}
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.182-.988-.332-2.597-1.108-4.296-3.771-4.425-3.945-.13-.175-.946-1.257-.946-2.397 0-1.14.599-1.701.811-1.933.212-.232.462-.29.616-.29.154 0 .308.002.443.01.144.007.332-.054.519.396.186.449.637 1.553.694 1.664.057.111.11.242.033.387-.077.145-.116.235-.232.358-.116.123-.243.275-.348.37-.116.098-.237.205-.101.406.136.201.606 1.001 1.301 1.621.894.797 1.646 1.044 1.881 1.16.235.116.372.097.511-.056.139-.153.596-.694.755-.933.159-.239.318-.199.539-.119.221.08 1.398.658 1.638.779.24.121.4.18.458.283.058.103.058.594-.086.999z" />
        </svg>
      </a>
    </>
  );
}