import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      id="main-content"
      className="min-h-[60vh] flex items-center justify-center px-4"
    >
      <div className="text-center">
        <p className="text-7xl md:text-9xl font-extrabold text-medical-200">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-4 mb-3">
          ¡Ups! Esta página se escapó
        </h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          La página que buscas no existe o fue movida. Volvamos a un lugar seguro
          para tu mascota.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            Volver al inicio
          </Link>
          <Link to="/blog" className="btn-secondary">
            Ver el blog
          </Link>
        </div>
      </div>
    </div>
  );
}