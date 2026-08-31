import React, { useState } from "react";

import "./Markets.css";

const Markets = ({
  event,
  selectedOdds,
  onOddSelect,
}) => {

  // ==========================================================
  // ACCORDION STATE
  // ==========================================================

  const [openMarkets, setOpenMarkets] = useState({});


  // ==========================================================
  // EVENT CHECK
  // ==========================================================

  if (!event) {
    return null;
  }


  // ==========================================================
  // GET EVERY MARKET FROM THE EVENT
  // ==========================================================

  const markets = Object.entries(
    event.markets || {}
  );


  // ==========================================================
  // CURRENTLY SELECTED BET
  // ==========================================================

  const selectedBet = selectedOdds?.[String(event.id)];


  // ==========================================================
  // TOGGLE MARKET
  // ==========================================================

  const toggleMarket = (marketId) => {

    setOpenMarkets((previous) => ({
      ...previous,
      [marketId]: !previous[marketId],
    }));

  };


  // ==========================================================
  // MARKET NAME
  // ==========================================================

  const getMarketName = (
    market,
    marketId
  ) => {

    if (market?.market_name) {
      return market.market_name;
    }


    const firstBet =
      Object.values(
        market?.bets || {}
      )[0];


    return (
      firstBet?.market_name ||
      `Market ${marketId}`
    );

  };


  // ==========================================================
  // BET LABEL
  // ==========================================================

  const getBetLabel = (
    bet,
    fallback
  ) => {

    if (!bet) {
      return fallback;
    }


    const name =
      bet.bet ||
      bet.label ||
      bet.name ||
      fallback;


    const line =
      String(
        bet.line || ""
      ).trim();


    if (line) {
      return `${name} ${line}`;
    }


    return name;

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
  // HANDLE BET SELECTION
  // ==========================================================

  const handleBetSelect = ({bet,marketId,marketName,label,}) => {

    if (!bet) {
      return;
    }
    const locked = String(bet.locked) === "1";

    const blocked = String(bet.blocked) === "1";

    if (locked || blocked) {
      return;
    }


    const selection = {

      ...bet,
      // BET
      id:
        bet.id,

      odds:
        bet.odds,

      label,

      bet:
        bet.bet,

      line:
        bet.line || "",


      // MARKET
      marketId:
        String(marketId),

      market:
        marketName,

      marketName:
        marketName,

      market_name:
        marketName,


      // EVENT
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


  // ==========================================================
  // ODD BUTTON
  // ==========================================================

  const renderOdd = ({
    bet,
    marketId,
    marketName,
    label,
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
            market-odd
            odd-unavailable
          "
          disabled
        >

          <span>
            {label}
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

    const locked = String(bet.locked) === "1";

    const blocked = String(bet.blocked) === "1";

    const selected = isBetSelected(bet);


    // --------------------------------------------------------
    // BUTTON
    // --------------------------------------------------------

    return (
      <button
        key={key}
        type="button"
        className={`
          market-odd

          ${
            selected
              ? "odd-selected"
              : ""
          }

          ${
            locked || blocked
              ? "odd-locked"
              : ""
          }
        `}
        disabled={
          locked ||
          blocked
        }
        onClick={() =>
          handleBetSelect({
            bet,
            marketId,
            marketName,
            label,
          })
        }
      >

        <span>
          {label}
        </span>

        <strong>
          {bet.odds ?? "-"}
        </strong>

      </button>
    );

  };


  // ==========================================================
  // DETECT LINES
  // ==========================================================

  const hasLines = (bets) => {

    return Object.values(
      bets || {}
    ).some(
      (bet) =>
        String(
          bet?.line || ""
        ).trim() !== ""
    );

  };


  // ==========================================================
  // GROUP BETS BY LINE
  // ==========================================================

  const groupByLine = (bets) => {

    const groups = {};


    Object.entries(
      bets || {} ).forEach(
      ([key, bet]) => {

        const line = String(bet?.line || "" ).trim();

        const groupKey = line || "default";


        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }


        groups[groupKey].push({
          key,
          bet,
        });

      }
    );


    return groups;

  };


  // ==========================================================
  // FIND BET FOR HEADER
  // ==========================================================

  const findBetForHeader = (
    header,
    bets
  ) => {

    const normalizedHeader = String(header || ""
)
        .trim()
        .toLowerCase();


    if (!normalizedHeader) {
      return null;
    }


    // --------------------------------------------------------
    // 1. Try exact object key
    // --------------------------------------------------------

    if (bets?.[header]) {
      return bets[header];
    }


    // --------------------------------------------------------
    // 2. Try exact bet / label / name
    // --------------------------------------------------------

    const exactMatch =
      Object.values(
        bets || {}
      ).find(
        (bet) => {

          const value =
            bet?.bet ||
            bet?.label ||
            bet?.name ||
            "";


          return (
            String(value)
              .trim()
              .toLowerCase() ===
            normalizedHeader
          );

        }
      );


    if (exactMatch) {
      return exactMatch;
    }



    const compactHeader =
      normalizedHeader.replace(
        /[\s/_-]/g,
        ""
      );


    const compactMatch =Object.values(
        bets || {}
      ).find(
        (bet) => {

          const value =
            bet?.bet ||
            bet?.label ||
            bet?.name ||
            "";


          const compactValue =
            String(value)
              .trim()
              .toLowerCase()
              .replace(
                /[\s/_-]/g,
                ""
              );


          return (
            compactValue ===
            compactHeader
          );

        }
      );


    return compactMatch || null;

  };


  // ==========================================================
  // RENDER ONE MARKET
  // ==========================================================

  const renderMarket = (
    marketId,
    market
  ) => {

    const bets =
      market?.bets || {};


    const marketName =
      getMarketName(
        market,
        marketId
      );


    const headers =
      market?.headers
        ? market.headers
            .split(",")
            .map(
              (item) =>
                item.trim()
            )
            .filter(Boolean)
        : [];


    const isOpen =
      Boolean(
        openMarkets[marketId]
      );


    // ========================================================
    // MARKET CONTENT
    // ========================================================

    let marketContent;


    // ========================================================
    // LINE-BASED MARKET
    // ========================================================

    if (hasLines(bets)) {

      const grouped =
        groupByLine(bets);


      marketContent = (
        <div className="market-line-market">

          {Object.entries(
            grouped
          ).map(
            ([line, lineBets]) => (

              <div
                key={line}
                className="market-line-row"
              >

                <div className="market-line">

                  {line !== "default"
                    ? line
                    : ""}

                </div>


                <div className="market-line-options">

                  {lineBets.map(
                    ({
                      key,
                      bet,
                    }) => {

                      const label =
                        getBetLabel(
                          bet,
                          key
                        );


                      return renderOdd({
                        bet,
                        marketId,
                        marketName,
                        label,
                        key,
                      });

                    }
                  )}

                </div>

              </div>

            )
          )}

        </div>
      );

    }


    // ========================================================
    // NORMAL MARKET
    // ========================================================

    else {

      const entries =
        headers.length

          ? headers.map(
              (
                header,
                index
              ) => {

                const bet =
                  findBetForHeader(
                    header,
                    bets
                  );


                return {
                  key:
                    `${header}-${index}`,

                  bet,
                };

              }
            )

          : Object.entries(
              bets
            ).map(
              ([key, bet]) => ({
                key,
                bet,
              })
            );


      marketContent = (
        <div className="market-bets">

          {entries.map(
            ({
              key,
              bet,
            }) => {

              const label =
                getBetLabel(
                  bet,
                  key
                );


              return renderOdd({
                bet,
                marketId,
                marketName,
                label,
                key,
              });

            }
          )}

        </div>
      );

    }


    // ========================================================
    // ACCORDION
    // ========================================================

    return (
      <div
        key={marketId}
        className={`
          market-card
          ${isOpen ? "market-open" : ""}
        `}
      >

        <button
          type="button"
          className="market-card-header"
          onClick={() =>
            toggleMarket(
              marketId
            )
          }
          aria-expanded={isOpen}
        >

          <strong>
            {marketName}
          </strong>


          <span
            className={`
              market-accordion-icon
              ${isOpen ? "open" : ""}
            `}
          >
            ▼
          </span>

        </button>


        <div
          className={`
            market-card-content
            ${isOpen ? "open" : ""}
          `}
        >

          {marketContent}

        </div>

      </div>
    );

  };


  // ==========================================================
  // RENDER ALL MARKETS
  // ==========================================================

  return (
    <div className="markets">

      {markets.length === 0 ? (

        <div className="markets-empty">
          No markets available
        </div>

      ) : (

        markets.map(
          ([marketId, market]) =>
            renderMarket(
              marketId,
              market
            )
        )

      )}

    </div>
  );

};

export default Markets;