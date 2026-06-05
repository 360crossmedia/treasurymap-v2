"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PricingPlans from "../components/PricingPlans";

export default function PricingPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      <PricingPlans />
      <Footer />
    </>
  );
}
