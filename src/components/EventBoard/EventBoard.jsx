
import { feedData } from "../../data/feedData";
import "./EventBoard.css";


function EventBoard({
  feed,
  marketId = "3",
  onOddSelect,
  selectedOdds,
  onMoreClick,
}) {

  return (

    <div className="event-board">

      {Object.entries(feedData).map(
        ([leagueName, leagueEvents]) => {

          const events =
            Object.entries(leagueEvents);

          const firstEvent =
            events[0]?.[1];


          // ==================================================
          // MARKET
          // ==================================================

          const mainMarket =
            firstEvent?.markets?.[marketId];


          // ==================================================
          // HEADERS
          // ==================================================

          const headers =
            mainMarket?.headers
              ? mainMarket.headers
                  .split(",")
                  .map((header) =>
                    header.trim()
                  )
              : [];


          return (

            <section
              key={leagueName}
              className="league-group"
            >


              {/* =================================================
                  LEAGUE HEADER
              ================================================= */}

              <div className="league-header">


                {/* LEAGUE */}

                <div className="league-name">

                  <strong>
                    {leagueName}
                  </strong>

                </div>


                {/* MARKET HEADERS */}

                <div className="league-market-headers">

                  {headers.map(
                    (header) => (

                      <div
                        key={header}
                        className="market-header"
                      >

                        {header}

                      </div>

                    )
                  )}

                </div>


                {/* MORE */}

                <div className="league-more">

                  <span>
                    More
                  </span>

                </div>

              </div>


              {/* =================================================
                  EVENTS
              ================================================= */}

              <div className="league-events">

                {events.map(
                  ([eventKey, event]) => {


                    // ==========================================
                    // MARKET
                    // ==========================================

                    const eventMarket =
                      event.markets?.[marketId];


                    const eventBets =
                      eventMarket?.bets || {};


                    // ==========================================
                    // SELECTED BET
                    // ==========================================

                    const selectedBet =
                      selectedOdds?.[
                        String(event.id)
                      ];


                    return (

                      <div
                        key={
                          event.id ||
                          eventKey
                        }

                        className="event-row"
                      >


                        {/* =====================================
                            TIME
                        ===================================== */}

                        <div className="event-time">

                          {event.kickoff_time ||
                            "--:--"}

                        </div>


                        {/* =====================================
                            TEAMS
                        ===================================== */}

                        <div className="event-teams">

                          <div className="home-team">

                            <strong>
                              {event.home}
                            </strong>

                          </div>


                          <div className="away-team">

                            <strong>
                              {event.away}
                            </strong>

                          </div>

                        </div>


                        {/* =====================================
                            ODDS
                        ===================================== */}

                        <div className="event-odds">

                          {headers.map(
                            (header) => {

                              const bet =
                                eventBets[header];


                              // =================================
                              // NO BET
                              // =================================

                              if (!bet) {

                                return (

                                  <button
                                    key={header}

                                    type="button"

                                    className="
                                      odd-button
                                      odd-unavailable
                                    "

                                    disabled
                                  >

                                    -

                                  </button>

                                );

                              }


                              // =================================
                              // SELECTED
                              // =================================

                              const isSelected =
                                selectedBet?.id ===
                                bet.id;


                              // =================================
                              // LOCKED
                              // =================================

                              const isLocked =
                                String(
                                  bet.locked
                                ) === "1";


                              // =================================
                              // BLOCKED
                              // =================================

                              const isBlocked =
                                String(
                                  event.blocked
                                ) === "1";

                              return (
                                <button
                                  key={header}

                                  type="button"

                                  className={`
                                    odd-button

                                    ${
                                      isSelected
                                        ? "odd-selected"
                                        : ""
                                    }
                                    
                                    ${
                                      isLocked ||
                                      isBlocked
                                        ? "odd-locked"
                                        : ""
                                        
                                    }
                                  `}

                                  disabled={
                                    isLocked ||
                                    isBlocked
                                  }


                                  onClick={() => {

                                    onOddSelect?.({

                                      ...bet,

                                      // =================================
                                      // EVENT INFORMATION
                                      // =================================

                                      eventId:
                                        event.id,

                                      home:
                                        event.home,

                                      away:
                                        event.away,

                                      league:
                                        event.league ||
                                        leagueName,

                                      kickoff_time:
                                        event.kickoff_time,

                                      sport:
                                        event.sport,

                                      eventDate:
                                        event.date,
                                   
                                      marketId:
                                        marketId,

                                      marketName:
                                        eventMarket.market_name,

                                    });

                                  }}

                                >

                                  {bet.odds}

                                </button>

                              );

                            }
                          )}

                        </div>


                        {/* =====================================
                            MORE
                        ===================================== */}

                        <div className="event-more">

                          <button
                            type="button"

                            className="more-button"

                            onClick={() =>
                              onMoreClick?.(
                                event
                              )
                            }

                            aria-label={
                              `More markets for ${
                                event.home
                              } vs ${
                                event.away
                              }`
                            }
                          >

                            +

                          </button>

                        </div>


                      </div>

                    );

                  }
                )}

              </div>

            </section>

          );

        }
      )}

    </div>

  );

}


export default EventBoard;

