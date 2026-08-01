import { useState } from 'react';
import { useStore } from './StoreContext.jsx';
import ProductIllustration from './ProductIllustration.jsx';

export default function ProductCard({ product }) {
  const { selectedCurrency, convertPrice, formatPrice, addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const converted = convertPrice(product.priceUsd ?? product.price_usd ?? 0);
  const priceDisplay = formatPrice(converted);
  const outOfStock = (product.stock ?? 0) <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md hover:shadow-lg sm:hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden group">
      {/* Imagen */}
      <div className="relative h-36 sm:h-44 md:h-56 bg-gradient-to-br from-aqua-50 to-medical-50 overflow-hidden">
        {product.imageUrl || product.image_url ? (
          <img
            src={product.imageUrl || product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <ProductIllustration productName={product.name} />
        )}
        {/* Badge de moneda */}
        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow text-slate-600">
          {selectedCurrency}
        </span>
        {/* Stock indicator */}
        {!outOfStock && product.stock <= 5 ? (
          <span className="absolute bottom-2 left-2 bg-emergency-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            ¡Últimas {product.stock}!
          </span>
        ) : !outOfStock ? (
          <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            {product.stock} en stock
          </span>
        ) : null}
        {/* Agotado overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="text-white font-bold text-base sm:text-lg bg-slate-800/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-xs sm:text-sm md:text-base line-clamp-2 mb-1 min-h-[2.2rem] sm:min-h-[2.5rem]">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-slate-500 text-[11px] sm:text-xs line-clamp-2 mb-2 sm:mb-3 flex-1">
            {product.description}
          </p>
        )}

        {/* Precio */}
        <div className="mb-2 sm:mb-3 md:mb-4">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-medical-700">
            {priceDisplay}
          </span>
          {selectedCurrency !== 'USD' && (
            <span className="text-[10px] sm:text-xs text-slate-400 ml-1 block">
              ≈ $ {Number(product.priceUsd ?? product.price_usd ?? 0).toFixed(2)} USD
            </span>
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-auto">
          {/* Cantidad */}
          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            disabled={outOfStock}
            className="border border-slate-200 rounded-lg px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 text-slate-700 disabled:opacity-40 cursor-pointer"
            aria-label="Cantidad"
          >
            {Array.from({ length: Math.min(product.stock || 1, 10) }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Botón agregar */}
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white'
                : outOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-medical-600 text-white hover:bg-medical-700 active:scale-95'
            }`}
          >
            {added ? '✓ Agregado' : outOfStock ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}