import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['Todos', ...new Set(posts.map((p) => p.category))];
  const filteredPosts =
    filter === 'Todos' ? posts : posts.filter((p) => p.category === filter);

  return (
    <div id="main-content">
      {/* Header */}
      <section className="bg-gradient-to-br from-medical-50 to-aqua-50 py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="chip bg-aqua-100 text-aqua-700 mb-4">
            Blog de Salud
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Salud preventiva para tu mascota
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Guías prácticas y consejos veterinarios para mantener a tu mascota
            sana y feliz en cada etapa de su vida.
          </p>
        </div>
      </section>

      {/* Listado */}
      <section className="section" aria-labelledby="blog-list-title">
        <h2 id="blog-list-title" className="sr-only">
          Lista de artículos del blog
        </h2>

        {/* Filtros por categoría */}
        {!loading && posts.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-medical-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-medical-300'
                }`}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
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
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-slate-500 py-12">
            No hay artículos en esta categoría.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
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
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl text-slate-400" style={{ display: 'none' }}>📷</div>
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
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-medical-600 font-semibold text-sm mt-3">
                      Leer más
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}