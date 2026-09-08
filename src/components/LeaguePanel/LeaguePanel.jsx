import { useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaFire,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import { useSports } from "../../contexts/SportsContext.jsx";
import { feedData } from "../../data/feedData.js";
import { popularBySport } from "../../data/popularSports.js";

import CountryFlag from "../CountryFlag/CountryFlag.jsx";

import "./LeaguePanel.css";


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

  const {
    activeSport,
    selectedLeague,
    selectLeague,
  } = useSports();

  const navigate = useNavigate();


  /* ==========================================================
     COLLAPSED COUNTRY REGIONS
  ========================================================== */

  const [collapsedRegions, setCollapsedRegions] = useState({});


  /* ==========================================================
     COLLAPSED MAIN SECTIONS
     
     false = expanded
     true  = collapsed
  ========================================================== */

  const [collapsedSections, setCollapsedSections] = useState({
    popularLeagues: false,
    popularCountries: false,
    otherCountries: false,
  });


  /* ==========================================================
     GET POPULAR SETTINGS FOR ACTIVE SPORT
  ========================================================== */

  const sportPopularity = useMemo(() => {

    const sportKey = normalizeText(activeSport);

    return (
      popularBySport[sportKey] ||
      popularBySport.default
    );

  }, [activeSport]);


  /* ==========================================================
     POPULAR LEAGUES
  ========================================================== */

  const popularLeagues =
    sportPopularity?.leagues || [];


  /* ==========================================================
     POPULAR COUNTRIES
  ========================================================== */

  const popularCountries =
    sportPopularity?.countries || [];


  /* ==========================================================
     SELECT LEAGUE + SHOW EVENTS
     
     Ensures center leaves /login or /register
     so the league games become visible.
  ========================================================== */

  const handleLeagueSelect = (league) => {

    selectLeague(league);

    navigate("/");

  };


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
          Object.values(leagueEvents || {}).filter(
            (event) => {

              if (!event) {
                return false;
              }

              return (
                normalizeText(event.sport) ===
                normalizeText(activeSport)
              );

            }
          );


        /* ====================================================
           IGNORE EMPTY LEAGUES
        ==================================================== */

        if (sportEvents.length === 0) {
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
              normalizeText(regionPrefix)
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

        if (!grouped[region]) {

          grouped[region] = {
            region,
            leagues: [],
            eventCount: 0,
          };

        }


        /* ====================================================
           ADD LEAGUE
        ==================================================== */

        grouped[region].leagues.push({

          name: leagueName,
          displayName,
          region,
          events: sportEvents.length,

        });


        /* ====================================================
           REGION EVENT COUNT
        ==================================================== */

        grouped[region].eventCount +=
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

        grouped[region].leagues.sort(
          (a, b) =>
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
           FIND POPULAR LEAGUES
           
           Popular leagues are displayed in the
           Popular Leagues section.

           They remain inside their country too.
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
           ADD POPULAR LEAGUES
        ==================================================== */

        popularLeaguesInRegion.forEach(
          (league) => {

            popularLeagueList.push(
              league
            );

          }
        );


        /* ====================================================
           KEEP ALL LEAGUES IN COUNTRY
           
           Popular leagues are NOT removed.
        ==================================================== */

        const countryLeagues =
          regionData.leagues;


        /* ====================================================
           POPULAR COUNTRIES
        ==================================================== */

        if (
          isPopularCountry &&
          countryLeagues.length > 0
        ) {

          popularCountryGroups[region] = {

            ...regionData,

            leagues:
              countryLeagues,

            eventCount:
              countryLeagues.reduce(
                (total, league) =>
                  total + league.events,
                0
              ),

          };

        }


        /* ====================================================
           OTHER COUNTRIES
        ==================================================== */

        if (!isPopularCountry) {

          otherCountryGroups[region] =
            regionData;

        }

      }
    );


    /* ========================================================
       SORT POPULAR LEAGUES
    ======================================================== */

    popularLeagueList.sort(
      (a, b) =>
        a.displayName.localeCompare(
          b.displayName
        )
    );


    /* ========================================================
       RETURN
    ======================================================== */

    return {

      popularLeagues:
        popularLeagueList,

      popularCountries:
        popularCountryGroups,

      otherCountries:
        otherCountryGroups,

    };

  }, [
    leaguesByRegion,
    popularLeagues,
    popularCountries,
  ]);


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
     RESET MAIN SECTIONS WHEN SPORT CHANGES
     
     All three main sections start expanded.
  ========================================================== */

  useEffect(() => {

    setCollapsedSections({

      popularLeagues: false,

      popularCountries: false,

      otherCountries: false,

    });

  }, [activeSport]);


  /* ==========================================================
     TOGGLE COUNTRY REGION
  ========================================================== */

  const toggleRegion = (region) => {

    setCollapsedRegions(
      (current) => ({

        ...current,

        [region]:
          !current[region],

      })
    );

  };


  /* ==========================================================
     TOGGLE MAIN SECTION
  ========================================================== */

  const toggleSection = (section) => {

    setCollapsedSections(
      (current) => ({

        ...current,

        [section]:
          !current[section],

      })
    );

  };


  /* ==========================================================
     RENDER SECTION HEADER
  ========================================================== */

  const renderSectionHeader = ({
    title,
    section,
    icon = null,
  }) => {

    const isCollapsed =
      collapsedSections[section];


    return (

      <button
        type="button"
        className="league-section-title"
        onClick={() =>
          toggleSection(section)
        }
        aria-expanded={!isCollapsed}
      >

        <span className="league-section-title-left">

          {icon && (
            <span className="league-section-icon">
              {icon}
            </span>
          )}

          <span>
            {title}
          </span>

        </span>


        <span className="league-section-arrow">

          {isCollapsed ? (
            <FaChevronRight />
          ) : (
            <FaChevronDown />
          )}

        </span>

      </button>

    );

  };


  /* ==========================================================
     RENDER COUNTRY REGIONS
  ========================================================== */

  const renderRegions = (regions) => {

    return Object.entries(regions).map(
      ([region, regionData]) => {

        const isCollapsed =
          collapsedRegions[region] ??
          true;


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
                toggleRegion(region)
              }
              aria-expanded={!isCollapsed}
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
                      key={league.name}
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
                        handleLeagueSelect(
                          league
                        )
                      }
                    >

                      <span className="league-name">

                        {league.displayName}

                      </span>


                      <span className="league-event-count">

                        {league.events}

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
            POPULAR LEAGUES
        ==================================================== */}

        {groupedSections.popularLeagues.length > 0 && (

          <div className="league-section popular-leagues-section">

            {renderSectionHeader({

              title: "Popular Leagues",

              section: "popularLeagues",

              icon: <FaFire />,

            })}


            {!collapsedSections.popularLeagues && (

              <div className="popular-leagues-list">

                {groupedSections.popularLeagues.map(
                  (league) => (

                    <button
                      key={league.name}
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
                        handleLeagueSelect(
                          league
                        )
                      }
                    >

                      {/* ==================================
                          COUNTRY FLAG
                      ================================== */}

                      <CountryFlag
                        country={
                          league.region
                        }
                      />


                      {/* ==================================
                          LEAGUE NAME
                      ================================== */}

                      <span className="league-name">

                        {league.displayName}

                      </span>


                      {/* ==================================
                          EVENT COUNT
                      ================================== */}

                      <span className="league-event-count">

                        {league.events}

                      </span>

                    </button>

                  )
                )}

              </div>

            )}

          </div>

        )}


        {/* ====================================================
            POPULAR COUNTRIES
        ==================================================== */}

        {
          Object.keys(
            groupedSections.popularCountries
          ).length > 0 && (

            <div className="league-section">

              {renderSectionHeader({

                title: "Popular Countries",

                section: "popularCountries",

              })}


              {!collapsedSections.popularCountries && (

                <div className="league-section-content">

                  {renderRegions(
                    groupedSections.popularCountries
                  )}

                </div>

              )}

            </div>

          )
        }


        {/* ====================================================
            OTHER COUNTRIES
        ==================================================== */}

        {
          Object.keys(
            groupedSections.otherCountries
          ).length > 0 && (

            <div className="league-section">

              {renderSectionHeader({

                title: "Other Countries",

                section: "otherCountries",

              })}


              {!collapsedSections.otherCountries && (

                <div className="league-section-content">

                  {renderRegions(
                    groupedSections.otherCountries
                  )}

                </div>

              )}

            </div>

          )
        }


        {/* ====================================================
            NO LEAGUES
        ==================================================== */}

        {
          Object.keys(
            leaguesByRegion
          ).length === 0 && (

            <div className="no-leagues">

              No {activeSport} leagues available.

            </div>

          )
        }

      </div>

    </aside>

  );

};


export default LeaguePanel;