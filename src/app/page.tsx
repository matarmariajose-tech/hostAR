"use client";

import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import LeadPopup from "../components/LeadPopup";
import ChatbotModal from "../components/ChatbotModal";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <Pricing />
      <Testimonials />
      <LeadPopup />
      <ChatbotModal />
    </main>
  );
}