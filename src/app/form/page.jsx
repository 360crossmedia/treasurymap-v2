"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeaderArticle from "../components/HeaderArticle";
import BodyForm from "../components/BodyForm";

const Layout = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      <div
        style={{
          background:
            "radial-gradient(ellipse 100% 45% at 50% 0%, #eef4ff 0%, #eef2f9 55%)",
          minHeight: "70vh",
        }}
      >
        <HeaderArticle title={false} />
        <BodyForm />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
