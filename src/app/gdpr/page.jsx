"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Gdpr from "../components/Gdpr";

export default function GdprPage() {
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <Gdpr />
      <Footer />
    </>
  );
}
