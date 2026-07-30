const fs=require('fs');
const p='C:/Users/User/Desktop/veterinaria-app/vercel.json';
const c=JSON.stringify({
  buildCommand: "cd client && npm run build",
  outputDirectory: "client/dist",
  rewrites: [
    { source: "/api/(.*)", destination: "/api" },
    { source: "/(.*)", destination: "/index.html" }
  ],
  functions: {
    "api/index.js": {
      runtime: "nodejs 18.x",
      maxDuration: 10
    }
  }
}, null, 2);
fs.writeFileSync(p, c, 'utf8');
console.log('Vercel config OK');