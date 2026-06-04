"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MultiplayerMap from "../components/multiplayerMap/MultiplayerMap";

export default function MultiplayerMapPage() {
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <MultiplayerMap />
      <Footer />
    </>
  );
}
