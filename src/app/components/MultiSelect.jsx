import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import styles from "../styles/BodyForm.module.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

const MultiSelect = ({ options, value, set }) => {
  return (
    <Typeahead
      id="MultiSelect"
      multiple
      className={styles.multiSelect}
      onChange={(selected) => {
        const countriesSelected = [];
        selected.map((country) => {
          countriesSelected.push(country.id);
        });
        set(countriesSelected);
      }}
      options={options}
      value={value}
    />
  );
};

export default MultiSelect;
