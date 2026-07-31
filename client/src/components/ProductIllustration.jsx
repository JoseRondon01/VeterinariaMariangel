// SVG únicos para cada producto basados en su nombre
// Cada ilustración está dibujada a medida para representar el producto

const illustrations = {
  'Purina Pro Plan Adulto 15kg': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Bolsa de comida + plato */}
      <rect x="50" y="50" width="60" height="75" rx="6" fill="#E85D2C" />
      <rect x="54" y="30" width="52" height="25" rx="4" fill="#F5A623" />
      <text x="100" y="48" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">PRO PLAN</text>
      <text x="100" y="58" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">ADULTO</text>
      <rect x="70" y="50" width="20" height="75" rx="3" fill="#D44A1A" />
      {/* Huellitas en la bolsa */}
      <circle cx="85" cy="80" r="4" fill="#fff" opacity="0.4" />
      <circle cx="95" cy="100" r="4" fill="#fff" opacity="0.4" />
      <circle cx="85" cy="115" r="4" fill="#fff" opacity="0.4" />
      {/* Plato */}
      <ellipse cx="140" cy="120" rx="30" ry="8" fill="#6B4226" />
      <path d="M115 120 Q140 135 165 120" fill="#8B5E3C" />
      {/* Croquetas en el plato */}
      <circle cx="135" cy="118" r="3" fill="#D4A574" />
      <circle cx="145" cy="117" r="3" fill="#C49A65" />
      <circle cx="140" cy="114" r="2.5" fill="#E8C99B" />
    </svg>
  ),

  'Royal Canin Mini Adult 7.5kg': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Perro pequeño + bolsa */}
      <ellipse cx="85" cy="105" rx="22" ry="28" fill="#F3D4A0" />
      <circle cx="75" cy="75" r="16" fill="#F3D4A0" />
      <ellipse cx="81" cy="65" rx="9" ry="12" fill="#C4884A" />
      <circle cx="70" cy="60" r="3" fill="#333" />
      <circle cx="85" cy="60" r="3" fill="#333" />
      <ellipse cx="78" cy="65" rx="3" ry="2" fill="#333" />
      <path d="M65 85 Q78 78 91 85" stroke="#333" strokeWidth="1.5" fill="none" />
      {/* Orejas */}
      <ellipse cx="55" cy="70" rx="8" ry="12" fill="#C4884A" transform="rotate(-15 55 70)" />
      <ellipse cx="97" cy="70" rx="8" ry="12" fill="#C4884A" transform="rotate(15 97 70)" />
      {/* Cola */}
      <path d="M105 100 Q115 85 108 75" stroke="#C4884A" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Bolsa Royal Canin */}
      <rect x="120" y="55" width="45" height="55" rx="5" fill="#C41E3A" />
      <text x="142" y="78" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">ROYAL</text>
      <text x="142" y="88" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">CANIN</text>
      <text x="142" y="98" textAnchor="middle" fontSize="5" fill="#fff">MINI</text>
    </svg>
  ),

  'Bravecto Comprimido 20-40kg': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Blíster + comprimido grande */}
      <rect x="40" y="30" width="90" height="100" rx="12" fill="#E8E8E8" />
      <rect x="46" y="36" width="78" height="88" rx="8" fill="#fff" />
      {/* Comprimido grande */}
      <rect x="65" y="55" width="40" height="45" rx="12" fill="#4A90D9" />
      <rect x="68" y="58" width="34" height="39" rx="9" fill="#6BB5FF" />
      <line x1="78" y1="68" x2="92" y2="68" stroke="#fff" strokeWidth="2" opacity="0.6" />
      <line x1="78" y1="80" x2="92" y2="80" stroke="#fff" strokeWidth="2" opacity="0.6" />
      <line x1="78" y1="92" x2="92" y2="92" stroke="#fff" strokeWidth="2" opacity="0.6" />
      {/* Dosis */}
      <text x="85" y="130" textAnchor="middle" fontSize="9" fill="#4A90D9" fontWeight="bold">Bravecto</text>
    </svg>
  ),

  'Simparica Trio 10-20kg': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Escudo protector + perro */}
      <path d="M85 20 L130 40 L130 85 Q130 120 85 145 Q40 120 40 85 L40 40 Z" fill="#2196F3" opacity="0.2" stroke="#2196F3" strokeWidth="2" />
      <path d="M90 30 L125 47 L125 85 Q125 115 90 135 Q55 115 55 85 L55 47 Z" fill="#2196F3" opacity="0.15" />
      {/* Perro dentro del escudo */}
      <ellipse cx="83" cy="95" rx="15" ry="20" fill="#F5D4A0" />
      <circle cx="77" cy="72" r="11" fill="#F5D4A0" />
      <ellipse cx="80" cy="65" rx="6" ry="8" fill="#C4884A" />
      <circle cx="74" cy="62" r="2" fill="#333" />
      <circle cx="86" cy="62" r="2" fill="#333" />
      <ellipse cx="80" cy="66" rx="2" ry="1.5" fill="#333" />
      {/* Checkmark */}
      <path d="M70 110 L78 118 L98 95" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  'Collar Seresto Antipulgas Gato': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Gato con collar */}
      <ellipse cx="90" cy="105" rx="20" ry="24" fill="#FF8C42" />
      <circle cx="90" cy="70" r="18" fill="#FF8C42" />
      {/* Orejas de gato */}
      <polygon points="72,58 62,28 82,50" fill="#FF8C42" />
      <polygon points="108,58 118,28 98,50" fill="#FF8C42" />
      <polygon points="75,55 68,35 82,50" fill="#FFB38A" />
      <polygon points="105,55 112,35 98,50" fill="#FFB38A" />
      {/* Ojos */}
      <ellipse cx="81" cy="68" rx="4" ry="5" fill="#fff" />
      <ellipse cx="99" cy="68" rx="4" ry="5" fill="#fff" />
      <circle cx="82" cy="68" r="2.5" fill="#333" />
      <circle cx="100" cy="68" r="2.5" fill="#333" />
      {/* Nariz */}
      <polygon points="90,74 87,78 93,78" fill="#FF6B8A" />
      {/* Bigotes */}
      <line x1="60" y1="72" x2="78" y2="76" stroke="#333" strokeWidth="1" />
      <line x1="58" y1="78" x2="78" y2="78" stroke="#333" strokeWidth="1" />
      <line x1="102" y1="76" x2="120" y2="72" stroke="#333" strokeWidth="1" />
      <line x1="102" y1="78" x2="122" y2="78" stroke="#333" strokeWidth="1" />
      {/* Collar */}
      <path d="M70 85 Q90 92 110 85" stroke="#FF0000" strokeWidth="4" fill="none" />
      <circle cx="90" cy="91" r="4" fill="#FFD700" />
      {/* Cola */}
      <path d="M100 120 Q120 100 115 85" stroke="#FF8C42" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  ),

  'Arnés Pechera Acolchado M': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Arnés / Pechera */}
      <path d="M60 50 Q60 30 85 30 Q110 30 110 50 L110 100 L100 140 L70 140 L60 100 Z" fill="#4A90D9" opacity="0.8" />
      <path d="M65 55 Q65 35 85 35 Q105 35 105 55 L105 100 L97 135 L73 135 L65 100 Z" fill="#6BB5FF" />
      {/* Acolchado */}
      <line x1="70" y1="70" x2="100" y2="70" stroke="#fff" strokeWidth="2" opacity="0.5" />
      <line x1="70" y1="90" x2="100" y2="90" stroke="#fff" strokeWidth="2" opacity="0.5" />
      <line x1="75" y1="110" x2="95" y2="110" stroke="#fff" strokeWidth="2" opacity="0.5" />
      {/* Hebilla */}
      <rect x="58" y="45" width="8" height="14" rx="2" fill="#333" />
      {/* Anillo D */}
      <circle cx="85" cy="28" r="6" stroke="#333" strokeWidth="3" fill="none" />
      {/* Correa */}
      <path d="M85 28 L85 35" stroke="#333" strokeWidth="2" fill="none" />
    </svg>
  ),

  'Shampoo Dermatológico Veterinario': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Botella de shampoo */}
      <rect x="60" y="25" width="40" height="35" rx="3" fill="#6BB5FF" />
      {/* Tapón */}
      <rect x="72" y="15" width="16" height="15" rx="3" fill="#4A90D9" />
      {/* Bomba */}
      <rect x="76" y="5" width="8" height="15" rx="2" fill="#fff" />
      <rect x="70" y="10" width="20" height="4" rx="2" fill="#fff" />
      {/* Cuerpo botella */}
      <path d="M60 55 Q58 75 62 100 L62 140 Q62 148 70 150 L90 150 Q98 148 98 140 L98 100 Q102 75 100 55 Z" fill="#8EC8FF" />
      {/* Etiqueta */}
      <rect x="64" y="60" width="32" height="40" rx="4" fill="#fff" />
      <text x="80" y="78" textAnchor="middle" fontSize="7" fill="#4A90D9" fontWeight="bold">SHAMPOO</text>
      <text x="80" y="90" textAnchor="middle" fontSize="5" fill="#666">Dermatológico</text>
      {/* Gotas */}
      <circle cx="75" cy="155" r="3" fill="#6BB5FF" opacity="0.6" />
      <circle cx="85" cy="158" r="2" fill="#6BB5FF" opacity="0.4" />
    </svg>
  ),

  'Cepillo Dental + Pasta Enzimática': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Pasta dental */}
      <rect x="40" y="50" width="30" height="55" rx="6" fill="#4CAF50" />
      <rect x="45" y="40" width="20" height="15" rx="3" fill="#66BB6A" />
      <rect x="50" y="35" width="10" height="10" rx="2" fill="#fff" />
      <text x="55" y="90" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="bold">ENZIMA</text>
      {/* Cepillo dental */}
      <rect x="75" y="65" width="60" height="8" rx="4" fill="#FF7043" />
      <rect x="75" y="73" width="60" height="6" rx="3" fill="#FF8A65" />
      <rect x="130" y="60" width="8" height="8" rx="2" fill="#FF7043" />
      {/* Cerdas */}
      <line x1="82" y1="60" x2="82" y2="68" stroke="#fff" strokeWidth="2" />
      <line x1="90" y1="55" x2="90" y2="68" stroke="#fff" strokeWidth="2" />
      <line x1="98" y1="53" x2="98" y2="68" stroke="#fff" strokeWidth="2" />
      <line x1="106" y1="55" x2="106" y2="68" stroke="#fff" strokeWidth="2" />
      <line x1="114" y1="60" x2="114" y2="68" stroke="#fff" strokeWidth="2" />
      <line x1="122" y1="63" x2="122" y2="68" stroke="#fff" strokeWidth="2" />
      {/* Diente */}
      <path d="M150 90 Q155 80 160 90 L160 115 Q160 122 155 125 Q150 122 150 115 Z" fill="#fff" stroke="#E0E0E0" strokeWidth="1.5" />
      <circle cx="154" cy="105" r="3" fill="#4CAF50" opacity="0.3" />
    </svg>
  ),

  'Kong Classic Grande': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Juguete Kong */}
      <ellipse cx="85" cy="60" rx="30" ry="20" fill="#E53935" />
      <ellipse cx="85" cy="58" rx="26" ry="16" fill="#EF5350" />
      <path d="M55 60 Q55 120 85 140 Q115 120 115 60" fill="#E53935" />
      <ellipse cx="85" cy="130" rx="20" ry="8" fill="#B71C1C" />
      {/* Agujero */}
      <ellipse cx="85" cy="60" rx="10" ry="6" fill="#B71C1C" />
      {/* Brillo */}
      <ellipse cx="75" cy="90" rx="4" ry="15" fill="#fff" opacity="0.2" transform="rotate(-10 75 90)" />
    </svg>
  ),

  'Pelota Lanzador con Sonido': () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      {/* Pelota de tenis */}
      <circle cx="85" cy="85" r="35" fill="#CDDC39" />
      <circle cx="85" cy="85" r="33" fill="#D4E157" />
      {/* Línea de tenis */}
      <path d="M55 65 Q70 85 55 105" stroke="#fff" strokeWidth="3" fill="none" />
      <path d="M115 65 Q100 85 115 105" stroke="#fff" strokeWidth="3" fill="none" />
      {/* Ondas de sonido */}
      <path d="M125 70 Q140 85 125 100" stroke="#FF7043" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M132 60 Q152 85 132 110" stroke="#FF7043" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Lanzador */}
      <rect x="135" y="25" width="8" height="50" rx="4" fill="#FF7043" />
      <circle cx="139" cy="25" r="6" fill="#FF8A65" />
    </svg>
  ),
};

