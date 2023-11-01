import React, { useState } from "react";
import { CircleFlag } from "react-circle-flags";
import style from "@/styles/languageSelect.module.scss";
import { Flags } from "@/lib/flags/flagConstants";

interface LanguageSelectProps {
  selectedLanguages: string[];
  onLanguagesChange: (newLanguages: string[]) => void;
}

const LanguageSelect = ({
  selectedLanguages,
  onLanguagesChange,
}: LanguageSelectProps) => {
  const handleLanguageToggle = (languageCode: string) => {
    if (selectedLanguages.includes(languageCode)) {
      onLanguagesChange(
        selectedLanguages.filter((code) => code !== languageCode)
      );
    } else {
      onLanguagesChange([...selectedLanguages, languageCode]);
    }
  };

  return (
    <div>
      <div>
        {Flags.map((country) => (
          <label key={country.code}>
            <input
              type="checkbox"
              value={country.code}
              checked={selectedLanguages.includes(country.code)}
              onChange={() => handleLanguageToggle(country.code)}
            />
            {country.name}
          </label>
        ))}
      </div>
      <div>
        <ul className={style.flagWrap}>
          {selectedLanguages.map((languageCode) => (
            <li key={languageCode}>
              <CircleFlag countryCode={languageCode} height="20" />
              <button onClick={() => handleLanguageToggle(languageCode)}>
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
