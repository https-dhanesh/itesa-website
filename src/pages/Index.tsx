import { Helmet } from 'react-helmet-async'; // --- 1. Import Helmet ---
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventsPreview from "@/components/EventsPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ITESA - DYPCOE</title>
        <meta 
          name="description" 
          content="Welcome to the official website of ITESA, the premier technology and innovation student association at DYPCOE, Pune. Find our latest events, meet the team, and get involved." 
        />
        <meta property="og:title" content="ITESA - Official Tech Club of DYPCOE" />
        <meta property="og:description" content="Find our latest events, meet the team, and get involved with the premier tech club at DYPCOE." />
        <meta property="og:image" content="https://bhephgetoquqyffcbxgt.supabase.co/storage/v1/object/public/images/logo.webp" />
        <meta property="og:url" content="https://www.yourdomain.com/" /> 
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <EventsPreview />
        <Footer />
      </div>
    </>
  );
};

export default Index;