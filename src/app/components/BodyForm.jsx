"use client";
import Image from "next/image";
import styles from "../styles/BodyForm.module.css";
import PhotoImg from "../assets/photoImg.svg";
import Form from "react-bootstrap/Form";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";

const BodyForm = () => {
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("Upload logo");
  return (
    <div className={styles.mainContainer}>
      <div className={styles.uploadPhotoContainer}>
        <div className={styles.card}>
          <input
            className={styles.inputFile}
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                  const imageDataUrl = readerEvent.target.result;
                  setImage(imageDataUrl);
                };
                reader.readAsDataURL(file);
                setFileName(
                  file.name.substring(0, 10) +
                    (file.name.length > 10 ? "..." : "")
                );
              }
            }}
          />
          <Image
            width={50}
            height={50}
            src={!image ? PhotoImg : image}
            alt=""
          />
          <p>{fileName}</p>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Name of the company <span className={styles.span}>*</span>
          </label>
          <input
            className={styles.inputText}
            placeholder="Company LLC"
            type="text"
          />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="description">
            Description <span className={styles.span}>*</span>
          </label>
          <textarea
            className={styles.inputText}
            placeholder="Enter your Overview"
            name="description"
            id="description"
            rows="6"
          ></textarea>
        </div>

        <div className={styles.doubleInputsContainer}>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Creation date (year) <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter registration code"
              type="text"
            />
          </div>

          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Turnover (last year) <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Price"
              type="text"
            />
          </div>
        </div>

        <div className={styles.doubleInputsContainer}>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Number of employees <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter registration code"
              type="text"
            />
          </div>

          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Headquarters location <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Price"
              type="text"
            />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Active in <span className={styles.span}>*</span>
          </label>
          <Form.Select
            bsPrefix={`form-select ${styles.inputText} ${styles.inputSelect}`}
          >
            <option>Select type of media</option>
            <option value="1">Media 1</option>
            <option value="2">Media 2</option>
            <option value="3">Media 3</option>
          </Form.Select>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Company website: <span className={styles.span}>*</span>
          </label>
          <input className={styles.inputText} placeholder="URL" type="text" />
        </div>

        <div className={styles.doubleInputsContainer}>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Name of Product
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter registration code"
              type="text"
            />
          </div>

          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Version Number
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Price"
              type="text"
            />
          </div>
        </div>

        <div className="line"></div>

        <div>
          <div>
            <p className={styles.label}>
              Categories <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.categoriesContainer}>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="FIDP">
                FIDP (Financial Instrument Dealing Platform)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="FIDP2">
                FIDP (Financial Instrument Dealing Platform)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CMA">
                CMA (Currency Management Automation)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CMA2">
                CMA (Currency Management Automation)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="OTS">
                OTS (Other Treasury Solutions)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="OTS2">
                OTS (Other Treasury Solutions)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ERP">
                ERP (Enterprise Resource Planning)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ERP2">
                ERP (Enterprise Resource Planning)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ETL">
                ETL (Extract Transform Load)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ETL2">
                ETL (Extract Transform Load)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CFF">
                CFF (Cash-Flow Forecasting)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CFF2">
                CFF (Cash-Flow Forecasting)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="BSG">
                BSG (Bank Single Gateway)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="BSG2">
                BSG (Bank Single Gateway)
              </label>
            </div>
          </div>
        </div>
        <div>
          <div>
            <p className={styles.label}>
              Sub-Categories <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.categoriesContainer}>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="FIDP">
                FIDP (Financial Instrument Dealing Platform)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="FIDP2">
                FIDP (Financial Instrument Dealing Platform)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CMA">
                CMA (Currency Management Automation)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CMA2">
                CMA (Currency Management Automation)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="OTS">
                OTS (Other Treasury Solutions)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="OTS2">
                OTS (Other Treasury Solutions)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ERP">
                ERP (Enterprise Resource Planning)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ERP2">
                ERP (Enterprise Resource Planning)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ETL">
                ETL (Extract Transform Load)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ETL2">
                ETL (Extract Transform Load)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CFF">
                CFF (Cash-Flow Forecasting)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CFF2">
                CFF (Cash-Flow Forecasting)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="BSG">
                BSG (Bank Single Gateway)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="BSG2">
                BSG (Bank Single Gateway)
              </label>
            </div>
          </div>
          <div className={styles.categoriesContainer}>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="FIDP">
                FIDP (Financial Instrument Dealing Platform)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="FIDP2">
                FIDP (Financial Instrument Dealing Platform)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CMA">
                CMA (Currency Management Automation)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CMA2">
                CMA (Currency Management Automation)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="OTS">
                OTS (Other Treasury Solutions)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="OTS2">
                OTS (Other Treasury Solutions)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ERP">
                ERP (Enterprise Resource Planning)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ERP2">
                ERP (Enterprise Resource Planning)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ETL">
                ETL (Extract Transform Load)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="ETL2">
                ETL (Extract Transform Load)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CFF">
                CFF (Cash-Flow Forecasting)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="CFF2">
                CFF (Cash-Flow Forecasting)
              </label>
            </div>

            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="BSG">
                BSG (Bank Single Gateway)
              </label>
            </div>
            <div className={styles.inputCheckboxContainer}>
              <Checkbox></Checkbox>
              <label className={styles.labelCheckbox} for="BSG2">
                BSG (Bank Single Gateway)
              </label>
            </div>
          </div>
        </div>

        <div className="line"></div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you have any specific cooperation agreement with other IT vendors
            for pitching?
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Bank connectivity (through which types of channel - please specify)
            :
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you have any other specific functionalities:
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you have specific integration with Fintechs? (If YES please
            specify which ones):
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you propose solutions or functionalities based on AI? (if YES
            please specify):
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.button}>Save information</button>
        </div>
      </div>
    </div>
  );
};

export default BodyForm;
