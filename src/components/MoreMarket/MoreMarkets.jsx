
import React from "react";
import "./MoreMarkets.css";
import { FaArrowLeft } from "react-icons/fa";

const MoreMarkets = ({
  event,
  onBack,
  onOddSelect,
  selectedOdds,
}) => {
  if (!event) {
    return null;
  }

  // ==========================================================
  // GET MARKETS FROM FEED
  // ==========================================================

  const markets = Object.entries(event.markets || {});

  // ==========================================================
  // SELECTED BET
  // ==========================================================

  const selectedBet =
    selectedOdds?.[String(event.id)];

  // ==========================================================
  // GET MARKET NAME
  // ==========================================================

  const getMarketName = (market) => {
    if (!market) {
      return "";
    }

    // Prefer market_name from the market itself
    if (market.market_name) {
      return market.market_name;
    }

    // If market name is not directly on market,
    // get it from the first available bet.
    const firstBet = Object.values(
      market.bets || {}
    )[0];

    return (
      firstBet?.market_name ||
      ""
    );
  };

  // ==========================================================
  // GET DISPLAY LABEL
  // ==========================================================

  const getBetLabel = (bet, header) => {
    if (!bet) {
      return header;
    }

    const betName =
      bet.bet ||
      bet.label ||
      bet.name ||
      header;

    const line =
      String(bet.line || "").trim();

    /*
     * Examples:
     *
     * Over + 2.5  -> Over 2.5
     * Under + 1.5 -> Under 1.5
     * Yes + ""    -> Yes
     * 1/X + ""    -> 1/X
     */

    if (line) {
      return `${betName} ${line}`;
    }

    return betName;
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="more-markets">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="more-markets-header">

        <button
          type="button"
          className="more-markets-back"
          onClick={onBack}
        >
          <FaArrowLeft />

          <span>
            Back
          </span>
        </button>

        <div className="more-markets-event">

          <div className="more-market-league">
            {event.league}
          </div>

          <div className="more-markets-teams">

            <div className="more-market-home">
              {event.home}
            </div>

            <span>
              vs
            </span>

            <div className="more-market-away">
              {event.away}
            </div>

          </div>

          <div className="more-market-time">
            {event.kickoff_time || "--:--"}
          </div>

        </div>

      </div>

      {/* ====================================================
          MARKETS
      ==================================================== */}

      <div className="more-markets-content">

        {markets.map(
          ([marketId, market]) => {

            // =================================================
            // MARKET HEADERS
            // =================================================

            const headers =
              market.headers
                ? market.headers
                    .split(",")
                    .map((item) =>
                      item.trim()
                    )
                : [];

            // =================================================
            // BETS
            // =================================================

            const bets =
              market.bets || {};

            // =================================================
            // MARKET NAME
            // =================================================

            const marketName =
              getMarketName(market) ||
              `Market ${marketId}`;

            return (
              <div
                key={marketId}
                className="market-card"
              >

                {/* ==========================================
                    MARKET NAME
                ========================================== */}

                <div className="market-card-header">

                  <strong>
                    {marketName}
                  </strong>

                </div>

                {/* ==========================================
                    MARKET ODDS
                ========================================== */}

                <div className="market-bets">

                  {headers.map(
                    (header) => {

                      const bet =
                        bets[header];

                      // =====================================
                      // BET DOES NOT EXIST
                      // =====================================

                      if (!bet) {

                        return (
                          <button
                            key={header}
                            type="button"
                            className="
                              more-market-odd
                              odd-unavailable
                            "
                            disabled
                          >
                            <span>
                              {header}
                            </span>

                            <strong>
                              -
                            </strong>
                          </button>
                        );
                      }

                      // =====================================
                      // BET LABEL
                      // =====================================

                      const betLabel =
                        getBetLabel(
                          bet,
                          header
                        );

                      // =====================================
                      // SELECTED
                      // =====================================

                      const isSelected =
                        String(
                          selectedBet?.id
                        ) ===
                        String(bet.id);

                      // =====================================
                      // LOCKED
                      // =====================================

                      const isLocked =
                        String(
                          bet.locked
                        ) === "1";

                      // =====================================
                      // BLOCKED
                      // =====================================

                      const isBlocked =
                        String(
                          bet.blocked
                        ) === "1";

                      // =====================================
                      // CLICK
                      // =====================================

                      const handleOddClick =
                        () => {

                          if (
                            isLocked ||
                            isBlocked
                          ) {
                            return;
                          }

                          /*
                           * Build a complete selection.
                           *
                           * IMPORTANT:
                           * marketId and marketName
                           * come from the CURRENT market,
                           * not from the event.
                           */

                          const selection = {

                            ...bet,

                            // Bet information
                            id: bet.id,

                            odds:
                              bet.odds,

                            label:
                              betLabel,

                            bet:
                              bet.bet,

                            line:
                              bet.line || "",

                            // Market information
                            marketId:
                              String(
                                marketId
                              ),

                            market:
                              marketName,

                            marketName:
                              marketName,

                            market_name:
                              marketName,

                            // Event information
                            eventId:
                              event.id,

                            home:
                              event.home,

                            away:
                              event.away,

                            league:
                              event.league,

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

                      // =====================================
                      // RENDER BET
                      // =====================================

                      return (
                        <button
                          key={header}
                          type="button"
                          className={`
                            more-market-odd

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

                          <span>
                            {betLabel}
                          </span>

                          <strong>
                            {bet.odds}
                          </strong>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
};

export default MoreMarkets;

