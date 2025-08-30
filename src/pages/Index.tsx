import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventsPreview from "@/components/EventsPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <EventsPreview />
      <Footer />
    </div>
  );
};

export default Index;
