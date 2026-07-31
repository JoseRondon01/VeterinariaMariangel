import { Routes, Route } from 'react-router-dom';
import { BookingProvider } from './components/BookingContext.jsx';
import { StoreProvider } from './components/StoreContext.jsx';
import { BusinessInfoProvider } from './components/BusinessInfoContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BookingModal from './components/BookingModal.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Team from './pages/Team.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <StoreProvider>
      <BusinessInfoProvider>
        <BookingProvider>
          <ScrollToTop />
          <Routes>
          {/* Rutas Admin — standalone, sin layout público */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Rutas públicas — con layout */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tienda" element={<Shop />} />
                    <Route path="/equipo" element={<Team />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <BookingModal />
                <WhatsAppButton />
              </div>
            }
          />
          </Routes>
        </BookingProvider>
      </BusinessInfoProvider>
    </StoreProvider>
  );
}
