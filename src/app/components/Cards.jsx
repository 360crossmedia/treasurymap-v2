"use client";
import Image from "next/image";
import styles from "../styles/Insights.module.css";
import { useEffect, useState } from "react";
import { apiGetRandomPublications } from "../service/apiGetRandomPublications";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useRouter } from "next/navigation";
import { formatDate, truncateHtmlString } from "../utils";

const Cards = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [randomPublications, setRandomPublications] = useState();

  useEffect(() => {
    getRandomPublications();
  }, []);

  const getRandomPublications = async () => {
    dispatch(setIsLoading(true));
    const randomPublications = await apiGetRandomPublications();
    setRandomPublications(randomPublications);
    dispatch(setIsLoading(false));
  };

  if (randomPublications?.[0]?.coverImage)
    return (
      <div className={styles.randomPublicationsContainer}>
        <div className={styles.card}>
          <div>
            <Image
              onClick={() =>
                router.push(`/publication/video/${randomPublications?.[0]?.id}`)
              }
              src={randomPublications?.[0]?.coverImage}
              alt=""
              width="300"
              height="300"
              className={styles.cardImage}
            />
          </div>
          <div>
            <h4
              onClick={() =>
                router.push(`/publication/video/${randomPublications?.[0]?.id}`)
              }
              className={styles.mainTitle}
            >
              {randomPublications?.[0]?.title}
            </h4>
            <p className={styles.articleDate}>
              {`${formatDate(randomPublications?.[0]?.createdAt)} | ${
                randomPublications?.[0]?.url ? "Video" : "Article"
              }`}
            </p>
          </div>
        </div>
        <div className={styles.twoCardsContainer}>
          <div className={styles.twoCards}>
            <div className={styles.miniCard}>
              <div
                className={styles.miniCardImageContainer}
                style={{
                  backgroundImage: `url(${randomPublications?.[1]?.coverImage})`,
                }}
                onClick={() =>
                  router.push(
                    `/publication/video/${randomPublications?.[1]?.id}`
                  )
                }
              ></div>
              <div>
                <h6
                  onClick={() =>
                    router.push(
                      `/publication/video/${randomPublications?.[1]?.id}`
                    )
                  }
                  className={`${styles.mainTitle} ${styles.bold}`}
                >
                  {randomPublications?.[1]?.title}
                </h6>
                <p className={styles.articleDate}>
                  {`${formatDate(randomPublications?.[1]?.createdAt)} | ${
                    randomPublications?.[1]?.url ? "Video" : "Article"
                  }`}
                </p>
              </div>
            </div>
            <div className={styles.miniCard}>
              <div
                className={styles.miniCardImageContainer}
                style={{
                  backgroundImage: `url(${randomPublications?.[2]?.coverImage})`,
                }}
                onClick={() =>
                  router.push(
                    `/publication/article/${randomPublications?.[2]?.id}`
                  )
                }
              ></div>
              <div>
                <h6
                  onClick={() =>
                    router.push(
                      `/publication/article/${randomPublications?.[2]?.id}`
                    )
                  }
                  className={`${styles.mainTitle} ${styles.bold}`}
                >
                  {randomPublications?.[2]?.title}
                </h6>
                <p className={styles.articleDate}>
                  {`${formatDate(randomPublications?.[2]?.createdAt)} | ${
                    randomPublications?.[2]?.url ? "Video" : "Article"
                  }`}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.line2}></div>
        </div>
        <div className={styles.card}>
          <p className={styles.topReadText}>Other publications</p>
          <div
            className={styles.cardImageContainer}
            style={{
              backgroundImage: `url(${randomPublications?.[3]?.coverImage})`,
            }}
            onClick={() =>
              router.push(`/publication/article/${randomPublications?.[3]?.id}`)
            }
          ></div>
          <div>
            <h4
              onClick={() =>
                router.push(
                  `/publication/article/${randomPublications?.[3]?.id}`
                )
              }
              className={styles.mainTitle}
            >
              {randomPublications?.[3]?.title}
            </h4>
            <p className={styles.secondaryArticleBody}>
              {truncateHtmlString(randomPublications?.[3]?.body, 300)}
            </p>
          </div>
        </div>
      </div>
    );
};

export default Cards;
