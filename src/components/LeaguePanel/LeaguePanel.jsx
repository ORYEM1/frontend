
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaChevronDown,FaChevronRight } from "react-icons/fa";

import { useSports } from "../../contexts/SportsContext.jsx";
import { feedData } from "../../data/feedData.js";

import CountryFlag from "../CountryFlag/CountryFlag.jsx";

import "./LeaguePanel.css";

const LeaguePanel = () => {
  const {
    activeSport,
    selectedLeague,
    selectLeague,
  } = useSports();

  const [collapsedRegions, setCollapsedRegions] =
    useState({});

  const leaguesByRegion = useMemo(() => {
    const grouped = {};

    Object.entries(feedData || {}).forEach(
      ([leagueName, leagueEvents]) => {
        
        const sportEvents = Object.values(
          leagueEvents || {}
        ).filter((event) => {
          if (!event) {
            return false;
          }

          return (
            String(event.sport || "")
              .trim()
              .toLowerCase() ===
            String(activeSport || "")
              .trim()
              .toLowerCase()
          );
        });

        if (sportEvents.length === 0) {
          return;
        }

        const firstEvent = sportEvents[0];

        const region = String(
          firstEvent?.region || "Other"
        ).trim();


        let displayName = String(
          leagueName
        ).trim();

        const regionPrefix = `${region} - `;

        if (
          displayName
            .toLowerCase()
            .startsWith(
              regionPrefix.toLowerCase()
            )
        ) {
          displayName = displayName
            .substring(regionPrefix.length)
            .trim();
        }

        if (!grouped[region]) {
          grouped[region] = {
            region,
            leagues: [],
            eventCount: 0,
          };
        }

        // ====================================================
        // ADD LEAGUE
        // ====================================================

        grouped[region].leagues.push({
          // Original feed name
          name: leagueName,

          // Display name
          displayName,

          // Region
          region,

          // Number of events
          events: sportEvents.length,
        });

        // ====================================================
        // ADD EVENTS TO REGION TOTAL
        // ====================================================

        grouped[region].eventCount +=
          sportEvents.length;
      }
    );

    // ========================================================
    // SORT REGIONS
    // ========================================================

    const sortedRegions = {};

    Object.keys(grouped)
      .sort()
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

  useEffect(() => {
    const collapsed = {};

    Object.keys(leaguesByRegion).forEach(
      (region) => {
        collapsed[region] = true;
      }
    );

    setCollapsedRegions(collapsed);
  }, [leaguesByRegion]);

  const toggleRegion = (region) => {
    setCollapsedRegions((current) => ({
      ...current,
      [region]: !current[region],
    }));
  };

  const sportTitle = activeSport
    ? `${activeSport
        .charAt(0)
        .toUpperCase()}${activeSport.slice(1)} Leagues`
    : "Leagues";

  return (
    <aside className="league-panel">

      {/* ====================================================
          HEADER
      ==================================================== */}

      {/*<div className="league-panel-header">
        <h3>{sportTitle}</h3>
      </div>*/}
      <div className="league-list">
        <button
          type="button"
          className={`
            league-item
            ${!selectedLeague ? "active" : ""}
          `}
          onClick={() => selectLeague(null)}
        >
          <span className="league-name">
            All Leagues
          </span>
        </button>

        {Object.entries(leaguesByRegion).map(
          ([region, regionData]) => {
            const isCollapsed =
              collapsedRegions[region] ?? true;

            return (
              <div
                key={region}
                className="league-region-group"
              >

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

                  {/* ========================================
                      EVENT COUNT
                  ======================================== */}

                  <span className="region-event-count">
                    {regionData.eventCount}
                  </span>

                  {/* ========================================
                      ARROW
                  ======================================== */}

                  <span className="region-arrow">
                      {isCollapsed ? (
                        <FaChevronRight />
                      ) : (
                        <FaChevronDown />
                      )}
                  </span>

                </button>

                {/* ==========================================
                    LEAGUES
                ========================================== */}

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
                            selectLeague(league)
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
        )}

        {/* ==================================================
            NO LEAGUES
        ================================================== */}

        {Object.keys(leaguesByRegion).length === 0 && (
          <div className="no-leagues">
            No {activeSport} leagues available.
          </div>
        )}

      </div>

    </aside>
  );
};

export default LeaguePanel;

