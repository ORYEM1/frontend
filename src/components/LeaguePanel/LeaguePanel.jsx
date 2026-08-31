
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaChevronDown,
  FaChevronRight,
  FaFire,
} from "react-icons/fa";

import { useSports } from "../../contexts/SportsContext.jsx";
import { feedData } from "../../data/feedData.js";

import CountryFlag from "../CountryFlag/CountryFlag.jsx";

import "./LeaguePanel.css";


/* ============================================================
   POPULAR LEAGUES
============================================================ */

/*
  These names must match the league names
  coming from feedData.

  They are only used to decide which leagues
  appear in the Popular Leagues section.
*/

const popularLeagues = [
  "England - Premier League",
  "Spain - La Liga",
  "Italy - Serie A",
  "Germany - Bundesliga",
  "France - Ligue 1",
  "Portugal - Primeira Liga",
  "Netherlands - Eredivisie",
  "Belgium - Jupiler Pro League",
];


/* ============================================================
   POPULAR COUNTRIES
============================================================ */

const popularCountries = [
  "England",
  "Spain",
  "Italy",
  "Germany",
  "France",
  "Portugal",
  "Netherlands",
  "Belgium",
];


/* ============================================================
   NORMALIZE TEXT
============================================================ */

const normalizeText = (value) => {

  return String(value || "")
    .trim()
    .toLowerCase();

};


/* ============================================================
   LEAGUE PANEL
============================================================ */

