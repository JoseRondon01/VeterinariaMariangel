import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50" aria-labelledby="blog-preview-title">
      <div className="section">
        <div className="text-center mb-12">
          <span className="chip bg-aqua-100 text-aqua-700 mb-4">
            Blog de salud
          </span>
          <h2 id="blog-preview-title" className="section-title">
            Consejos para el bienestar de tu mascota
          </h2>
          <p className="section-subtitle">
            Artículos de salud preventiva escritos por nuestros veterinarios.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                  <div className="h-5 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="card-hover overflow-hidden group">
                <Link
                  to={`/blog/${post.slug}`}
                  className="block"
                  aria-label={`Leer artículo: ${post.title}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={`Imagen del artículo: ${post.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width="400"
                      height="192"
                    />
                    <span className="absolute top-3 left-3 chip bg-white/90 text-medical-700 text-xs">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime} de lectura</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-medical-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/blog" className="btn-secondary">
            Ver todos los artículos
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