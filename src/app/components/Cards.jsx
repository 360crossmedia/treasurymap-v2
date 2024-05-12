"use client";
import styles from "../styles/Insights.module.css";
import { useEffect, useState } from "react";
import { apiGetRandomPublications } from "../service/apiGetRandomPublications";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import SinglePublicationAside from "./SinglePublicationAside";
import DoublePublicationAside from "./DoublePublicationAside";

const Cards = () => {
  const dispatch = useDispatch();
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
        <SinglePublicationAside publication={randomPublications?.[0]} />
        {randomPublications.length > 1 && (
          <div className={styles.twoCardsContainer}>
            <DoublePublicationAside
              publications={[randomPublications?.[1], randomPublications?.[2]]}
            />
            {randomPublications?.[3] && <div className={styles.line2}></div>}
          </div>
        )}
        {randomPublications?.[3] && (
          <SinglePublicationAside publication={randomPublications?.[3]} />
        )}
        {randomPublications.length > 4 && (
          <div className={styles.twoCardsContainer}>
            <DoublePublicationAside
              publications={[randomPublications?.[4], randomPublications?.[5]]}
            />
            {randomPublications?.[6] && <div className={styles.line2}></div>}
          </div>
        )}
        {randomPublications?.[6] && (
          <SinglePublicationAside publication={randomPublications?.[6]} />
        )}
        {randomPublications.length > 7 && (
          <div className={styles.twoCardsContainer}>
            <DoublePublicationAside
              publications={[randomPublications?.[7], randomPublications?.[8]]}
            />
            {randomPublications?.[9] && <div className={styles.line2}></div>}
          </div>
        )}
        {randomPublications?.[9] && (
          <SinglePublicationAside publication={randomPublications?.[9]} />
        )}
        {randomPublications.length > 10 && (
          <div className={styles.twoCardsContainer}>
            <DoublePublicationAside
              publications={[
                randomPublications?.[10],
                randomPublications?.[11],
              ]}
            />
            {randomPublications?.[12] && <div className={styles.line2}></div>}
          </div>
        )}

        {randomPublications?.[12] && (
          <SinglePublicationAside publication={randomPublications?.[12]} />
        )}
      </div>
    );
};

export default Cards;
