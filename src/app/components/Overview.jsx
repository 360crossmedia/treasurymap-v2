import { useEffect, useState } from "react";
import styles from "../styles/Overview.module.css";
import Image from "next/image";
import companyImg from "../assets/companyImg.svg";
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
        <div>
          <p className={styles.title}>Name of Product</p>
          <p className={styles.description}>{company?.productName}</p>
        </div>
        <div>
          <p className={styles.title}>Version number</p>
          <p className={styles.description}>{company?.productVersion}</p>
        </div>
        {questions?.map((question, index) => (
          <div key={index}>
            <p className={styles.title}>{question?.body}</p>
            <p className={styles.description}>{answers?.[index]}</p>
          </div>
        ))}
      </div>
      <div className={styles.right}>
        <Image
          width={337.611}
          height={181.946}
          className={styles.companyImg}
          src={!company ? companyImg : company?.logo}
          alt=""
        />
      </div>
      <div className={styles.countriesContainer}>
        <div>
          <p className={styles.boldP}>Active In</p>
        </div>
        <div className={styles.blueCardsContainer}>
          {countries?.map((country, index) => (
            <div key={index} className={styles.blueCard}>
              <p className={styles.blueCardP}>{country?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
