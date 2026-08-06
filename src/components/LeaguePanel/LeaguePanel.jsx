
import { useMemo } from "react";

import { feedData } from "../../data/data.js";

import "./LeaguePanel.css";


const LeaguePanel = ({
  selectedLeague,
  onLeagueSelect,
}) => {

  // ==========================================================
  // BUILD LEAGUE LIST FROM RAW FEED
  // ==========================================================

  const leagues = useMemo(() => {

    const result = [];

    Object.entries(feedData).forEach(
      ([leagueKey, leagueEvents]) => {

        const firstEvent =
          Object.values(leagueEvents)[0];

        if (!firstEvent) {
          return;
        }

        result.push({
          key: leagueKey,
          name: firstEvent.league,
          region: firstEvent.region,
        });

      }
    );

    return result;

  }, []);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <aside className="league-panel">

      {/* ================================================
          HEADER
      ================================================ */}

      <div className="league-panel-header">

        <h3>
          Leagues
        </h3>

      </div>


      {/* ================================================
          LEAGUES
      ================================================ */}

      <div className="league-list">

        {leagues.map((league) => {

          const isSelected =
            selectedLeague === league.key;


          return (

            <button
              key={league.key}
              type="button"
              className={
                `league-item ${
                  isSelected
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                onLeagueSelect(
                  league.key
                )
              }
            >

              <span className="league-region">

                {league.region}

              </span>


              <span className="league-name">

                {league.name}

              </span>

            </button>

          );

        })}

      </div>

    </aside>

  );

};


export default LeaguePanel;

