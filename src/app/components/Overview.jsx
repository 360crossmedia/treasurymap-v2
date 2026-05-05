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
import { formatTurnover } from "../utils";
import { sanitizeRich } from "../utils/sanitize";
import { cld } from "../utils/cloudinary";

const Overview = ({ companyId, initialCompany }) => {
  const dispatch = useDispatch();
  const [company, setCompany] = useState(initialCompany ?? undefined);
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState();
  const [countries, setCountries] = useState();
  const [seeMoreActive, setSeeMoreActive] = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const [result, questions, answers] = await Promise.all([
      initialCompany
        ? Promise.resolve(initialCompany)
        : apiGetCompanyData(companyId),
      apiGetAllQuestions(),
      apiGetCompanyAnswers(companyId),
    ]);

    setCompany(result);
    setQuestions(questions?.data);
    setAnswers(answers);

    const companyOffices = await Promise.all(
      (result?.companyOffices ?? []).map((id) => apiGetCountryById(id))
    );

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
          <div
            className={styles.mainDescription}
            dangerouslySetInnerHTML={{
              __html: sanitizeRich(company?.description),
            }}
          />
        </div>
        <div>
          <p className={styles.title}>Website</p>
          <a
            className={styles.link}
            target="_blank"
            href={company?.companyWebsite}
          >
            {company?.companyWebsite}
          </a>
        </div>
        {company?.showTurnover && (
          <div>
            <p className={styles.title}>Turnover</p>
            <p className={styles.description}>
              {formatTurnover(company?.turnover)}
            </p>
          </div>
        )}
        {company?.productName && (
          <div>
            <p className={styles.title}>Name of Product</p>
            <p className={styles.description}>{company?.productName}</p>
          </div>
        )}
        {company?.productVersion && (
          <div>
            <p className={styles.title}>Product description</p>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: sanitizeRich(company?.productVersion),
              }}
            />
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
          src={!company?.logo ? companyImg : cld(company?.logo, { w: 600 })}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "80%", height: "auto", maxHeight: "95%" }} // optional
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
