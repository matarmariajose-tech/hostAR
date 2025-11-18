import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import './globals.css';
import Cursor from "../components/Cursor";
import ChatbotModal from "../components/ChatbotModal";
import LeadPopup from "../components/LeadPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HostAR | Gestión Inteligente de Alquileres en Argentina",
  description: "Gestión inteligente de alquileres temporarios en Argentina con tecnología de punta y máxima rentabilidad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <LeadPopup />
        <ChatbotModal />
        <Cursor />
      </body>
    </html>
  );
}
