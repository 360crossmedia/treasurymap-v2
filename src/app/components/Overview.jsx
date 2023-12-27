import React from "react";
import styles from "../styles/Overview.module.css";
import Image from "next/image";
import companyImg from "../assets/companyImg.svg";

const Overview = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.left}>
        <div>
          <p className={styles.mainTitle}>About</p>
          <p className={styles.mainDescription}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis. Pharetra aliquam metus arcu molestie ultricies purus.
            Suspendisse risus facilisis sit commodo vitae. Tellus non nibh
            condimentum varius adipiscing quam tincidunt mauris at. Sed netus
            nunc tincidunt malesuada. Sed dictumst sed turpis malesuada praesent
            elementum. Vitae enim sit purus mollis lacinia integer. Donec non
            fringilla at feugiat quam pretium mauris orci ut.
          </p>
        </div>
        <div>
          <p className={styles.title}>Website</p>
          <a className={styles.link} href="https://www2.deloitte.com/">
            https://www2.deloitte.com/
          </a>
        </div>
        <div>
          <p className={styles.title}>Turnover</p>
          <p className={styles.description}>€ 65 billion</p>
        </div>
        <div>
          <p className={styles.title}>Name of Product</p>
          <p className={styles.description}>Product basic</p>
        </div>
        <div>
          <p className={styles.title}>Version number</p>
          <p className={styles.description}>Version 1</p>
        </div>
        <div>
          <p className={styles.title}>
            Do you have specific cooperation agreement with other IT vendors for
            pitching?
          </p>
          <p className={styles.description}>No</p>
        </div>
        <div>
          <p className={styles.title}>
            Bank connectivity (through which types of channel - please specify)
          </p>
          <p className={styles.description}>No</p>
        </div>
        <div>
          <p className={styles.title}>
            Do you have any other specific functionalities?
          </p>
          <p className={styles.description}>No</p>
        </div>
        <div>
          <p className={styles.title}>
            Do you have specific integration with Fintechs? (If YES please
            specify which ones)
          </p>
          <p className={styles.description}>No</p>
        </div>
        <div>
          <p className={styles.title}>
            Do you propose solutions or functionalities based on AI? (If YES
            please specify which ones)
          </p>
          <p className={styles.description}>No</p>
        </div>
        <div>
          <p className={styles.title}>
            Do you propose solutions or functionalities based on AI? (If YES
            please specify which ones)
          </p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis.
          </p>
        </div>
        <div>
          <p className={styles.title}>
            Do you propose solutions or functionalities based on AI? (If YES
            please specify which ones)
          </p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis.
          </p>
        </div>
        <div>
          <p className={styles.title}>
            Do you propose solutions or functionalities based on AI? (If YES
            please specify which ones)
          </p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis.
          </p>
        </div>
        <div>
          <p className={styles.title}>
            Do you propose solutions or functionalities based on AI? (If YES
            please specify which ones)
          </p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Eu in sagittis non urna
            tortor. Malesuada nulla penatibus senectus mauris felis morbi
            aliquam sit. Iaculis a dolor scelerisque volutpat nec varius
            fermentum. Parturient sit quis gravida libero hendrerit aliquet a
            sagittis.
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <Image className={styles.companyImg} src={companyImg} alt="" />
      </div>
    </div>
  );
};

export default Overview;
