
import ReactCountryFlag from "react-country-flag";

import { countryCodes } from "../../data/countryCodes.js";

import "./CountryFlag.css";

/*
==========================================================
REGION ICONS
==========================================================
These are regions, not countries.
*/
const regionIcons = {
  Africa: "🌍",
  Europe: "🌍",
  World: "🌎",
  International: "🌐",
};

/*
==========================================================
COUNTRY ALIASES
==========================================================
The betting feed may use different names for the same
country.

Example:

USA
United States
United States of America

all represent:

UnitedStates
*/
const countryAliases = {
  USA: "UnitedStates",
  US: "UnitedStates",
  UnitedStates: "UnitedStates",
  UnitedStatesofAmerica: "UnitedStates",

  UK: "UnitedKingdom",
  GreatBritain: "UnitedKingdom",
};

/*
==========================================================
NORMALIZE COUNTRY NAME
==========================================================
Removes spaces, hyphens and apostrophes.

Examples:

"South Africa"
      ↓
"SouthAfrica"

"South-Africa"
      ↓
"SouthAfrica"

"United States"
      ↓
"UnitedStates"
*/
const normalizeCountryName = (country) => {
  if (!country) return "";

  return String(country)
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/'/g, "");
};

/*
==========================================================
COUNTRY FLAG COMPONENT
==========================================================
*/
const CountryFlag = ({ country }) => {
  if (!country) {
    return null;
  }

  const rawCountry = String(country).trim();

  /*
  --------------------------------------------------------
  CHECK REGION FIRST
  --------------------------------------------------------
  */
  if (regionIcons[rawCountry]) {
    return (
      <span
        className="region-icon"
        aria-label={rawCountry}
        title={rawCountry}
      >
        {regionIcons[rawCountry]}
      </span>
    );
  }

  /*
  --------------------------------------------------------
  NORMALIZE COUNTRY
  --------------------------------------------------------
  */
  const normalizedCountry = normalizeCountryName(rawCountry);

  /*
  --------------------------------------------------------
  APPLY COUNTRY ALIAS
  --------------------------------------------------------
  USA → UnitedStates
  */
  const countryKey =
    countryAliases[normalizedCountry] || normalizedCountry;

  /*
  --------------------------------------------------------
  FIND COUNTRY CODE
  --------------------------------------------------------
  */
  const countryCode = countryCodes[countryKey];

  /*
  --------------------------------------------------------
  UNKNOWN COUNTRY
  --------------------------------------------------------
  */
  if (!countryCode) {
    return null;
  }

  /*
  --------------------------------------------------------
  RENDER FLAG
  --------------------------------------------------------
  */
  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      aria-label={`${rawCountry} flag`}
      title={rawCountry}
      className="country-flag"
    />
  );
};

export default CountryFlag;

