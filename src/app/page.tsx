'use client';

import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import LeadPopup from '../components/LeadPopup';
import ChatbotModal from '../components/ChatbotModal';
import Header from '../components/Header';
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Pricing />
        <Testimonials />
        <LeadPopup />
        <ChatbotModal />
      </main>
      <Footer />
    </>
  );
}