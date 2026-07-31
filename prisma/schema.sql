-- ============================================================================
-- Marketplace Veterinaria Mariangel — Esquema MySQL
-- Host: Aiven (SSL REQUIRED)
-- ============================================================================

-- Tablas existentes (se preservan): Owner, Pet, Veterinarian, Appointment,
-- BlogPost, Service, Testimonial + enums: Species, Sex, AppointmentStatus

-- ============================================================================
-- Categorías de productos
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Productos del marketplace
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_usd DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_products_category (category_id),
    INDEX idx_products_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Tasas de cambio (USD → VES, USD → COP)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL UNIQUE,
    rate_to_usd DECIMAL(12,4) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Órdenes / Pedidos
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address VARCHAR(500),
    total_usd DECIMAL(10,2) NOT NULL,
    selected_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    total_in_selected_currency DECIMAL(14,2) NOT NULL,
    payment_method ENUM('pago_movil', 'zelle', 'cash_usd', 'cash_cop') NOT NULL,
    payment_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    payment_proof_details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_status (payment_status),
    INDEX idx_orders_created (created_at),
    INDEX idx_orders_method (payment_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Ítems de cada orden
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_usd_at_purchase DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Configuración de métodos de pago (datos bancarios editables)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    bank_name VARCHAR(100),
    account_holder VARCHAR(255),
    account_number VARCHAR(50),
    phone VARCHAR(50),
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED: Datos iniciales
-- ============================================================================

-- Categorías
INSERT INTO categories (name, slug) VALUES
('Alimentos', 'alimentos'),
('Medicamentos', 'medicamentos'),
('Accesorios', 'accesorios'),
('Higiene y Cuidado', 'higiene-y-cuidado'),
('Juguetes', 'juguetes')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Productos de ejemplo
INSERT INTO products (name, description, price_usd, stock, category_id, image_url, is_active) VALUES
('Purina Pro Plan Adulto 15kg', 'Alimento balanceado para perros adultos de todas las razas. Fórmula con proteína de pollo como primer ingrediente.', 45.00, 20, 1, '/products/purina-pro-plan.png', TRUE),
('Royal Canin Mini Adult 7.5kg', 'Alimento para perros adultos de raza pequeña (hasta 10kg). Croquetas adaptadas al tamaño de su mandíbula.', 38.50, 15, 1, '/products/royal-canin-mini.png', TRUE),
('Bravecto Comprimido 20-40kg', 'Antiparasitario oral de larga duración. Protege contra pulgas y garrapatas por 12 semanas.', 32.00, 30, 2, '/products/bravecto.png', TRUE),
('Simparica Trio 10-20kg', 'Triple protección: pulgas, garrapatas y parásitos intestinales en un solo comprimido mensual.', 28.00, 25, 2, '/products/simparica-trio.png', TRUE),
('Collar Seresto Antipulgas Gato', 'Collar repelente de pulgas y garrapatas para gatos. Protección por 8 meses.', 18.00, 12, 3, '/products/seresto-gato.png', TRUE),
('Arnés Pechera Acolchado M', 'Arnés ergonómico acolchado para perros medianos. Cierre de seguridad, reflectante.', 12.50, 18, 3, '/products/arnes-acolchado.png', TRUE),
('Shampoo Dermatológico Veterinario', 'Shampoo medicado para perros con piel sensible o problemas dermatológicos. pH balanceado.', 15.00, 22, 4, '/products/shampoo-dermatologico.png', TRUE),
('Cepillo Dental + Pasta Enzimática', 'Kit de higiene dental para perros. Pasta enzimática sabor pollo + cepillo de doble cabeza.', 9.50, 35, 4, '/products/kit-dental.png', TRUE),
('Kong Classic Grande', 'Juguete interactivo de caucho natural. Ideal para masticadores fuertes. Se puede rellenar.', 14.00, 10, 5, '/products/kong-classic.png', TRUE),
('Pelota Lanzador con Sonido', 'Pelota resistente con sonido interno. Ideal para juegos de búsqueda y ejercicio.', 6.50, 40, 5, '/products/pelota-sonido.png', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Tasas de cambio iniciales (aproximadas, el admin las actualizará)
INSERT INTO exchange_rates (currency_code, rate_to_usd) VALUES
('VES', 35.50),
('COP', 4200.00)
ON DUPLICATE KEY UPDATE rate_to_usd = VALUES(rate_to_usd);

-- Configuración de métodos de pago (datos de ejemplo — el admin los cambiará por los reales)
INSERT INTO payment_config (method, label, bank_name, account_holder, account_number, phone, instructions, is_active) VALUES
('pago_movil', 'Pago Móvil', 'Banco de Venezuela', 'Veterinaria Mariangel C.A.', '01020415550000333444', '+584141234567', 'Transfiere el monto exacto y reporta los últimos 4 dígitos de la referencia.', TRUE),
('zelle', 'Zelle', NULL, 'Mariangel Garcia', 'mariangel.vet@gmail.com', NULL, 'Envía el monto exacto en USD y reporta el número de confirmación de Zelle.', TRUE),
('cash_usd', 'Efectivo USD', NULL, NULL, NULL, NULL, 'Pago contra entrega o retiro en tienda. Solo billetes en buen estado.', TRUE),
('cash_cop', 'Efectivo COP', NULL, NULL, NULL, NULL, 'Pago contra entrega o retiro en tienda. Solo billetes colombianos en buen estado.', TRUE)
ON DUPLICATE KEY UPDATE label = VALUES(label);