const LeaguePanel = () => {

  /* ==========================================================
     SPORTS CONTEXT
  ========================================================== */

  const {
    activeSport,
    selectedLeague,
    selectLeague,
  } = useSports();


  /* ==========================================================
     COLLAPSED REGIONS
  ========================================================== */

  const [
    collapsedRegions,
    setCollapsedRegions,
  ] = useState({});


  /* ==========================================================
     GROUP LEAGUES BY REGION
  ========================================================== */

  const leaguesByRegion = useMemo(() => {

    const grouped = {};


    Object.entries(feedData || {}).forEach(
      ([leagueName, leagueEvents]) => {

        /* ====================================================
           GET EVENTS FOR ACTIVE SPORT
        ==================================================== */

        const sportEvents =
          Object.values(
            leagueEvents || {}
          ).filter((event) => {

            if (!event) {
              return false;
            }

            return (
              normalizeText(event.sport) ===
              normalizeText(activeSport)
            );

          });


        /* ====================================================
           IGNORE EMPTY LEAGUES
        ==================================================== */

        if (
          sportEvents.length === 0
        ) {
          return;
        }


        /* ====================================================
           GET REGION
        ==================================================== */

        const firstEvent =
          sportEvents[0];


        const region =
          String(
            firstEvent?.region ||
            "Other"
          ).trim();


        /* ====================================================
           CREATE DISPLAY NAME
        ==================================================== */

        let displayName =
          String(leagueName).trim();


        const regionPrefix =
          `${region} - `;


        if (
          normalizeText(displayName)
            .startsWith(
              normalizeText(
                regionPrefix
              )
            )
        ) {

          displayName =
            displayName
              .substring(
                regionPrefix.length
              )
              .trim();

        }


        /* ====================================================
           CREATE REGION
        ==================================================== */

        if (
          !grouped[region]
        ) {

          grouped[region] = {

            region,

            leagues: [],

            eventCount: 0,

          };

        }


        /* ====================================================
           ADD LEAGUE
        ==================================================== */

        grouped[region]
          .leagues
          .push({

            name: leagueName,

            displayName,

            region,

            events:
              sportEvents.length,

          });


        /* ====================================================
           REGION EVENT COUNT
        ==================================================== */

        grouped[region]
          .eventCount +=
          sportEvents.length;

      }
    );


    /* ========================================================
       SORT REGIONS AND LEAGUES
    ======================================================== */

    const sortedRegions = {};


    Object.keys(grouped)
      .sort((a, b) =>
        a.localeCompare(b)
      )
      .forEach((region) => {

        grouped[region]
          .leagues
          .sort((a, b) =>
            a.displayName.localeCompare(
              b.displayName
            )
          );


        sortedRegions[region] =
          grouped[region];

      });


    return sortedRegions;

  }, [activeSport]);


  /* ==========================================================
     CREATE DISPLAY GROUPS
  ========================================================== */

  const groupedSections = useMemo(() => {

    const popularLeagueList = [];

    const popularCountryGroups = {};

    const otherCountryGroups = {};


    /* ========================================================
       LOOP THROUGH REGIONS
    ======================================================== */

    Object.entries(
      leaguesByRegion
    ).forEach(
      ([region, regionData]) => {


        /* ====================================================
           CHECK POPULAR COUNTRY
        ==================================================== */

        const isPopularCountry =
          popularCountries.some(
            (country) =>
              normalizeText(country) ===
              normalizeText(region)
          );


        /* ====================================================
           SEPARATE POPULAR LEAGUES
        ==================================================== */

        const popularLeaguesInRegion =
          regionData.leagues.filter(
            (league) => {

              return popularLeagues.some(
                (popularLeague) => {

                  const popular =
                    normalizeText(
                      popularLeague
                    );

                  const name =
                    normalizeText(
                      league.name
                    );

                  const display =
                    normalizeText(
                      league.displayName
                    );


                  return (
                    popular === name ||
                    popular === display
                  );

                }
              );

            }
          );


        /* ====================================================
           ADD POPULAR LEAGUES TO FLAT LIST
        ==================================================== */

        popularLeaguesInRegion.forEach(
          (league) => {

            popularLeagueList.push(
              league
            );

          }
        );


        /* ====================================================
           REMOVE POPULAR LEAGUES
           FROM COUNTRY GROUPS
        ==================================================== */

        const remainingLeagues =
          regionData.leagues.filter(
            (league) => {

              return !popularLeagues.some(
                (popularLeague) => {

                  const popular =
                    normalizeText(
                      popularLeague
                    );

                  const name =
                    normalizeText(
                      league.name
                    );

                  const display =
                    normalizeText(
                      league.displayName
                    );


                  return (
                    popular === name ||
                    popular === display
                  );

                }
              );

            }
          );


        /* ====================================================
           POPULAR COUNTRIES
        ==================================================== */

        if (
          isPopularCountry &&
          remainingLeagues.length > 0
        ) {

          popularCountryGroups[
            region
          ] = {

            ...regionData,

            leagues:
              remainingLeagues,

            eventCount:
              remainingLeagues.reduce(
                (
                  total,
                  league
                ) =>
                  total +
                  league.events,
                0
              ),

          };

        }


        /* ====================================================
           OTHER COUNTRIES
        ==================================================== */

        if (
          !isPopularCountry
        ) {

          otherCountryGroups[
            region
          ] = regionData;

        }

      }
    );


    /* ========================================================
       SORT POPULAR LEAGUES
       ALPHABETICALLY
    ======================================================== */

    popularLeagueList.sort(
      (a, b) =>
        a.displayName.localeCompare(
          b.displayName
        )
    );


    return {

      popularLeagues:
        popularLeagueList,

      popularCountries:
        popularCountryGroups,

      otherCountries:
        otherCountryGroups,

    };

  }, [leaguesByRegion]);


  /* ==========================================================
     RESET COLLAPSED REGIONS
  ========================================================== */

  useEffect(() => {

    const collapsed = {};


    Object.keys(
      leaguesByRegion
    ).forEach(
      (region) => {

        collapsed[region] = true;

      }
    );


    setCollapsedRegions(
      collapsed
    );

  }, [leaguesByRegion]);


  /* ==========================================================
     TOGGLE REGION
  ========================================================== */

  const toggleRegion = (
    region
  ) => {

    setCollapsedRegions(
      (current) => ({

        ...current,

        [region]:
          !current[region],

      })
    );

  };


  /* ==========================================================
     RENDER COUNTRY REGIONS
  ========================================================== */

  const renderRegions = (
    regions
  ) => {

    return Object.entries(
      regions
    ).map(
      ([region, regionData]) => {

        const isCollapsed =
          collapsedRegions[
            region
          ] ?? true;


        return (

          <div
            key={region}
            className="league-region-group"
          >

            {/* ================================================
                COUNTRY HEADER
            ================================================ */}

            <button
              type="button"
              className="league-region-header"
              onClick={() =>
                toggleRegion(
                  region
                )
              }
              aria-expanded={
                !isCollapsed
              }
            >

              <span className="region-info">

                <CountryFlag
                  country={region}
                />

                <span className="region-name">
                  {region}
                </span>

              </span>


              <span className="region-event-count">
                {regionData.eventCount}
              </span>


              <span className="region-arrow">

                {isCollapsed ? (
                  <FaChevronRight />
                ) : (
                  <FaChevronDown />
                )}

              </span>

            </button>


            {/* ==============================================
                COUNTRY LEAGUES
            ============================================== */}

            {!isCollapsed && (

              <div className="region-leagues">

                {regionData.leagues.map(
                  (league) => (

                    <button
                      key={
                        league.name
                      }
                      type="button"
                      className={`
                        league-item
                        ${
                          selectedLeague?.name ===
                          league.name
                            ? "active"
                            : ""
                        }
                      `}
                      onClick={() =>
                        selectLeague(
                          league
                        )
                      }
                    >

                      <span className="league-name">

                        {
                          league.displayName
                        }

                      </span>


                      <span className="league-event-count">

                        {
                          league.events
                        }

                      </span>

                    </button>

                  )
                )}

              </div>

            )}

          </div>

        );

      }
    );

  };


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <aside className="league-panel">

      <div className="league-list">


        {/* ====================================================
            ALL LEAGUES
        ==================================================== */}

        <button
          type="button"
          className={`
            league-item
            ${
              !selectedLeague
                ? "active"
                : ""
            }
          `}
          onClick={() =>
            selectLeague(null)
          }
        >

          <span className="league-name">
            All Leagues
          </span>

        </button>


        {/* ====================================================
            POPULAR LEAGUES
        ==================================================== */}

        {groupedSections
          .popularLeagues
          .length > 0 && (

          <div className="league-section popular-leagues-section">

            <div className="league-section-title">

              <FaFire />

              <span>
                Popular Leagues
              </span>

            </div>


            {/* ================================================
                FLAT POPULAR LEAGUE LIST

                NO COUNTRY GROUPING HERE
            ================================================= */}

            <div className="popular-leagues-list">

              {groupedSections
                .popularLeagues
                .map(
                  (league) => (

                    <button
                      key={
                        league.name
                      }
                      type="button"
                      className={`
                        league-item
                        ${
                          selectedLeague?.name ===
                          league.name
                            ? "active"
                            : ""
                        }
                      `}
                      onClick={() =>
                        selectLeague(
                          league
                        )
                      }
                    >

                      <span className="league-name">

                        {
                          league.displayName
                        }

                      </span>


                      <span className="league-event-count">

                        {
                          league.events
                        }

                      </span>

                    </button>

                  )
                )}

            </div>

          </div>

        )}


        {/* ====================================================
            POPULAR COUNTRIES
        ==================================================== */}

        {Object.keys(
          groupedSections
            .popularCountries
        ).length > 0 && (

          <div className="league-section">

            <div className="league-section-title">

              <span>
                🌍
              </span>

              <span>
                Popular Countries
              </span>

            </div>


            {renderRegions(
              groupedSections
                .popularCountries
            )}

          </div>

        )}


        {/* ====================================================
            OTHER COUNTRIES
        ==================================================== */}

        {Object.keys(
          groupedSections
            .otherCountries
        ).length > 0 && (

          <div className="league-section">

            <div className="league-section-title">

              <span>
                🌍
              </span>

              <span>
                Other Countries
              </span>

            </div>


            {renderRegions(
              groupedSections
                .otherCountries
            )}

          </div>

        )}


        {/* ====================================================
            NO LEAGUES
        ==================================================== */}

        {Object.keys(
          leaguesByRegion
        ).length === 0 && (

          <div className="no-leagues">

            No {activeSport} leagues available.

          </div>

        )}

      </div>

    </aside>

  );

};


export default LeaguePanel;

