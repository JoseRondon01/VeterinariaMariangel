import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBooking } from './BookingContext.jsx';
import { useStore } from './StoreContext.jsx';
import { useBusinessInfo } from './BusinessInfoContext.jsx';
import CheckoutModal from './CheckoutModal.jsx';

const CURRENCIES = [
  { code: 'USD', label: 'USD', symbol: '$', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { code: 'VES', label: 'VES', symbol: 'Bs.', flag: '\uD83C\uDDFB\uD83C\uDDEA' },
  { code: 'COP', label: 'COP', symbol: 'COL$', flag: '\uD83C\uDDE8\uD83C\uDDF4' },
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

  const phoneDisplay = getPhoneDisplay();
  const phoneDigits = phoneDisplay.replace(/\D/g, '');
  const emergencyTel = 'tel:+' + phoneDigits;

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

  // Bloquea scroll del body cuando el menu movil esta abierto
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
        className={'sticky top-0 z-50 transition-all duration-300 ' +
          (scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white/80 backdrop-blur-sm')
        }
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Navegacion principal"
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
                \uD83D\uDC3E
              </span>
              <span className="font-display font-extrabold text-lg md:text-2xl neon-text">
                {info.businessName || 'Veterinaria Mariangel'}
              </span>
            </Link>

            {/* Navegacion desktop */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      'px-4 py-2 rounded-lg font-medium transition-colors ' +
                      (isActive
                        ? 'text-medical-700 bg-medical-50'
                        : 'text-slate-700 hover:text-medical-600 hover:bg-slate-50')
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
                  aria-label={'Moneda actual: ' + currentCurrency.label + '. Click para cambiar.'}
                  aria-expanded={currencyOpen}
                >
                  <span>{currentCurrency.flag}</span>
                  <span className="font-bold">{currentCurrency.code}</span>
                  <svg className={'w-4 h-4 transition-transform ' + (currencyOpen ? 'rotate-180' : '')} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
                        className={'w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition ' +
                          (selectedCurrency === c.code ? 'font-bold text-medical-700 bg-medical-50' : 'text-slate-700')
                        }
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
                aria-label={'Carrito con ' + cartCount + ' productos'}
              >
                <span className="text-lg">\uD83D\uDED2</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emergency-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Boton Emergencia */}
              <a
                href={emergencyTel}
                className="btn-emergency text-sm px-4 py-2.5"
                aria-label={'Llamar ahora al numero de emergencia ' + phoneDisplay}
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

              {/* Boton de Servicios */}
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

            {/* Boton menu movil */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
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
      </header>

      {/* Menu movil */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-16 z-[60] bg-medical-700 animate-fade-in overflow-y-auto"
        >
          <div className="flex flex-col p-6 gap-1 pt-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  'px-5 py-4 rounded-xl text-lg font-semibold transition-all ' +
                  (isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white')
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Selector de Moneda movil */}
            <div className="mt-6 border-t border-white/20 pt-6">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3 px-2">Moneda</p>
              <div className="flex gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setCurrency(c.code); handleNavClick(); }}
                    className={'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ' +
                      (selectedCurrency === c.code
                        ? 'bg-white text-medical-700 shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20')
                    }
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carrito movil */}
            <div className="border-t border-white/20 pt-6">
              <button
                onClick={() => { handleNavClick(); setCheckoutOpen(true); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <span className="text-xl">\uD83D\uDED2</span>
                  Carrito
                </span>
                {cartCount > 0 ? (
                  <span className="bg-emergency-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
                    {cartCount} producto{cartCount !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-white/50 text-sm">Vacio</span>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/20 pt-6">
              <button
                onClick={() => {
                  handleNavClick();
                  openBooking();
                }}
                className="bg-white text-medical-700 font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-white/95 transition active:scale-[0.98] inline-flex items-center justify-center gap-2 w-full"
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

              {/* Boton Servicios movil */}
              <button
                onClick={scrollToServices}
                className="bg-white/10 text-white border-2 border-white/30 font-semibold text-lg py-4 rounded-xl hover:bg-white/20 transition active:scale-[0.98] inline-flex items-center justify-center gap-2 w-full"
                aria-label="Ver servicios veterinarios"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Nuestros Servicios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carrito flotante movil */}
      <button
        onClick={() => setCheckoutOpen(true)}
        className="md:hidden fixed bottom-24 right-4 z-40 bg-medical-600 text-white rounded-full w-14 h-14 shadow-2xl flex items-center justify-center transition hover:bg-medical-700"
        aria-label={'Carrito con ' + cartCount + ' productos'}
      >
        <span className="text-xl">\uD83D\uDED2</span>
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