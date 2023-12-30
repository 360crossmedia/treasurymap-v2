"use client";
import styles from "../styles/MediaZone.module.css";
import Image from "next/image";
import ArrowRight from "../assets/arrow-right.svg";

const MediaZone = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.countriesContainer}>
        <div>
          <p className={styles.boldP}>Active In</p>
        </div>
        <div className={styles.blueCardsContainer}>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>France</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Belgium</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Spain</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Morocco</p>
          </div>
        </div>
      </div>
      <div className={styles.videoContainer}>
        <div>
          <p className={styles.title}>Our CEO Conference</p>
          <iframe
            className={styles.video}
            src="https://www.youtube.com/embed/1ehoTCEwnBY"
            title="Deloitte. The One Firm. For You."
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div className={styles.line}></div>
      </div>
      <div className="article">
        <div className={styles.articleContainer}>
          <p className={styles.articleTitle}>Article: Next year projection </p>
          <p className={styles.articleDescription}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis
          </p>
          <a className={styles.articleA} href="#">
            Read More
            <Image src={ArrowRight} alt="" />
          </a>
        </div>
        <div className={styles.line}></div>
      </div>
      <div className="article">
        <div className={styles.articleContainer}>
          <p className={styles.articleTitle}>Article: Next year projection </p>
          <p className={styles.articleDescription}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis
          </p>
          <a className={styles.articleA} href="#">
            Read More
            <Image src={ArrowRight} alt="" />
          </a>
        </div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
};

export default MediaZone;