// Componente que renderiza la ilustración según el nombre del producto
export default function ProductIllustration({ productName }) {
  // Buscar coincidencia exacta primero, luego parcial
  let match = illustrations[productName];

  if (!match) {
    // Buscar por palabra clave en el nombre
    for (const [key, fn] of Object.entries(illustrations)) {
      if (productName.includes(key.substring(0, 10)) || key.includes(productName.substring(0, 10))) {
        match = fn;
        break;
      }
    }
  }

  // Fallback genérico: ilustración veterinaria
  const GenericIllustration = () => (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <ellipse cx="85" cy="100" rx="28" ry="30" fill="#E0E0E0" />
      <circle cx="80" cy="65" r="20" fill="#E0E0E0" />
      <ellipse cx="75" cy="55" rx="12" ry="15" fill="#BDBDBD" />
      <circle cx="68" cy="48" r="3.5" fill="#333" />
      <circle cx="85" cy="48" r="3.5" fill="#333" />
      <ellipse cx="77" cy="55" rx="4" ry="2.5" fill="#333" />
      <ellipse cx="60" cy="62" rx="8" ry="14" fill="#BDBDBD" transform="rotate(-15 60 62)" />
      <ellipse cx="100" cy="62" rx="8" ry="14" fill="#BDBDBD" transform="rotate(15 100 62)" />
      <path d="M108 95 Q120 80 113 68" stroke="#BDBDBD" strokeWidth="4" strokeLinecap="round" fill="none" />
      <text x="85" y="150" textAnchor="middle" fontSize="10" fill="#9E9E9E">🐾 Producto Veterinario</text>
    </svg>
  );

  const Illustration = match || GenericIllustration;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Illustration />
    </div>
  );
}