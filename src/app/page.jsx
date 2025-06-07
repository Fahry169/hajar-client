"use client";

import Footer from "@/components/Footer";
import CaraKerja from "@/components/LandingPage/CaraKerja";
import Hajar from "@/components/LandingPage/Hajar";
import Hero from "@/components/LandingPage/Hero";
import NavbarComponent from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <NavbarComponent/>

      <Hero />

      <CaraKerja />

      <Hajar  />

      <Footer />
    </div>
  );
}
