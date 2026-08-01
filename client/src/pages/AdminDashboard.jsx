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
// Componente: HeroManager (Portada / Inicio)
// ===========================================================================
function HeroManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [badgeText, setBadgeText] = useState('Urgencias disponibles 24/7');
  const [titleLine1, setTitleLine1] = useState('Cuidamos a tu mascota');
  const [titleHighlight, setTitleHighlight] = useState('como parte de la familia');
  const [subtitle, setSubtitle] = useState('Clínica veterinaria con equipo médico certificado, tecnología de punta y trato humano. Agenda tu cita online en solo 3 pasos.');
  const [ctaPrimary, setCtaPrimary] = useState('Agendar Cita');
  const [ctaSecondary, setCtaSecondary] = useState('Emergencia 24/7');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=800&fit=crop');
  const [imgUploading, setImgUploading] = useState(false);
  const [imgPreview, setImgPreview] = useState('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=800&fit=crop');
  const [certIcon, setCertIcon] = useState('🏆');
  const [certTitle, setCertTitle] = useState('Fear Free Certified');
  const [certSubtitle, setCertSubtitle] = useState('Atención sin estrés');

  // Métricas (3 fijas)
  const [metric1Value, setMetric1Value] = useState('5,000+');
  const [metric1Label, setMetric1Label] = useState('mascotas atendidas');
  const [metric2Value, setMetric2Value] = useState('4.9★');
  const [metric2Label, setMetric2Label] = useState('487 reseñas');
  const [metric3Value, setMetric3Value] = useState('12+');
  const [metric3Label, setMetric3Label] = useState('años de experiencia');

  const uploadImage = async (file) => {
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHeroImage(data.url);
      setImgPreview(data.url);
    } catch (err) { alert('Error al subir imagen: ' + err.message); }
    finally { setImgUploading(false); }
  };

  useEffect(() => {
    fetch('/api/admin/hero', { headers: API_HEADERS() })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Solo actualiza campos que tengan valor real (preserva defaults)
        if (data.badgeText) setBadgeText(data.badgeText);
        if (data.titleLine1) setTitleLine1(data.titleLine1);
        if (data.titleHighlight) setTitleHighlight(data.titleHighlight);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.ctaPrimary) setCtaPrimary(data.ctaPrimary);
        if (data.ctaSecondary) setCtaSecondary(data.ctaSecondary);
        if (data.heroImage) { setHeroImage(data.heroImage); setImgPreview(data.heroImage); }
        if (data.certificationIcon) setCertIcon(data.certificationIcon);
        if (data.certificationTitle) setCertTitle(data.certificationTitle);
        if (data.certificationSubtitle) setCertSubtitle(data.certificationSubtitle);
        const m = data.metrics;
        if (m && Array.isArray(m)) {
          if (m[0]?.value) { setMetric1Value(m[0].value); setMetric1Label(m[0].label || ''); }
          if (m[1]?.value) { setMetric2Value(m[1].value); setMetric2Label(m[1].label || ''); }
          if (m[2]?.value) { setMetric3Value(m[2].value); setMetric3Label(m[2].label || ''); }
        }
      })
      .catch((err) => console.warn('Hero API no disponible, usando valores por defecto:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const body = {
        badgeText, titleLine1, titleHighlight, subtitle,
        ctaPrimary, ctaSecondary, heroImage,
        metrics: [
          { value: metric1Value, label: metric1Label },
          { value: metric2Value, label: metric2Label },
          { value: metric3Value, label: metric3Label },
        ],
        certificationIcon: certIcon, certificationTitle: certTitle,
        certificationSubtitle: certSubtitle,
      };
      const res = await fetch('/api/admin/hero', {
        method: 'PUT', headers: API_HEADERS(), body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('✅ Portada actualizada correctamente');
    } catch (err) { setMsg('❌ Error: ' + err.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000); }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>🏠</span> Portada / Inicio
      </h2>
      <p className="text-xs text-slate-400 mb-4">Edita los textos, métricas, imagen y certificación que aparecen en la sección principal del sitio.</p>

      {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Columna 1: Textos principales */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3">📝 Textos</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Badge superior (chip verde)</label>
              <input type="text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Título (primera línea)</label>
              <input type="text" value={titleLine1} onChange={(e) => setTitleLine1(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Título (texto resaltado en verde)</label>
              <input type="text" value={titleHighlight} onChange={(e) => setTitleHighlight(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Subtítulo / Descripción</label>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows="3" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Columna 2: Botones y métricas */}
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3">🔘 Botones</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Texto botón principal (azul)</label>
                <input type="text" value={ctaPrimary} onChange={(e) => setCtaPrimary(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Texto botón secundario (rojo)</label>
                <input type="text" value={ctaSecondary} onChange={(e) => setCtaSecondary(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-700 text-sm mb-3">📊 Métricas (3)</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Valor 1</label>
                <input type="text" value={metric1Value} onChange={(e) => setMetric1Value(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta 1</label>
                <input type="text" value={metric1Label} onChange={(e) => setMetric1Label(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Valor 2</label>
                <input type="text" value={metric2Value} onChange={(e) => setMetric2Value(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta 2</label>
                <input type="text" value={metric2Label} onChange={(e) => setMetric2Label(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Valor 3</label>
                <input type="text" value={metric3Value} onChange={(e) => setMetric3Value(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta 3</label>
                <input type="text" value={metric3Label} onChange={(e) => setMetric3Label(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Imagen del Hero */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3">🖼️ Imagen principal del Hero</h3>
          {imgPreview && (
            <div className="relative mb-2">
              <img src={imgPreview} alt="Preview hero" className="w-full h-48 object-cover rounded-lg border border-slate-200" />
              <button onClick={() => { setHeroImage(''); setImgPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600">{'\u00D7'}</button>
            </div>
          )}
          <div className="flex gap-2">
            <label className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
              {imgUploading ? '\u23F3 Subiendo...' : '\uD83D\uDCF7 Subir Imagen'}
              <input type="file" accept="image/*" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={imgUploading} />
            </label>
            <label className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
              {'\uD83D\uDCF8'} C\u00E1mara
              <input type="file" accept="image/*" capture="environment" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={imgUploading} />
            </label>
          </div>
          <input type="text" value={heroImage} onChange={(e) => { setHeroImage(e.target.value); setImgPreview(e.target.value || null); }} placeholder="O pega URL externa..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-2 focus:ring-2 focus:ring-medical-500 outline-none" />
        </div>

        {/* Certificación flotante */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3">🏅 Certificación flotante</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Icono (emoji)</label>
              <input type="text" value={certIcon} onChange={(e) => setCertIcon(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Título</label>
              <input type="text" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Subtítulo</label>
              <input type="text" value={certSubtitle} onChange={(e) => setCertSubtitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        {msg && <span className={`text-sm font-medium ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{msg}</span>}
      </div>
    </div>
  );
}
function ServiceManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formPrice, setFormPrice] = useState('');

  const iconOptions = [
    { value: 'stethoscope', label: '🩺 Estetoscopio' },
    { value: 'scalpel', label: '🔪 Cirugía' },
    { value: 'scissors', label: '✂️ Peluquería' },
    { value: 'flask', label: '🧪 Laboratorio' },
    { value: 'paw', label: '🐾 Mascota' },
    { value: 'alert', label: '🚨 Urgencias' },
    { value: 'heart', label: '❤️ Corazón' },
    { value: 'bone', label: '🦴 Hueso' },
    { value: 'eye', label: '👁️ Oftalmología' },
    { value: 'tooth', label: '🦷 Dental' },
    { value: 'syringe', label: '💉 Inyección' },
    { value: 'pill', label: '💊 Medicamentos' },
    { value: 'star', label: '⭐ Especial' },
  ];

  const fetchServices = () => {
    setLoading(true);
    fetch('/api/admin/services', { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const resetForm = () => {
    setFormId(''); setFormTitle(''); setFormDesc(''); setFormIcon(''); setFormFeatures(''); setFormPrice('');
    setEditingId(null); setShowForm(false);
  };

  const openNew = () => { resetForm(); setShowForm(true); };

  const openEdit = (s) => {
    setEditingId(s.id);
    setFormId(s.id);
    setFormTitle(s.title || '');
    setFormDesc(s.description || '');
    setFormIcon(s.icon || '');
    setFormFeatures(Array.isArray(s.features) ? s.features.join('\n') : '');
    setFormPrice(String(s.priceUsd || 0));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formId.trim() || !formTitle.trim()) {
      setMsg('❌ Slug (ID) y título son obligatorios');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setSaving(true); setMsg('');
    try {
      const body = {
        id: formId.trim().toLowerCase().replace(/\s+/g, '-'),
        title: formTitle.trim(),
        description: formDesc.trim(),
        icon: formIcon,
        features: formFeatures.trim() ? formFeatures.split('\n').map((f) => f.trim()).filter(Boolean) : [],
        priceUsd: Number(formPrice || 0),
      };
      const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: API_HEADERS(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(editingId ? '✅ Servicio actualizado' : '✅ Servicio creado');
      resetForm();
      fetchServices();
    } catch (err) { setMsg('❌ Error: ' + err.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE', headers: API_HEADERS() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchServices();
    } catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>🩺</span> Gestión de Servicios
        </h2>
        <button onClick={openNew} className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition">
          + Nuevo Servicio
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-4">Edita los servicios que aparecen en la sección "Nuestros Servicios" del sitio web.</p>

      {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>}

      {showForm && (
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm mb-3">{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Slug ID * (ej: consultas)</label>
              <input type="text" value={formId} onChange={(e) => setFormId(e.target.value)} disabled={!!editingId}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none disabled:bg-slate-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Título *</label>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Icono</label>
              <select value={formIcon} onChange={(e) => setFormIcon(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-medical-500 outline-none">
                <option value="">Sin icono</option>
                {iconOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Características (una por línea)</label>
              <textarea value={formFeatures} onChange={(e) => setFormFeatures(e.target.value)} rows="3"
                placeholder="Examen físico completo&#10;Diagnóstico por imagen&#10;Seguimiento veterinario"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Precio (USD)</label>
              <input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" placeholder="0.00" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows="2"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50">
              {saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
            </button>
            <button onClick={resetForm} className="px-5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="text-center py-8 text-slate-400"><p className="text-3xl mb-2">🩺</p><p>No hay servicios registrados.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <div key={s.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{s.icon === 'stethoscope' ? '🩺' : s.icon === 'scalpel' ? '🔪' : s.icon === 'scissors' ? '✂️' : s.icon === 'flask' ? '🧪' : s.icon === 'paw' ? '🐾' : s.icon === 'alert' ? '🚨' : s.icon === 'heart' ? '❤️' : s.icon === 'bone' ? '🦴' : s.icon === 'eye' ? '👁️' : s.icon === 'tooth' ? '🦷' : s.icon === 'syringe' ? '💉' : s.icon === 'pill' ? '💊' : s.icon === 'star' ? '⭐' : '📋'}</span>
                <h3 className="font-bold text-slate-800 text-sm">{s.title}</h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{s.description}</p>
              {s.features && s.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {s.features.map((f, i) => <span key={i} className="chip bg-slate-100 text-slate-600 text-xs">{f}</span>)}
                </div>
              )}
              <div className="flex gap-1 mt-3">
                <button onClick={() => openEdit(s)} className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium hover:bg-slate-200 transition">Editar</button>
                <button onClick={() => handleDelete(s.id, s.title)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium hover:bg-red-100 transition">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
        if (ves) setVesRate(String(ves.rateToUsd ?? ves.unitsPerUsd ?? ves.rate_to_usd ?? ves.units_per_usd));
        if (cop) setCopRate(String(cop.rateToUsd ?? cop.unitsPerUsd ?? cop.rate_to_usd ?? cop.units_per_usd));
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
             🇻🇪 Bolívares (VES) — Bolívares por 1 USD
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
             🇨🇴 Pesos Colombianos (COP) — Pesos por 1 USD
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
// Componente: BusinessInfoManager
// ===========================================================================
function BusinessInfoManager() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  // Schedule
  const [schedWeekdaysLabel, setSchedWeekdaysLabel] = useState('');
  const [schedWeekdaysHours, setSchedWeekdaysHours] = useState('');
  const [schedSaturdayLabel, setSchedSaturdayLabel] = useState('');
  const [schedSaturdayHours, setSchedSaturdayHours] = useState('');
  const [schedSundayLabel, setSchedSundayLabel] = useState('');
  const [schedSundayHours, setSchedSundayHours] = useState('');
  const [schedEmergencyLabel, setSchedEmergencyLabel] = useState('');
  const [schedEmergencyHours, setSchedEmergencyHours] = useState('');
  // Social
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');

  useEffect(() => {
    fetch('/api/admin/business-info', { headers: API_HEADERS() })
      .then(async (r) => {
        if (!r.ok) throw new Error('API error');
        const text = await r.text();
        try { return JSON.parse(text); }
        catch { throw new Error('Invalid JSON'); }
      })
      .then((data) => {
        setInfo(data);
        setBusinessName(data.businessName || 'Veterinaria Mariangel');
        setTagline(data.tagline || '');
        setPhone(data.phone || '+541127258138');
        setWhatsappNumber(data.whatsappNumber || '541127258138');
        setEmail(data.email || 'contacto@veterinariamariangel.com');
        setAddress(data.address || '');
        setMapEmbedUrl(data.mapEmbedUrl || '');
        const s = data.schedule || {};
        setSchedWeekdaysLabel(s.weekdays?.label || 'Lunes a Viernes');
        setSchedWeekdaysHours(s.weekdays?.hours || '8:00 AM - 8:00 PM');
        setSchedSaturdayLabel(s.saturday?.label || 'Sábado');
        setSchedSaturdayHours(s.saturday?.hours || '9:00 AM - 2:00 PM');
        setSchedSundayLabel(s.sunday?.label || 'Domingo');
        setSchedSundayHours(s.sunday?.hours || 'Cerrado (solo urgencias)');
        setSchedEmergencyLabel(s.emergency?.label || 'Urgencias');
        setSchedEmergencyHours(s.emergency?.hours || '24/7 · 365 días');
        const soc = data.social || {};
        setFacebook(soc.facebook || '');
        setInstagram(soc.instagram || '');
        setTwitter(soc.twitter || '');
        setTiktok(soc.tiktok || '');
      })
      .catch(() => {
        // Fallback con datos por defecto mientras la API no esté lista
        setBusinessName('Veterinaria Mariangel');
        setTagline('Clínica veterinaria comprometida con el bienestar de tu mascota.');
        setPhone('+541127258138');
        setWhatsappNumber('541127258138');
        setEmail('contacto@veterinariamariangel.com');
        setAddress('Av. Principal de Las Mercedes, Caracas');
        setMapEmbedUrl('');
        setSchedWeekdaysLabel('Lunes a Viernes');
        setSchedWeekdaysHours('8:00 AM - 8:00 PM');
        setSchedSaturdayLabel('Sábado');
        setSchedSaturdayHours('9:00 AM - 2:00 PM');
        setSchedSundayLabel('Domingo');
        setSchedSundayHours('Cerrado (solo urgencias)');
        setSchedEmergencyLabel('Urgencias');
        setSchedEmergencyHours('24/7 · 365 días');
        setFacebook('https://www.facebook.com/jose.m.rondon.5');
        setInstagram('https://www.instagram.com/joserondoon01/');
        setTwitter('');
        setTiktok('');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/business-info', {
        method: 'PUT',
        headers: API_HEADERS(),
        body: JSON.stringify({
          businessName,
          tagline,
          phone,
          whatsappNumber,
          email,
          address,
          mapEmbedUrl,
          schedule: {
            weekdays: { label: schedWeekdaysLabel, hours: schedWeekdaysHours },
            saturday: { label: schedSaturdayLabel, hours: schedSaturdayHours },
            sunday: { label: schedSundayLabel, hours: schedSundayHours },
            emergency: { label: schedEmergencyLabel, hours: schedEmergencyHours, highlight: true },
          },
          social: {
            facebook,
            instagram,
            twitter,
            tiktok,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInfo(data.info);
      setMsg('✅ Información actualizada correctamente');
    } catch (err) {
      setMsg('❌ Error: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>🏢</span> Información del Negocio
      </h2>

      <div className="space-y-6">
        {/* Marca */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <span>🏷️</span> Marca
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nombre del negocio</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Eslogan / Descripción corta</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <span>📞</span> Contacto
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Teléfono (mostrado)</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+584141234567"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Número WhatsApp (solo dígitos)</label>
              <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="584141234567"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Dirección física</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">URL del mapa embebido (OpenStreetMap)</label>
              <input type="text" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <span>🕐</span> Horarios de Atención
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Lunes a Viernes — Etiqueta</label>
                <input type="text" value={schedWeekdaysLabel} onChange={(e) => setSchedWeekdaysLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Horario</label>
                <input type="text" value={schedWeekdaysHours} onChange={(e) => setSchedWeekdaysHours(e.target.value)}
                  placeholder="8:00 AM - 8:00 PM"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Sábado — Etiqueta</label>
                <input type="text" value={schedSaturdayLabel} onChange={(e) => setSchedSaturdayLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Horario</label>
                <input type="text" value={schedSaturdayHours} onChange={(e) => setSchedSaturdayHours(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Domingo — Etiqueta</label>
                <input type="text" value={schedSundayLabel} onChange={(e) => setSchedSundayLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Horario</label>
                <input type="text" value={schedSundayHours} onChange={(e) => setSchedSundayHours(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Urgencias — Etiqueta</label>
                <input type="text" value={schedEmergencyLabel} onChange={(e) => setSchedEmergencyLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Horario</label>
                <input type="text" value={schedEmergencyHours} onChange={(e) => setSchedEmergencyHours(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
            <span>🌐</span> Redes Sociales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Facebook (URL)</label>
              <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Instagram (URL)</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Twitter / X (URL)</label>
              <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">TikTok (URL)</label>
              <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Guardar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {msg && <span className={`text-sm font-medium ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Componente: ProductManager
// ===========================================================================
function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formCatId, setFormCatId] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formImgUploading, setFormImgUploading] = useState(false);
  const [formImgPreview, setFormImgPreview] = useState(null);

  const resetForm = () => {
    setFormName(''); setFormDesc(''); setFormPrice(''); setFormStock('');
    setFormCatId(''); setFormImg(''); setFormImgPreview(null); setFormActive(true); setEditingId(null); setShowForm(false);
  };

  const openNew = () => { resetForm(); setShowForm(true); };

  const openEdit = (p) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormDesc(p.description || '');
    setFormPrice(String(p.priceUsd || 0));
    setFormStock(String(p.stock || 0));
    setFormCatId(p.categoryId ? String(p.categoryId) : '');
    setFormImg(p.imageUrl || '');
    setFormImgPreview(p.imageUrl || null);
    setFormActive(p.isActive);
    setShowForm(true);
  };

  const uploadImage = async (file) => {
    setFormImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormImg(data.url);
      setFormImgPreview(data.url);
    } catch (err) {
      alert('Error al subir imagen: ' + err.message);
    } finally {
      setFormImgUploading(false);
    }
  };

  const fetchProducts = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/products', { headers: API_HEADERS() }).then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()).catch(() => []),
    ])
      .then(([prods, cats]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (!formName.trim() || !formPrice || !formStock) {
      setMsg('❌ Nombre, precio y stock son obligatorios');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setSaving(true); setMsg('');
    try {
      const body = {
        name: formName.trim(),
        description: formDesc.trim(),
        priceUsd: Number(formPrice),
        stock: Number(formStock),
        categoryId: formCatId ? Number(formCatId) : null,
        imageUrl: formImg.trim() || null,
        isActive: formActive,
      };
      const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: API_HEADERS(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(editingId ? '✅ Producto actualizado' : '✅ Producto creado');
      resetForm();
      fetchProducts();
    } catch (err) { setMsg('❌ Error: ' + err.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: API_HEADERS() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchProducts();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const formatUsd = (v) => `$ ${Number(v || 0).toFixed(2)}`;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>📦</span> Gestión de Productos
        </h2>
        <button onClick={openNew} className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition">
          + Nuevo Producto
        </button>
      </div>

      {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>}

      {/* Formulario */}
      {showForm && (
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm mb-3">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nombre *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Precio (USD) *</label>
              <input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Stock *</label>
              <input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
              <select value={formCatId} onChange={(e) => setFormCatId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-medical-500 outline-none">
                <option value="">Sin categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows="2" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Imagen del Producto</label>
              {formImgPreview && (
                <div className="relative mb-2">
                  <img src={formImgPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                  <button onClick={() => { setFormImg(''); setFormImgPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600">{'\u00D7'}</button>
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {formImgUploading ? '\u23F3 Subiendo...' : '\uD83D\uDCF7 Subir Imagen'}
                  <input type="file" accept="image/*" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setFormImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={formImgUploading} />
                </label>
                <label className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {'\uD83D\uDCF8'} C\u00E1mara
                  <input type="file" accept="image/*" capture="environment" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setFormImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={formImgUploading} />
                </label>
              </div>
              <input type="text" value={formImg} onChange={(e) => setFormImg(e.target.value)} placeholder="O pega URL externa..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-2 focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="prod-active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="accent-medical-600 w-4 h-4" />
              <label htmlFor="prod-active" className="text-sm text-slate-600">Producto activo (visible en tienda)</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50">{saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}</button>
            <button onClick={resetForm} className="px-5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? <div className="animate-pulse space-y-2">{[1,2,3].map(i=><div key={i} className="bg-slate-100 h-16 rounded-xl"/>)}</div>
      : products.length === 0 ? <div className="text-center py-8 text-slate-400"><p className="text-3xl mb-2">📦</p><p>No hay productos registrados.</p></div>
      : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-2 font-medium">Producto</th>
              <th className="py-2 pr-2 font-medium">Categoría</th>
              <th className="py-2 pr-2 font-medium">Precio USD</th>
              <th className="py-2 pr-2 font-medium">Stock</th>
              <th className="py-2 pr-2 font-medium">Estado</th>
              <th className="py-2 font-medium">Acciones</th>
            </tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2">
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" /> : <span className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-400">📷</span>}
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-slate-600">{p.category?.name || '—'}</td>
                  <td className="py-3 pr-2 font-medium text-slate-700">{formatUsd(p.priceUsd)}</td>
                  <td className="py-3 pr-2">
                    <span className={`font-bold ${(p.stock ?? 0) <= 0 ? 'text-red-600' : (p.stock ?? 0) <= 5 ? 'text-emergency-600' : 'text-green-600'}`}>
                      {p.stock ?? 0}
                    </span>
                  </td>
                  <td className="py-3 pr-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium hover:bg-slate-200 transition">Editar</button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium hover:bg-red-100 transition">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Componente: TeamManager
// ===========================================================================
function TeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('');
  const [formExperience, setFormExperience] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formImgUploading, setFormImgUploading] = useState(false);
  const [formImgPreview, setFormImgPreview] = useState(null);

  const fetchTeam = () => {
    setLoading(true);
    fetch('/api/admin/team', { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        // Normalizar: tanto DB (fullName) como memoria (name) → fullName
        const normalized = arr.map((v) => ({
          ...v,
          fullName: v.fullName || v.name || 'Sin nombre',
          image: v.image || '',
        }));
        setTeam(normalized);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeam(); }, []);

  const openEdit = (v) => {
    setEditingId(v.id);
    setFormName(v.fullName || '');
    setFormRole(v.role || '');
    setFormSpecialty(v.specialty || '');
    setFormExperience(v.experience || '');
    setFormBio(v.bio || '');
    setFormImg(v.image || '');
    setFormImgPreview(v.image || null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormName(''); setFormRole(''); setFormSpecialty('');
    setFormExperience(''); setFormBio(''); setFormImg('');
    setFormImgPreview(null);
  };

  const uploadImage = async (file) => {
    setFormImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormImg(data.url);
      setFormImgPreview(data.url);
    } catch (err) {
      alert('Error al subir imagen: ' + err.message);
    } finally {
      setFormImgUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setMsg('❌ El nombre es obligatorio');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      const body = {
        fullName: formName.trim(),
        role: formRole.trim(),
        specialty: formSpecialty.trim(),
        experience: formExperience.trim(),
        bio: formBio.trim(),
        image: formImg.trim() || null,
      };
      const res = await fetch(`/api/admin/team/${editingId}`, {
        method: 'PUT',
        headers: API_HEADERS(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('✅ Miembro del equipo actualizado');
      cancelEdit();
      fetchTeam();
    } catch (err) {
      setMsg('❌ Error: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>👥</span> Gestión del Equipo
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Cambia las fotos y datos de los profesionales que aparecen en la sección "Equipo" del sitio web.
      </p>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}

      {/* Formulario de edición */}
      {editingId && (
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm mb-3">
            Editar: {team.find((v) => v.id === editingId)?.fullName || ''}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nombre completo *</label>
              <input
                type="text" value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Rol / Cargo</label>
              <input
                type="text" value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Especialidad</label>
              <input
                type="text" value={formSpecialty}
                onChange={(e) => setFormSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Experiencia</label>
              <input
                type="text" value={formExperience}
                onChange={(e) => setFormExperience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Bio</label>
              <textarea
                value={formBio} onChange={(e) => setFormBio(e.target.value)} rows="2"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
            {/* Selector de imagen con Cloudinary */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Foto del Profesional</label>
              {formImgPreview && (
                <div className="relative mb-2">
                  <img
                    src={formImgPreview} alt="Preview"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-medical-100"
                  />
                  <button
                    onClick={() => { setFormImg(''); setFormImgPreview(null); }}
                    className="absolute top-1 left-[120px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                  >
                    {'\u00D7'}
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {formImgUploading ? '\u23F3 Subiendo...' : '\uD83D\uDCF7 Subir Imagen'}
                  <input
                    type="file" accept="image/*"
                    onChange={async (e) => {
                      const fl = e.target.files?.[0];
                      if (!fl) return;
                      setFormImgPreview(URL.createObjectURL(fl));
                      await uploadImage(fl);
                    }}
                    className="hidden" disabled={formImgUploading}
                  />
                </label>
                <label className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {'\uD83D\uDCF8'} C\u00E1mara
                  <input
                    type="file" accept="image/*" capture="environment"
                    onChange={async (e) => {
                      const fl = e.target.files?.[0];
                      if (!fl) return;
                      setFormImgPreview(URL.createObjectURL(fl));
                      await uploadImage(fl);
                    }}
                    className="hidden" disabled={formImgUploading}
                  />
                </label>
              </div>
              <input
                type="text" value={formImg}
                onChange={(e) => { setFormImg(e.target.value); setFormImgPreview(e.target.value || null); }}
                placeholder="O pega URL externa..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-2 focus:ring-2 focus:ring-medical-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grid de miembros */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((member) => (
          <div key={member.id} className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
            <img
              src={member.image || '/dra-mariangel.png'}
              alt={member.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-medical-100 mx-auto mb-3"
            />
            <h3 className="font-bold text-slate-800 text-sm">{member.fullName}</h3>
            <p className="text-xs text-medical-600 font-medium mt-1">{member.role}</p>
            <p className="text-xs text-slate-400 mt-1">{member.experience} de experiencia</p>
            <button
              onClick={() => openEdit(member)}
              className="mt-3 px-4 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium hover:bg-slate-200 transition"
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Componente: TestimonialManager
// ===========================================================================
function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const [formName, setFormName] = useState('');
  const [formPet, setFormPet] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formActive, setFormActive] = useState(true);

  const fetchTestimonials = () => {
    setLoading(true);
    fetch('/api/admin/testimonials', { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => setTestimonials(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openEdit = (t) => {
    setEditingId(t.id);
    setFormName(t.name || '');
    setFormPet(t.pet || '');
    setFormRating(t.rating || 5);
    setFormText(t.text || '');
    setFormAvatar(t.avatar || '');
    setFormActive(t.active !== false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormName(''); setFormPet(''); setFormRating(5); setFormText(''); setFormAvatar(''); setFormActive(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formText.trim()) {
      setMsg('❌ Nombre y texto del testimonio son obligatorios');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setSaving(true); setMsg('');
    try {
      const body = { name: formName.trim(), pet: formPet.trim(), rating: formRating, text: formText.trim(), avatar: formAvatar.trim(), active: formActive };
      const res = await fetch(`/api/admin/testimonials/${editingId}`, {
        method: 'PUT',
        headers: API_HEADERS(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('✅ Testimonio actualizado');
      cancelEdit();
      fetchTestimonials();
    } catch (err) { setMsg('❌ Error: ' + err.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar el testimonio de "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE', headers: API_HEADERS() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchTestimonials();
    } catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <span>⭐</span> Gestión de Reseñas
      </h2>
      <p className="text-xs text-slate-400 mb-4">Modera y gestiona los testimonios que aparecen en la web.</p>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}

      {editingId && (
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm mb-3">Editar: {testimonials.find((t) => t.id === editingId)?.name || ''}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nombre *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Mascota</label>
              <input type="text" value={formPet} onChange={(e) => setFormPet(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setFormRating(star)}
                    className="text-2xl transition-transform hover:scale-110">
                    {star <= formRating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Avatar (URL)</label>
              <input type="text" value={formAvatar} onChange={(e) => setFormAvatar(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Texto del testimonio *</label>
              <textarea value={formText} onChange={(e) => setFormText(e.target.value)} rows="3" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="test-active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="accent-medical-600 w-4 h-4" />
              <label htmlFor="test-active" className="text-sm text-slate-600">Visible en el sitio</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button onClick={cancelEdit} className="px-5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
          </div>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="text-center py-8 text-slate-400"><p className="text-3xl mb-2">⭐</p><p>No hay testimonios registrados.</p></div>
      ) : (
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-center gap-4 border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{t.name}</span>
                  <span className="text-xs text-slate-400">{t.pet}</span>
                  <span className="text-xs">{'⭐'.repeat(t.rating || 5)}</span>
                  {!t.active && <span className="chip bg-red-100 text-red-600 text-xs">Oculto</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{t.text}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(t)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium hover:bg-slate-200 transition">Editar</button>
                <button onClick={() => handleDelete(t.id, t.name)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium hover:bg-red-100 transition">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Componente: BlogManager
// ===========================================================================
function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formReadingTime, setFormReadingTime] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formImgUploading, setFormImgUploading] = useState(false);
  const [formImgPreview, setFormImgPreview] = useState(null);

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/admin/blog', { headers: API_HEADERS() })
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setFormTitle(''); setFormExcerpt(''); setFormCategory(''); setFormDate('');
    setFormReadingTime(''); setFormContent(''); setFormSlug('');
    setFormImg(''); setFormImgPreview(null); setEditingId(null); setShowForm(false);
  };

  const openNew = () => { resetForm(); setShowForm(true); };

  const openEdit = (p) => {
    setEditingId(p.id);
    setFormTitle(p.title || '');
    setFormExcerpt(p.excerpt || '');
    setFormCategory(p.category || '');
    setFormDate(p.date || '');
    setFormReadingTime(p.readingTime || '');
    setFormContent(p.content || '');
    setFormSlug(p.slug || '');
    setFormImg(p.image || '');
    setFormImgPreview(p.image || null);
    setShowForm(true);
  };

  const uploadImage = async (file) => {
    setFormImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormImg(data.url);
      setFormImgPreview(data.url);
    } catch (err) {
      alert('Error al subir imagen: ' + err.message);
    } finally {
      setFormImgUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formTitle.trim()) { setMsg('❌ El título es obligatorio'); setTimeout(() => setMsg(''), 3000); return; }
    setSaving(true); setMsg('');
    try {
      const body = {
        title: formTitle.trim(),
        excerpt: formExcerpt.trim(),
        category: formCategory.trim(),
        date: formDate,
        readingTime: formReadingTime.trim(),
        content: formContent.trim(),
        image: formImg.trim() || null,
        slug: formSlug.trim() || undefined,
      };
      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: API_HEADERS(), body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(editingId ? '✅ Artículo actualizado' : '✅ Artículo creado');
      resetForm();
      fetchPosts();
    } catch (err) { setMsg('❌ Error: ' + err.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', headers: API_HEADERS() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchPosts();
    } catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="animate-pulse bg-slate-100 h-64 rounded-xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>📝</span> Gestión de Consejos (Blog)
        </h2>
        <button onClick={openNew} className="px-4 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition">
          + Nuevo Artículo
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-4">Edita los artículos que aparecen en la sección "Blog de Salud" del sitio web.</p>

      {msg && <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>}

      {/* Formulario */}
      {showForm && (
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm mb-3">{editingId ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Título *</label>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoría</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-medical-500 outline-none">
                <option value="">Sin categoría</option>
                <option value="Salud Preventiva">Salud Preventiva</option>
                <option value="Urgencias">Urgencias</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Cuidado Dental">Cuidado Dental</option>
                <option value="Bienestar General">Bienestar General</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fecha</label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tiempo de lectura</label>
              <input type="text" value={formReadingTime} onChange={(e) => setFormReadingTime(e.target.value)} placeholder="5 min" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Extracto</label>
              <textarea value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)} rows="2" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Contenido completo</label>
              <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows="5" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Slug (URL)</label>
              <input type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="auto-generado" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            {/* Selector de imagen Cloudinary */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Imagen del Artículo</label>
              {formImgPreview && (
                <div className="relative mb-2">
                  <img src={formImgPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                  <button onClick={() => { setFormImg(''); setFormImgPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600">{'\u00D7'}</button>
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {formImgUploading ? '\u23F3 Subiendo...' : '\uD83D\uDCF7 Subir Imagen'}
                  <input type="file" accept="image/*" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setFormImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={formImgUploading} />
                </label>
                <label className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {'\uD83D\uDCF8'} C\u00E1mara
                  <input type="file" accept="image/*" capture="environment" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setFormImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={formImgUploading} />
                </label>
              </div>
              <input type="text" value={formImg} onChange={(e) => { setFormImg(e.target.value); setFormImgPreview(e.target.value || null); }} placeholder="O pega URL externa..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-2 focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-medical-600 text-white rounded-xl font-bold text-sm hover:bg-medical-700 transition disabled:opacity-50">{saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}</button>
            <button onClick={resetForm} className="px-5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista de artículos */}
      {posts.length === 0 ? (
        <div className="text-center py-8 text-slate-400"><p className="text-3xl mb-2">📝</p><p>No hay artículos registrados.</p></div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition">
              <img
                src={post.image || ''}
                alt={post.title}
                className="w-20 h-16 rounded-lg object-cover shrink-0"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <span className="w-20 h-16 rounded-lg bg-slate-200 shrink-0 items-center justify-center text-xs text-slate-400" style={{ display: 'none' }}>📷</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate">{post.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="chip bg-medical-50 text-medical-600 text-xs">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.date}</span>
                  <span className="text-xs text-slate-400">· {post.readingTime}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{post.excerpt}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(post)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium hover:bg-slate-200 transition">Editar</button>
                <button onClick={() => handleDelete(post.id, post.title)} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium hover:bg-red-100 transition">Eliminar</button>
              </div>
            </div>
          ))}
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
    { id: 'hero', label: 'Inicio', icon: '🏠' },
    { id: 'business', label: 'Info Negocio', icon: '🏢' },
    { id: 'services', label: 'Servicios', icon: '🩺' },
    { id: 'team', label: 'Equipo', icon: '👥' },
    { id: 'blog', label: 'Consejos', icon: '📝' },
    { id: 'testimonials', label: 'Reseñas', icon: '⭐' },
    { id: 'products', label: 'Productos', icon: '📦' },
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
        {activeTab === 'hero' && <HeroManager />}
        {activeTab === 'business' && <BusinessInfoManager />}
        {activeTab === 'services' && <ServiceManager />}
        {activeTab === 'team' && <TeamManager />}
        {activeTab === 'blog' && <BlogManager />}
        {activeTab === 'testimonials' && <TestimonialManager />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'orders' && <OrderVerificationTable />}
        {activeTab === 'summary' && <DailySummary />}
        {activeTab === 'rates' && <RateManager />}
      </div>
    </div>
  );
}