import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../components/BookingContext.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { openBooking } = useBooking();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Artículo no encontrado');
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div id="main-content" className="section">
        <div className="max-w-3xl mx-auto">
          <div className="h-64 bg-slate-200 rounded-2xl mb-6 animate-pulse"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="main-content" className="section text-center">
        <p className="text-2xl font-bold text-slate-900 mb-3">{error}</p>
        <Link to="/blog" className="btn-primary">
          Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <div id="main-content">
      {/* Hero del artículo */}
      <article>
        <header className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={`Imagen del artículo: ${post.title}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-3xl mx-auto">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-3"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver al blog
              </Link>
              <span className="chip bg-medical-600 text-white mb-3">
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-white/80 mt-3">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} de lectura</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <div className="section max-w-3xl">
          <p className="text-lg text-slate-700 font-medium mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p>{post.content}</p>
            <p>
              En Veterinaria Mariangel creemos que la educación del dueño es la primera
              línea de defensa para la salud de tu mascota. Si tienes dudas sobre
              este artículo o notas algún síntoma en tu compañero de cuatro
              patas, no dudes en contactarnos.
            </p>
            <h2 className="text-xl font-bold text-slate-900 pt-4">
              ¿Necesitas una consulta?
            </h2>
            <p>
              Nuestro equipo está listo para ayudarte. Agenda una cita online en
              solo 3 pasos y recibe atención profesional con trato humano.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 bg-gradient-to-br from-medical-50 to-aqua-50 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              ¿Tu mascota necesita atención veterinaria?
            </h3>
            <p className="text-slate-600 mb-4">
              Agenda online en 3 pasos. Equipo certificado y trato Fear Free.
            </p>
            <button onClick={openBooking} className="btn-primary">
              Agendar Cita
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}