import HeroSection from '../components/HeroSection.jsx';
import TrustBand from '../components/TrustBand.jsx';
import Services from '../components/Services.jsx';
import Testimonials from '../components/Testimonials.jsx';
import TeamPreview from '../components/TeamPreview.jsx';
import BlogPreview from '../components/BlogPreview.jsx';

export default function Home() {
  return (
    <div id="main-content">
      <HeroSection />
      <TrustBand />
      <Services />
      <TeamPreview />
      <Testimonials />
      <BlogPreview />
    </div>
  );
}