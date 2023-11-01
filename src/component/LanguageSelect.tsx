import React, { useState } from "react";
import { CircleFlag } from "react-circle-flags";
import style from "@/styles/languageSelect.module.scss";
import { Flags } from "@/lib/flags/flagConstants";

const LanguageSelect = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(countryCode)) {
        // Deselect the country
        return prevSelected.filter((code) => code !== countryCode);
      } else {
        // Select the country
        return [...prevSelected, countryCode];
      }
    });
  };

  return (
    <div>
      <div>
        {Flags.map((country) => (
          <label key={country.code}>
            <input
              type="checkbox"
              value={country.code}
              checked={selectedCountries.includes(country.code)}
              onChange={() => handleCountryToggle(country.code)}
            />
            {country.name}
          </label>
        ))}
      </div>
      <div>
        <ul className={style.flagWrap}>
          {selectedCountries.map((countryCode) => (
            <li key={countryCode}>
              <CircleFlag countryCode={countryCode} height="20" />
              <button onClick={() => handleCountryToggle(countryCode)}>
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelect;
