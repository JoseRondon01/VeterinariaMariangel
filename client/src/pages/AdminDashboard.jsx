import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_HEADERS = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// ===========================================================================
// Componente: RateManager
// ===========================================================================
function RateManager() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vesRate, setVesRate] = useState('');
  const [copRate, setCopRate] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/exchange-rates', { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => {
        setRates(data);
        const ves = data.find((r) => r.currencyCode === 'VES');
        const cop = data.find((r) => r.currencyCode === 'COP');
        if (ves) setVesRate(String(ves.rateToUsd));
        if (cop) setCopRate(String(cop.rateToUsd));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/exchange-rates', {
        method: 'PUT',
        headers: API_HEADERS(),
        body: JSON.stringify({
          rates: [
            { currencyCode: 'VES', rateToUsd: Number(vesRate) },
            { currencyCode: 'COP', rateToUsd: Number(copRate) },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRates(data.rates);
      setMsg('✅ Tasas actualizadas correctamente');
    } catch (err) {
      setMsg('❌ Error: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-32 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>💱</span> Tasas de Cambio
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            🇻🇪 Bolívares (VES) — Tasa BCV por 1 USD
          </label>
          <input
            type="number"
            value={vesRate}
            onChange={(e) => setVesRate(e.target.value)}
            step="0.01"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            🇨🇴 Pesos Colombianos (COP) — por 1 USD
          </label>
          <input
            type="number"
            value={copRate}
            onChange={(e) => setCopRate(e.target.value)}
            step="0.01"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Actualizar Tasas'}
        </button>
        {msg && <span className={`text-sm font-medium ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{msg}</span>}
      </div>
      <div className="mt-3 text-xs text-slate-400">
        Última actualización:{' '}
        {rates.length > 0
          ? new Date(rates[0].updatedAt).toLocaleString('es-VE')
          : '—'}
      </div>
    </div>
  );
}

// ===========================================================================
// Componente: OrderVerificationTable
// ===========================================================================
function OrderVerificationTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [methodFilter, setMethodFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (methodFilter) params.set('method', methodFilter);
    if (searchTerm) params.set('search', searchTerm);

    fetch(`/api/admin/orders?${params.toString()}`, { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, methodFilter]);

  const handleSearch = () => fetchOrders();

  const handleApprove = async (id) => {
    if (!confirm('¿Estás seguro de APROBAR este pago? El stock ya fue descontado.')) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}/approve`, {
        method: 'POST',
        headers: API_HEADERS(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('¿Estás seguro de RECHAZAR este pago? El stock será devuelto.')) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}/reject`, {
        method: 'POST',
        headers: API_HEADERS(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const formatUsd = (val) => `$ ${Number(val || 0).toFixed(2)}`;

  const payMethodLabel = {
    pago_movil: '📱 Pago Móvil',
    zelle: '💵 Zelle',
    cash_usd: '💲 Efectivo USD',
    cash_cop: '💲 Efectivo COP',
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  const statusLabel = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>📋</span> Verificación de Pagos
      </h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer"
        >
          <option value="">Todos los métodos</option>
          <option value="pago_movil">Pago Móvil</option>
          <option value="zelle">Zelle</option>
          <option value="cash_usd">Efectivo USD</option>
          <option value="cash_cop">Efectivo COP</option>
        </select>
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente o teléfono..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 h-16 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p className="text-3xl mb-2">📭</p>
          <p>No hay órdenes que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-2 font-medium">#</th>
                <th className="py-2 pr-2 font-medium">Cliente</th>
                <th className="py-2 pr-2 font-medium">Método</th>
                <th className="py-2 pr-2 font-medium">Total</th>
                <th className="py-2 pr-2 font-medium">Estado</th>
                <th className="py-2 pr-2 font-medium">Fecha</th>
                <th className="py-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="py-3 pr-2 font-bold text-slate-600">#{order.id}</td>
                    <td className="py-3 pr-2">
                      <span className="font-medium text-slate-800">{order.customerName}</span>
                      <br />
                      <span className="text-xs text-slate-400">{order.customerPhone}</span>
                    </td>
                    <td className="py-3 pr-2 text-xs">{payMethodLabel[order.paymentMethod] || order.paymentMethod}</td>
                    <td className="py-3 pr-2 font-medium text-slate-700">
                      {formatUsd(order.totalUsd)}
                      <br />
                      <span className="text-xs text-slate-400">{order.selectedCurrency}</span>
                    </td>
                    <td className="py-3 pr-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${statusBadge(order.paymentStatus)}`}>
                        {statusLabel[order.paymentStatus]}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('es-VE')}
                      <br />
                      {new Date(order.createdAt).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      {order.paymentStatus === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApprove(order.id); }}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-bold hover:bg-green-700 transition"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReject(order.id); }}
                            className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-bold hover:bg-red-600 transition"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Detalle expandido */}
                  {expandedId === order.id && (
                    <tr key={`detail-${order.id}`}>
                      <td colSpan={7} className="bg-slate-50 p-4 rounded-b-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Productos */}
                          <div>
                            <h4 className="font-bold text-slate-700 text-sm mb-2">Productos</h4>
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm py-1 border-b border-slate-100">
                                <span className="text-slate-600">
                                  {item.product?.name || `Producto #${item.productId}`}
                                  <span className="text-slate-400 ml-1">x{item.quantity}</span>
                                </span>
                                <span className="font-medium text-slate-700">{formatUsd(item.priceUsdAtPurchase * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Comprobante */}
                          <div>
                            <h4 className="font-bold text-slate-700 text-sm mb-2">Datos del Comprobante</h4>
                            {order.paymentProofDetails && Object.keys(order.paymentProofDetails).length > 0 ? (
                              <div className="text-sm space-y-1">
                                {order.paymentProofDetails.bankOrigin && (
                                  <p className="text-slate-600"><strong>Banco:</strong> {order.paymentProofDetails.bankOrigin}</p>
                                )}
                                {order.paymentProofDetails.transferDate && (
                                  <p className="text-slate-600"><strong>Fecha:</strong> {order.paymentProofDetails.transferDate}</p>
                                )}
                                {order.paymentProofDetails.referenceDigits && (
                                  <p className="text-slate-600"><strong>Ref:</strong> ****{order.paymentProofDetails.referenceDigits}</p>
                                )}
                                {order.paymentProofDetails.accountHolder && (
                                  <p className="text-slate-600"><strong>Titular:</strong> {order.paymentProofDetails.accountHolder}</p>
                                )}
                                {order.paymentProofDetails.confirmationNumber && (
                                  <p className="text-slate-600"><strong>Confirmación:</strong> {order.paymentProofDetails.confirmationNumber}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400">Efectivo — Sin comprobante digital</p>
                            )}
                          </div>
                        </div>

                        {order.customerAddress && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500"><strong>Dirección de entrega:</strong> {order.customerAddress}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Componente: DailySummary
// ===========================================================================
function DailySummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchSummary = () => {
    setLoading(true);
    fetch(`/api/admin/daily-summary?date=${date}`, { headers: API_HEADERS() })
      .then((r) => r.json())
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const formatUsd = (val) => `$ ${Number(val || 0).toFixed(2)}`;
  const formatVes = (val) => `Bs. ${Number(val || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
  const formatCop = (val) => `$ ${Number(val || 0).toLocaleString('es-CO')} COP`;

  const methodLabels = {
    pago_movil: '📱 Pago Móvil',
    zelle: '💵 Zelle',
    cash_usd: '💲 Efectivo USD',
    cash_cop: '💲 Efectivo COP',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>📊</span> Resumen Diario
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none"
        />
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition"
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="bg-slate-100 h-20 rounded-xl" />
          <div className="bg-slate-100 h-20 rounded-xl" />
        </div>
      ) : !summary ? (
        <p className="text-slate-400 text-sm">No hay datos disponibles.</p>
      ) : (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-medical-50 rounded-xl p-3 text-center">
              <span className="text-2xl font-extrabold text-medical-700">{summary.totalOrders}</span>
              <p className="text-xs text-medical-600 font-medium">Órdenes</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <span className="text-xl font-extrabold text-green-700">{formatUsd(summary.totalRevenueUsd)}</span>
              <p className="text-xs text-green-600 font-medium">Total USD</p>
            </div>
            <div className="bg-aqua-50 rounded-xl p-3 text-center">
              <span className="text-lg font-extrabold text-aqua-700">{formatVes(summary.byCurrency?.VES || 0)}</span>
              <p className="text-xs text-aqua-600 font-medium">Total VES</p>
            </div>
            <div className="bg-aqua-50 rounded-xl p-3 text-center">
              <span className="text-lg font-extrabold text-aqua-700">{formatCop(summary.byCurrency?.COP || 0)}</span>
              <p className="text-xs text-aqua-600 font-medium">Total COP</p>
            </div>
          </div>

          {/* Desglose por método */}
          {summary.byMethod && Object.keys(summary.byMethod).length > 0 && (
            <div>
              <h4 className="font-bold text-slate-700 text-sm mb-2">Por Método de Pago</h4>
              <div className="space-y-2">
                {Object.entries(summary.byMethod).map(([method, data]) => (
                  <div key={method} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3">
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        {methodLabels[method] || method}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">({data.count} órdenes)</span>
                    </div>
                    <span className="font-bold text-slate-800">{formatUsd(data.totalUsd)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Página principal del Dashboard
// ===========================================================================
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [username] = useState(localStorage.getItem('admin_username') || 'Admin');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    // Verificar token
    fetch('/api/admin/verify', { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => {
        if (!data.valid) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
        }
      })
      .catch(() => {
        // Si falla la verificación, asumimos válido (puede ser CORS en dev)
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'orders', label: 'Verificar Pagos', icon: '📋' },
    { id: 'summary', label: 'Resumen Diario', icon: '📊' },
    { id: 'rates', label: 'Tasas de Cambio', icon: '💱' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-medical-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <div>
              <h1 className="font-extrabold text-lg font-display">Panel Admin</h1>
              <p className="text-medical-200 text-xs">Veterinaria Mariangel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-medical-200 hidden sm:inline">
              👤 {username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
            >
              Ver Sitio
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-medical-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido del tab */}
        {activeTab === 'orders' && <OrderVerificationTable />}
        {activeTab === 'summary' && <DailySummary />}
        {activeTab === 'rates' && <RateManager />}
      </div>
    </div>
  );
}