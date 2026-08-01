import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { useStore } from '../components/StoreContext.jsx';

export default function Shop() {
  const { cartCount, formatPrice, convertPrice } = useStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => console.error('Error cargando productos:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (selectedCategory && p.categoryId !== selectedCategory && p.category_id !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(q) || desc.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero tienda */}
      <section className="bg-gradient-to-br from-medical-700 via-medical-600 to-aqua-700 text-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display mb-2 sm:mb-3">
            🛒 Tienda Veterinaria
          </h1>
          <p className="text-medical-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Todo lo que tu mascota necesita: alimentos, medicamentos, accesorios y más.
            Paga en USD, Bolívares o Pesos Colombianos.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-5 sm:-mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 flex flex-col gap-3">
          {/* Búsqueda + Badge carrito */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition"
              />
            </div>
            {cartCount > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-aqua-50 text-aqua-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0">
                <span>🛒</span>
                <span>{cartCount}</span>
              </div>
            )}
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                !selectedCategory
                  ? 'bg-medical-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-medical-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                  <div className="h-10 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">🔍</span>
            <h3 className="text-xl font-bold text-slate-700 mt-4">No se encontraron productos</h3>
            <p className="text-slate-500 mt-2">Intenta con otra búsqueda o categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}