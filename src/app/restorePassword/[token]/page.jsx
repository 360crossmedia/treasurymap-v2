"use client";
import { use } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RestorePasswordCard from "../../components/RestorePasswordCard";

export default function RestorePasswordTokenPage({ params }) {
  const { token } = use(params);
  return (
    <>
      <Navbar buttonLabel="Sign up" />
      <RestorePasswordCard token={token} />
      <Footer />
    </>
  );
}
