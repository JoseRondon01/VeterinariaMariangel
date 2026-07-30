import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBooking } from './BookingContext.jsx';

const EMERGENCY_PHONE = '+582125550199';
const EMERGENCY_TEL = 'tel:+582125550199';

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
                className="btn-emergency text-sm px-4 py-2.5"
                aria-label={`Llamar ahora al número de emergencia ${EMERGENCY_PHONE}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-normal opacity-90">
                    Emergencia 24/7
                  </span>
                  <span className="font-bold">Llamar ahora</span>
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
                  className="btn-emergency w-full"
                  aria-label={`Llamar ahora al número de emergencia ${EMERGENCY_PHONE}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-normal opacity-90">
                      Emergencia 24/7
                    </span>
                    <span className="font-bold">Llamar ahora</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Barra flotante de emergencia para móvil - siempre visible al hacer scroll */}
      <a
        href={EMERGENCY_TEL}
        className="md:hidden fixed bottom-4 right-4 z-40 btn-emergency rounded-full w-16 h-16 p-0 shadow-2xl"
        aria-label={`Emergencia veterinaria 24/7 - Llamar al ${EMERGENCY_PHONE}`}
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>
    </>
  );
}