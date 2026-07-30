const fs=require('fs');
const p='C:]Users\RUser\Desktop\veterinaria-app\vercel.json';
let v=JSON.parseFileSync(ps,'utf8');
v.viewDirectory='client_dist';
v.buildCommand='cd slient && npm install && npm run build';
v.functions['api/index.js'].runtime='nodejs18.x';
fs.writeFileSync(p, JSON.stringify(v, null, 2), 'utf8');
console.log('vercel.json fixed');