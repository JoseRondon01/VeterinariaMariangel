import { readFileSync, writeFileSync } from 'fs';

const files = [
  'C:/Users/User/Desktop/veterinaria-app-new/client/src/components/BusinessInfoContext.jsx',
  'C:/Users/User/Desktop/veterinaria-app-new/client/src/components/CheckoutModal.jsx',
  'C:/Users/User/Desktop/veterinaria-app-new/client/src/pages/AdminDashboard.jsx',
];

for (const f of files) {
  let c = readFileSync(f, 'utf8');
  const orig = c;
  // Fix: apiUrl("/api/xxx')  →  apiUrl("/api/xxx")
  c = c.replace(/apiUrl\("([^")]+)'\)/g, 'apiUrl("$1")');
  if (c !== orig) {
    writeFileSync(f, c);
    const name = f.split('/').pop();
    console.log(name, 'fixed');
  } else {
    console.log(f.split('/').pop(), 'no change');
  }
}