import {useMemo} from "react";
import {useSports} from "../../contexts/SportsContext.jsx";
import {feedData} from "../../data/feedData.js";

import "./LeaguePanel.css";

const LeaguePanel = () => {

  const {activeSport,selectedLeague,selectLeague} = useSports();

  const leagues = useMemo(() => {

    const leagueList = [];


    Object.entries(feedData).forEach(
      ([leagueName, leagueEvents]) => {

        const sportEvents =
          Object.values(
            leagueEvents || {}
          ).filter((event) => {

            if (!event) {
              return false;
            }
            return (
              String(
                event.sport || ""
              ).toLowerCase() ===
              String(
                activeSport || ""
              ).toLowerCase()
            );

          });

        if (
          sportEvents.length === 0
        ) {
          return;
        }

        const firstEvent =
          sportEvents[0];

        leagueList.push({

          name:
            leagueName,

          region:
            firstEvent?.region ||
            "",

          events:
            sportEvents.length,

        });

      }
    );


    return leagueList;

  }, [
    activeSport,
  ]);

  return (

    <aside className="league-panel">
      <div className="league-panel-header">

        <h3>
          {activeSport
            ? `${activeSport
                .charAt(0)
                .toUpperCase()}${activeSport.slice(1)} Leagues`
            : "Leagues"}
        </h3>

      </div>

      <div className="league-list">

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

        {leagues.map((league) => (

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
            {league.region && (
              <span className="league-region">
                {league.region}
              </span>
            )}
            <span className="league-name">
              {league.name}
            </span>
            <span className="league-event-count">
              {league.events}
            </span>
          </button>

        ))}

        {leagues.length === 0 && (

          <div className="no-leagues">
            No {activeSport} leagues available.
          </div>
        )}

      </div>

    </aside>

  );

};

export default LeaguePanel;