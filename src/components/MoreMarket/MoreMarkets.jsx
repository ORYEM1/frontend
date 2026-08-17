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


  const markets = Object.entries(event.markets || {});
  const selectedBet =
    selectedOdds?.[String(event.id)];

  // ==========================================================
  // GET MARKET NAME
  // ==========================================================

  const getMarketName = (market) => {
    if (!market) {
      return "";
    }

    // Prefer market_name from market itself
    if (market.market_name) {
      return market.market_name;
    }

    // Otherwise get it from first bet
    const firstBet = Object.values(
      market.bets || {}
    )[0];

    return firstBet?.market_name || "";
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

    if (line) {
      return `${betName} ${line}`;
    }

    return betName;
  };

  // ==========================================================
  // HANDLE ODD SELECTION
  // ==========================================================

  const handleOddSelect = (
    bet,
    marketId,
    marketName,
    betLabel
  ) => {
    if (!bet) {
      return;
    }

    const isLocked =
      String(bet.locked) === "1";

    const isBlocked =
      String(bet.blocked) === "1";

    if (isLocked || isBlocked) {
      return;
    }

    // ========================================================
    // BUILD COMPLETE SELECTION
    // ========================================================

    const selection = {
      ...bet,

      // Bet information
      id: bet.id,

      odds: bet.odds,

      label: betLabel,

      bet: bet.bet,

      line: bet.line || "",

      // Market information
      marketId: String(marketId),

      market: marketName,

      marketName: marketName,

      market_name: marketName,

      // Event information
      eventId: event.id,

      home: event.home,

      away: event.away,

      league: event.league,

      sport: event.sport,

      kickoff_time: event.kickoff_time,

      eventDate: event.date,
    };

    onOddSelect?.(selection);
  };

  // ==========================================================
  // CHECK SELECTED
  // ==========================================================

  const isBetSelected = (bet) => {
    return (
      String(selectedBet?.id) ===
      String(bet?.id)
    );
  };

  // ==========================================================
  // RENDER NORMAL ODD
  // ==========================================================

  const renderOdd = ({
    bet,
    marketId,
    marketName,
    betLabel,
    key,
  }) => {
    // --------------------------------------------------------
    // BET DOES NOT EXIST
    // --------------------------------------------------------

    if (!bet) {
      return (
        <button
          key={key}
          type="button"
          className="
            more-market-odd
            odd-unavailable
          "
          disabled
        >
          <span>
            {betLabel}
          </span>

          <strong>
            -
          </strong>
        </button>
      );
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    const isSelected =
      isBetSelected(bet);

    const isLocked =
      String(bet.locked) === "1";

    const isBlocked =
      String(bet.blocked) === "1";

    // --------------------------------------------------------
    // CLICK
    // --------------------------------------------------------

    const handleClick = () => {
      handleOddSelect(
        bet,
        marketId,
        marketName,
        betLabel
      );
    };

    // --------------------------------------------------------
    // BUTTON
    // --------------------------------------------------------

    return (
      <button
        key={key}
        type="button"
        className={`
          more-market-odd

          ${
            isSelected
              ? "odd-selected"
              : ""
          }

          ${
            isLocked || isBlocked
              ? "odd-locked"
              : ""
          }
        `}
        disabled={
          isLocked ||
          isBlocked
        }
        onClick={handleClick}
      >
        <span>
          {betLabel}
        </span>

        <strong>
          {bet.odds}
        </strong>
      </button>
    );
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

          {/* ==================================================
              TEAMS
          ================================================== */}

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
            // MARKET DATA
            // =================================================

            const headers =
              market.headers
                ? market.headers
                    .split(",")
                    .map(
                      (item) =>
                        item.trim()
                    )
                : [];

            const bets =
              market.bets || {};

            const marketName =
              getMarketName(market) ||
              `Market ${marketId}`;

            // =================================================
            // CHECK OVER / UNDER MARKET
            // =================================================

            const isOverUnder =
              String(marketId) === "4";

            // =================================================
            // GET OVER/UNDER LINES
            // =================================================

            const overUnderLines =
              isOverUnder
                ? [
                    ...new Set(
                      Object.values(bets)
                        .map(
                          (bet) =>
                            String(
                              bet.line || ""
                            ).trim()
                        )
                        .filter(Boolean)
                    ),
                  ].sort(
                    (a, b) =>
                      parseFloat(a) -
                      parseFloat(b)
                  )
                : [];

            // =================================================
            // MARKET CARD
            // =================================================

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

                {/* =================================================
                    OVER / UNDER
                ================================================= */}

                {isOverUnder ? (

                  <div className="over-under-market">

                    {/* =========================================
                        COLUMN HEADERS
                    ========================================= */}

                    <div className="over-under-header">

                      <div>
                        
                      </div>

                      <div>
                        OVER
                      </div>

                      <div>
                        UNDER
                      </div>

                    </div>

                    {/* =========================================
                        LINES
                    ========================================= */}

                    {overUnderLines.map(
                      (line) => {

                        const overBet =
                          bets[
                            `Over ${line}`
                          ];

                        const underBet =
                          bets[
                            `Under ${line}`
                          ];

                        return (
                          <div
                            key={line}
                            className="over-under-row"
                          >

                            {/* ==========================
                                LINE
                            ========================== */}

                            <div className="over-under-line">
                              {line}
                            </div>

                            {/* ==========================
                                OVER
                            ========================== */}

                            <div className="over-under-cell">

                              {renderOdd({
                                bet: overBet,
                                marketId,
                                marketName,
                                betLabel: "Over",
                                key: `over-${line}`,
                              })}

                            </div>

                            {/* ==========================
                                UNDER
                            ========================== */}

                            <div className="over-under-cell">

                              {renderOdd({
                                bet: underBet,
                                marketId,
                                marketName,
                                betLabel: "Under",
                                key: `under-${line}`,
                              })}

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  /* =================================================
                     NORMAL MARKETS
                  ================================================= */

                  <div className="market-bets">

                    {headers.map(
                      (header) => {

                        const bet =
                          bets[header];

                        const betLabel =
                          getBetLabel(
                            bet,
                            header
                          );

                        return renderOdd({
                          bet,
                          marketId,
                          marketName,
                          betLabel,
                          key: header,
                        });
                      }
                    )}

                  </div>
                )}

              </div>
            );
          }
        )}

      </div>

    </section>
  );
};

export default MoreMarkets;