"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignupCard from "../components/SignupCard";

export default function SignupPage() {
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <SignupCard />
      <Footer />
    </>
  );
}
