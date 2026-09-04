import "./EventBoard.css";
import Footer from "../Footer/Footer";
import { forwardRef } from "react";

const marketNames = {

  // Football
  "3": "Match Result (1X2)",
  "304": "Both Teams To Score",
  "6": "Double Chance",
  "4": "Over/Under",
  "45": "Odd/Even",

  // Basketball
  "101": "Moneyline",
  "102": "Point Spread",
  "103": "Total Points",

  // Tennis
  "201": "Match Winner",
  "202": "Total Sets",

  // Rugby
  "301": "Match Result",
  "302": "Total Points",

  // Volleyball
  "401": "Match Winner",
  "402": "Total Sets",

  // Handball
  "501": "Match Result",
  "502": "Total Goals",
};


const EventBoard = forwardRef(({
  feed,
  marketId = "3",
  onOddSelect,
  selectedOdds = {},
  onMoreClick,
}, ref) => {

  const activeMarketId = String(marketId);

  const activeMarketName = marketNames[activeMarketId] || "Unknown Market";


  return (

    <div
      ref={ref}
      className="event-board"
    >

      {/* =====================================================
          LEAGUES
      ===================================================== */}

      <div className="event-board-content">

        {Object.entries(feed || {}).map(
          ([leagueName, leagueEvents]) => {

            const events = Object.entries(
              leagueEvents || {}
            );


            /* =================================================
               SKIP EMPTY LEAGUES
            ================================================= */

            if (events.length === 0) {
              return null;
            }


            /* =================================================
               FIRST EVENT
            ================================================= */

            const firstEvent =
              events[0]?.[1];


            /* =================================================
               MAIN MARKET
            ================================================= */

            const mainMarket =firstEvent?.markets?.[ activeMarketId];


            /* =================================================
               MARKET HEADERS
            ================================================= */

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

                {/* ==========================================
                    LEAGUE HEADER
                ========================================== */}

                <div className="league-header">

                  <div className="league-name">

                    <strong>
                      {leagueName}
                    </strong>

                  </div>


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


                  <div className="league-more">

                    <span>
                      More
                    </span>

                  </div>

                </div>


                {/* ==========================================
                    EVENTS
                ========================================== */}

                <div className="league-events">

                  {events.map(
                    ([eventKey, event]) => {

                      const eventMarket =
                        event?.markets?.[
                          activeMarketId
                        ];


                      const eventBets =
                        eventMarket?.bets ||
                        {};


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

                          {/* =================================
                              TIME
                          ================================= */}

                          <div className="event-time">

                            {event.kickoff_time ||
                              "--:--"}

                          </div>


                          {/* =================================
                              TEAMS
                          ================================= */}

                          <div
                            className="event-teams"
                            onClick={() =>
                              onMoreClick?.(
                                event
                              )
                            }
                            role="link"
                            tabIndex={0}
                          >

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


                          {/* =================================
                              ODDS
                          ================================= */}

                          <div className="event-odds">

                            {headers.map(
                              (header) => {

                                const bet =
                                  eventBets[
                                    header
                                  ];


                                /* ==============================
                                   NO ODD
                                ============================== */

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


                                /* ==============================
                                   SELECTION LABEL
                                ============================== */

                                const selectionLabel =
                                  bet.line
                                    ? `${bet.bet ||
                                        bet.label ||
                                        bet.name ||
                                        header} ${bet.line}`
                                    : bet.bet ||
                                      bet.label ||
                                      bet.name ||
                                      header;


                                /* ==============================
                                   SELECTED
                                ============================== */

                                const isSelected =
                                  String(
                                    selectedBet?.id
                                  ) ===
                                  String(
                                    bet.id
                                  );


                                /* ==============================
                                   LOCKED
                                ============================== */

                                const isLocked =
                                  String(
                                    bet.locked
                                  ) === "1";


                                /* ==============================
                                   BLOCKED
                                ============================== */

                                const isBlocked =
                                  String(
                                    event.blocked
                                  ) === "1";


                                /* ==============================
                                   ODD CLICK
                                ============================== */

                                const handleOddClick =
                                  () => {

                                    if (
                                      isLocked ||
                                      isBlocked
                                    ) {
                                      return;
                                    }


                                    const selection = {

                                      ...bet,

                                      id:
                                        bet.id,

                                      odds:
                                        bet.odds,

                                      label:
                                        selectionLabel,

                                      market:
                                        activeMarketName,

                                      marketName:
                                        activeMarketName,

                                      market_name:
                                        activeMarketName,

                                      marketId:
                                        activeMarketId,

                                      eventId:
                                        event.id,

                                      home:
                                        event.home,

                                      away:
                                        event.away,

                                      league:
                                        event.league ||
                                        leagueName,

                                      sport:
                                        event.sport,

                                      kickoff_time:
                                        event.kickoff_time,

                                      eventDate:
                                        event.date,
                                    };


                                    onOddSelect?.(
                                      selection
                                    );

                                  };


                                /* ==============================
                                   ODD BUTTON
                                ============================== */

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
                                    onClick={
                                      handleOddClick
                                    }
                                  >

                                    {bet.odds}

                                  </button>

                                );

                              }
                            )}

                          </div>


                          {/* =================================
                              MORE MARKETS
                          ================================= */}

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


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
});


export default EventBoard;