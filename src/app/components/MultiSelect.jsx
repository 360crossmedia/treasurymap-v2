import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import styles from "../styles/BodyForm.module.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

const MultiSelect = ({ options, value, set }) => {
  const selectedCountries = options.filter((country) =>
    value?.includes(country.id)
  );
  return (
    <Typeahead
      labelKey={(option) => `${option.name}`}
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
      selected={selectedCountries}
    />
  );
};

export default MultiSelect;
