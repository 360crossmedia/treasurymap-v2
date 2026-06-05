"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyAccountCard from "../components/MyAccountCard";

const Layout = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      <MyAccountCard />
      <Footer />
    </>
  );
};

export default Layout;
