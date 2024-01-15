"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import LinkUpdateLoginCard from "@/app/components/LinkUpdateLoginCard";

const Layout = ({ params }) => {
  
  const converted = params.emailkey.replace("ndFRgdTJJbVFR", "");

  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Sign up"} />
      <LinkUpdateLoginCard emailkey={converted}/>
      <Footer />
    </div>
  );
};

export default Layout;
