import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ===========================================================================
// Carrito persistente en localStorage
// ===========================================================================

const CART_KEY = 'veterinaria_cart';
const CURRENCY_KEY = 'veterinaria_currency';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch { /* ignorar errores de localStorage */ }
}

function loadCurrency() {
  try {
    return localStorage.getItem(CURRENCY_KEY) || 'USD';
  } catch {
    return 'USD';
  }
}

function saveCurrency(code) {
  try {
    localStorage.setItem(CURRENCY_KEY, code);
  } catch { /* ignorar */ }
}

// ===========================================================================
// Contexto
// ===========================================================================

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [currency, setCurrencyState] = useState(loadCurrency);
  const [rates, setRates] = useState({ USD: 1, VES: 1066.00, COP: 3200.00 });
  const [ratesLoading, setRatesLoading] = useState(true);

  // Persistir carrito en localStorage cada vez que cambie
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Cargar tasas de cambio desde la API (unidades de moneda local por 1 USD)
  useEffect(() => {
    setRatesLoading(true);
    fetch('/api/exchange-rates')
      .then((res) => res.json())
      .then((data) => {
        const map = { USD: 1 };
        if (Array.isArray(data)) {
          data.forEach((r) => {
            const code = r.currencyCode || r.currency_code;
            const val = Number(r.rateToUsd ?? r.rate_to_usd ?? r.unitsPerUsd ?? r.units_per_usd);
            if (code && !isNaN(val) && val > 0) {
              map[code] = val;
            }
          });
        }
        // Asegurar que VES y COP tengan valores válidos
        if (!map.VES || map.VES <= 0) map.VES = 1066.00;
        if (!map.COP || map.COP <= 0) map.COP = 3200.00;
        setRates(map);
      })
      .catch(() => {
        // Fallback con valores por defecto si la API no responde
        setRates({ USD: 1, VES: 1066.00, COP: 3200.00 });
      })
      .finally(() => setRatesLoading(false));
  }, []);

  // =========================================================================
  // Moneda
  // =========================================================================

  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    saveCurrency(code);
  }, []);

  const selectedCurrency = currency;

  /**
   * Convierte un precio en USD a la moneda seleccionada.
   * Si la moneda es USD, devuelve el valor tal cual.
   * Para VES y COP, multiplica por la tasa.
   */
  const convertPrice = useCallback(
    (priceUsd) => {
      const num = Number(priceUsd);
      if (isNaN(num)) return 0;
      if (currency === 'USD') return num;
      const rate = Number(rates[currency]);
      // Solo usar tasa si es un número positivo válido; sino retornar 0
      if (!isFinite(rate) || rate <= 0) return 0;
      return num * rate;
    },
    [currency, rates]
  );

  /**
   * Formatea un monto según la moneda seleccionada.
   */
  const formatPrice = useCallback(
    (amount) => {
      const num = Number(amount);
      if (isNaN(num)) return '$0.00';

      switch (currency) {
        case 'USD':
          return `$ ${num.toFixed(2)}`;
        case 'VES':
          return `Bs. ${num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        case 'COP':
          return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`;
        default:
          return `$ ${num.toFixed(2)}`;
      }
    },
    [currency]
  );

  // =========================================================================
  // Carrito
  // =========================================================================

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          priceUsd: Number(product.priceUsd || product.price_usd),
          imageUrl: product.imageUrl || product.image_url || '',
          quantity: Math.min(quantity, product.stock),
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQty = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * Total del carrito en USD (suma de priceUsd * quantity).
   */
  const cartTotalUsd = cart.reduce(
    (sum, item) => sum + item.priceUsd * item.quantity,
    0
  );

  /**
   * Total del carrito en la moneda seleccionada.
   */
  const cartTotalConverted = convertPrice(cartTotalUsd);

  const value = {
    // Moneda
    selectedCurrency,
    setCurrency,
    rates,
    ratesLoading,
    convertPrice,
    formatPrice,
    // Carrito
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    cartTotalUsd,
    cartTotalConverted,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore debe usarse dentro de un StoreProvider');
  }
  return ctx;
}