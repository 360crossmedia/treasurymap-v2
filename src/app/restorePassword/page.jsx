"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestorePasswordCard from "../components/RestorePasswordCard";

export default function RestorePasswordPage() {
  return (
    <>
      <Navbar buttonLabel="Sign up" />
      <RestorePasswordCard />
      <Footer />
    </>
  );
}
