import ReactCountryFlag from "react-country-flag";

import { countryCodes } from "../../data/countryCodes.js";

import "./CountryFlag.css";

const regionIcons = {
  Africa: "UN",
  Europe: "🌍",
  World: "🌎",
  International: "🌐",
};

const normalizeCountryName = (country) => {
  if (!country) return "";

  return country
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/'/g, "");
};

const CountryFlag = ({ country }) => {
  if (!country) {
    return null;
  }

  if (regionIcons[country]) {
    return (
      <span
        className="region-icon"
        aria-label={country}
        title={country}
      >
        {regionIcons[country]}
      </span>
    );
  }

  const normalizedCountry = normalizeCountryName(country);

  const countryCode = countryCodes[normalizedCountry];

  if (!countryCode) {
    return null;
  }

  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      aria-label={`${country} flag`}
      title={country}
      className="country-flag"
    />
  );
};

export default CountryFlag;