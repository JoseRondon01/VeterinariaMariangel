# 🐾 VetCare Plus — Clínica Veterinaria Web App

Aplicación web de primer nivel para una clínica veterinaria, orientada a **máxima conversión**, confianza y atención de urgencias 24/7.

**Stack:** Node.js + Express (backend) · React + Vite + Tailwind CSS (frontend) · Prisma (schema de BD)

---

## 📁 Estructura de Directorios

```
veterinaria-app/
├── package.json              # Orquestador raíz (concurrently)
├── .env.example              # Variables de entorno (Prisma, puerto)
├── README.md
│
├── prisma/
│   └── schema.prisma         # Schema BD: Owner, Pet, Veterinarian, Appointment, BlogPost, Service, Testimonial
│
├── server/                   # Backend Express
│   ├── package.json
│   ├── index.js              # Entry point + middleware
│   └── routes/
│       └── api.js            # API REST: servicios, equipo, blog, booking, citas
│
└── client/                   # Frontend React + Vite
    ├── package.json
    ├── vite.config.js        # Proxy /api → localhost:4000
    ├── tailwind.config.js    # Design system (medical, aqua, emergency)
    ├── postcss.config.js
    ├── index.html            # SEO meta + Schema Markup VeterinaryCare
    └── src/
        ├── main.jsx          # Entry point React
        ├── App.jsx           # Routing + Layout
        ├── index.css         # Tailwind + estilos base (WCAG focus)
        ├── components/
        │   ├── Navbar.jsx           # Navbar sticky + botón emergencia
        │   ├── HeroSection.jsx      # Hero con 2 CTAs
        │   ├── TrustBand.jsx        # Métricas + certificaciones
        │   ├── Services.jsx         # Grid de servicios
        │   ├── Testimonials.jsx     # Carrusel de reseñas
        │   ├── TeamPreview.jsx      # Preview del equipo
        │   ├── BlogPreview.jsx      # Preview del blog
        │   ├── Footer.jsx           # Horarios, mapa, contacto, redes
        │   ├── BookingModal.jsx     # Flujo de reserva en 3 pasos
        │   ├── BookingContext.jsx   # Context API del modal
        │   └── ScrollToTop.jsx      # Reset scroll en cambio de ruta
        └── pages/
            ├── Home.jsx             # Landing page
            ├── Team.jsx             # Nuestro Equipo
            ├── Blog.jsx             # Listado de artículos
            ├── BlogPost.jsx         # Artículo individual
            └── NotFound.jsx         # 404
```

---

## 📦 Dependencias Clave

### Backend (`server/`)
| Paquete | Uso |
|---------|-----|
| `express` | Framework HTTP para la API REST |
| `cors` | Cross-Origin Resource Sharing |
| `prisma` (dev) | ORM para base de datos (schema definido) |

### Frontend (`client/`)
| Paquete | Uso |
|---------|-----|
| `react` + `react-dom` | Librería UI |
| `react-router-dom` | Routing SPA (Inicio, Equipo, Blog, BlogPost) |
| `vite` | Bundler y dev server ultrarrápido |
| `tailwindcss` | Framework CSS utility-first (design system) |
| `autoprefixer` + `postcss` | Procesamiento CSS |
| `concurrently` (raíz) | Ejecutar server + client en paralelo |

> **Manejo de estado:** React Context API (`BookingContext`) para el modal de reservas global.
> **Formularios:** Implementación nativa con validación en cliente + servidor.

---

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar todas las dependencias (raíz, server y client)
npm run install:all

# 2. Ejecutar ambos servidores en paralelo
npm run dev
```

Esto levantará:
- **Backend Express** → `http://localhost:4000`
- **Frontend Vite** → `http://localhost:5173`

Abre tu navegador en `http://localhost:5173` para ver la aplicación.

---

## 🎨 Sistema de Diseño

| Token | Color | Uso |
|-------|-------|-----|
| `medical` | Azul médico | Confianza, CTAs primarios |
| `aqua` | Verde agua | Calma, salud, acentos |
| `emergency` | Naranja/rojo | Botón de emergencia, alto contraste |

**Tipografía:** Inter (cuerpo) + Poppins (títulos) — alta legibilidad.

---

## ♿ Accesibilidad (WCAG 2.1)

- Skip link al contenido principal
- `aria-label` en todos los botones interactivos
- `aria-modal`, `aria-expanded`, `aria-pressed`, `aria-current`
- Focus visible con anillo de alto contraste
- Contraste de color validado
- Navegación por teclado (Escape cierra el modal)

---

## 🔍 SEO Local

- Meta tags dinámicos (title, description, keywords, Open Graph, Twitter Card)
- **Schema Markup** `VeterinaryCare` + `LocalBusiness` en `index.html`
- Horarios de atención estructurados
- Geolocalización para Google Maps
- AggregateRating embebido

---

## 🗄️ Base de Datos (Prisma)

El schema incluye:
- **Owner** → dueños de mascotas
- **Pet** → pacientes (especie, raza, microchip)
- **Veterinarian** → equipo médico
- **Appointment** → citas (estado, fecha, veterinario asignado)
- **BlogPost** → artículos SEO
- **Service** → servicios ofrecidos
- **Testimonial** → reseñas

> El backend usa datos en memoria (seed) para demo. Para usar Prisma:
> ```bash
> cd prisma && npx prisma generate && npx prisma db push