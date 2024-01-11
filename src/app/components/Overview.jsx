import { useEffect, useState } from "react";
import styles from "../styles/Overview.module.css";
import Image from "next/image";
import companyImg from "../assets/placeholderimg.jpg";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetAllQuestions } from "../service/apiGetAllQuestions";
import { apiGetCompanyAnswers } from "../service/apiGetCompanyAnswers";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";

const Overview = ({ companyId }) => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState();
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState();
  const [countries, setCountries] = useState();
  const [seeMoreActive, setSeeMoreActive] = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const result = await apiGetCompanyData(companyId);
    const questions = await apiGetAllQuestions();
    const answers = await apiGetCompanyAnswers(companyId);
    const companyOffices = [];

    setCompany(result);
    setQuestions(questions.data);
    setAnswers(answers);

    for (let i = 0; i < result?.companyOffices.length; i++) {
      const countries = await apiGetCountryById(result?.companyOffices[i]);
      companyOffices.push(countries);
    }

    setCountries(companyOffices);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.left}>
        <div>
          <p className={styles.mainTitle}>About</p>
          <p className={styles.mainDescription}>{company?.description}</p>
        </div>
        <div>
          <p className={styles.title}>Website</p>
          <a className={styles.link} href={company?.companyWebsite}>
            {company?.companyWebsite}
          </a>
        </div>
        <div>
          <p className={styles.title}>Turnover</p>
          <p className={styles.description}>{company?.turnover}</p>
        </div>
        {company?.productName && (
          <div>
            <p className={styles.title}>Name of Product</p>
            <p className={styles.description}>{company?.productName}</p>
          </div>
        )}
        {company?.productVersion && (
          <div>
            <p className={styles.title}>Version number</p>
            <p className={styles.description}>{company?.productVersion}</p>
          </div>
        )}
        {answers?.map((answer, index) => (
          <div key={index}>
            <p className={styles.title}>{questions?.[index]?.body}</p>
            <p className={styles.description}>{answer}</p>
          </div>
        ))}
      </div>
      <div className={styles.right}>
        <Image
          // width={337.611}
          // height={181.946}
          // className={styles.companyImg}
          src={!company?.logo ? companyImg : company?.logo}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '80%', height: 'auto', maxHeight: "95%" }} // optional
        />
      </div>
      <div className={styles.countriesContainer}>
        <div>
          <p className={styles.boldP}>Active In</p>
        </div>
        <div className={styles.blueCardsContainer}>
          {seeMoreActive &&
            countries?.map((country, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{country?.name}</p>
              </div>
            ))}
          {!seeMoreActive &&
            countries?.slice(0, 4).map((country, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{country?.name}</p>
              </div>
            ))}
        </div>
        {countries?.length > 4 && (
          <p
            onClick={() => setSeeMoreActive(!seeMoreActive)}
            className={styles.seeMoreBlueCards}
          >
            {!seeMoreActive ? "See more" : "See less"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Overview;
