"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeaderArticle from "../../components/HeaderArticle";
import dynamic from "next/dynamic";

const Layout = () => {
  const BodyArticle = dynamic(() => import("../../components/BodyArticle"), {
    ssr: false,
  });
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
        <HeaderArticle title={"Video"} />
        <BodyArticle />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
