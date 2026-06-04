"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginCard from "../components/LoginCard";

export default function LoginPage() {
  return (
    <>
      <Navbar buttonLabel="Sign up" />
      <LoginCard />
      <Footer />
    </>
  );
}
