import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "./sw-register";
import ClientAdminProvider from "@/components/ClientAdminProvider";
import PoultryAssistantBot from "@/components/chat/PoultryAssistantBot";
import AppNotifications from "@/components/AppNotifications";

export const metadata: Metadata = {
  title: "CUCU MUTUGI POULTRY | Growing Farmers, Building Prosperity",
  description: "Your Trusted Partner in Poultry Farming. Pre-vaccinated Kienyeji, Broilers & Layers with free countrywide delivery across Kenya.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cucu Mutugi Poultry",
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#1A6B2A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cucu Mutugi Poultry" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientAdminProvider>
          <ServiceWorkerRegister />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <PoultryAssistantBot />
          <AppNotifications />
          <Footer />
        </ClientAdminProvider>
      </body>
    </html>
  );
}
