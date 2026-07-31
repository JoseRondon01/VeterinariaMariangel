import { readFileSync, writeFileSync } from 'fs';

const f = 'C:/Users/User/Desktop/veterinaria-app-new/client/src/pages/AdminDashboard.jsx';
let c = readFileSync(f, 'utf8');

// Replace the image URL field with the uploader UI
const oldSection = `<div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">URL de Imagen</label>
              <input type="text" value={formImg} onChange={(e) => setFormImg(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="prod-active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="accent-medical-600 w-4 h-4" />
              <label htmlFor="prod-active" className="text-sm text-slate-600">Producto activo (visible en tienda)</label>`;

const newSection = `<div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Imagen del Producto</label>
              {formImgPreview ? (
                <div className="relative mb-2">
                  <img src={formImgPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                  <button onClick={() => { setFormImg(''); setFormImgPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600">{('\u00D7')}</button>
                </div>
              ) : null}
              <div className="flex gap-2">
                <label className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {formImgUploading ? '\u23F3 Subiendo...' : '\uD83D\uDCF7 Subir Imagen'}
                  <input type="file" accept="image/*" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setFormImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={formImgUploading} />
                </label>
                <label className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer text-center">
                  {'\uD83D\uDCF8'} Camara
                  <input type="file" accept="image/*" capture="environment" onChange={async (e) => { const fl = e.target.files?.[0]; if (!fl) return; setFormImgPreview(URL.createObjectURL(fl)); await uploadImage(fl); }} className="hidden" disabled={formImgUploading} />
                </label>
              </div>
              <input type="text" value={formImg} onChange={(e) => setFormImg(e.target.value)} placeholder="O pega URL externa..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-2 focus:ring-2 focus:ring-medical-500 outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="prod-active" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="accent-medical-600 w-4 h-4" />
              <label htmlFor="prod-active" className="text-sm text-slate-600">Producto activo (visible en tienda)</label>`;

c = c.replace(oldSection, newSection);

// Add reset of formImgPreview in resetForm
c = c.replace(
  "setFormCatId(''); setFormImg(''); setFormActive(true); setEditingId(null); setShowForm(false);",
  "setFormCatId(''); setFormImg(''); setFormImgPreview(null); setFormActive(true); setEditingId(null); setShowForm(false);"
);

writeFileSync(f, c);
console.log('Form updated successfully');