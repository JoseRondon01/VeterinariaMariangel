import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBooking } from './BookingContext.jsx';
import { useStore } from './StoreContext.jsx';
import { useBusinessInfo } from './BusinessInfoContext.jsx';
import CheckoutModal from './CheckoutModal.jsx';

const CURRENCIES = [
  { code: 'USD', label: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'VES', label: 'VES', symbol: 'Bs.', flag: '🇻🇪' },
  { code: 'COP', label: 'COP', symbol: 'COL$', flag: '🇨🇴' },
];

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/equipo', label: 'Nuestro Equipo' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const currencyRef = useRef(null);
  const { openBooking } = useBooking();
  const { selectedCurrency, setCurrency, cartCount, cartTotalConverted, formatPrice } = useStore();
  const { getWhatsAppUrl, getPhoneDisplay, info } = useBusinessInfo();

  const EMERGENCY_PHONE = getPhoneDisplay();
  const EMERGENCY_TEL = getWhatsAppUrl();

  // Cerrar dropdown de moneda al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCurrency = CURRENCIES.find((c) => c.code === selectedCurrency) || CURRENCIES[0];

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

  const scrollToServices = () => {
    setMobileOpen(false);
    const el = document.getElementById('servicios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#servicios';
    }
  };

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
                {info.businessName || 'Veterinaria Mariangel'}
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
            <div className="hidden md:flex items-center gap-2">
              {/* Selector de Moneda */}
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
                  aria-label={`Moneda actual: ${currentCurrency.label}. Click para cambiar.`}
                  aria-expanded={currencyOpen}
                >
                  <span>{currentCurrency.flag}</span>
                  <span className="font-bold">{currentCurrency.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {currencyOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition ${
                          selectedCurrency === c.code ? 'font-bold text-medical-700 bg-medical-50' : 'text-slate-700'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                        <span className="text-slate-400 text-xs ml-auto">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Carrito */}
              <button
                onClick={() => setCheckoutOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-medical-50 hover:bg-medical-100 text-medical-700 border border-medical-200 transition"
                aria-label={`Carrito con ${cartCount} productos`}
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emergency-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Botón de Servicios */}
              <button
                onClick={scrollToServices}
                className="btn-secondary text-sm px-4 py-2.5"
                aria-label="Ver servicios veterinarios"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-normal opacity-90">
                    Nuestros
                  </span>
                  <span className="font-bold">Servicios</span>
                </span>
              </button>

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

                {/* Botón Servicios móvil */}
                <button
                  onClick={scrollToServices}
                  className="btn-secondary w-full"
                  aria-label="Ver servicios veterinarios"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-normal opacity-90">
                      Nuestros
                    </span>
                    <span className="font-bold">Servicios</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Botón carrito flotante móvil */}
      <button
        onClick={() => setCheckoutOpen(true)}
        className="md:hidden fixed bottom-24 right-4 z-40 bg-medical-600 text-white rounded-full w-14 h-14 shadow-2xl flex items-center justify-center transition hover:bg-medical-700"
        aria-label={`Carrito con ${cartCount} productos`}
      >
        <span className="text-xl">🛒</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-emergency-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Checkout Modal */}
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
