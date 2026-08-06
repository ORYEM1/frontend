import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import {FaLock} from "react-icons/fa";

import {
  events,
  marketOptions,
  allLeagues,
} from "../../data/data";

import "./EventsPage.css";


/**
 * Check whether a row is a league header.
 */
function isLeagueRow(row) {
  return row?.rowType === "league";
}


/**
 * Safely convert a value to lowercase text.
 */
function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}


export function EventsPage({
  onOddSelect,
  selectedOdds = {},
  onMoreClick,
}) {

  // ============================================================
  // STATE
  // ============================================================

  const [search, setSearch] = useState("");

  const [market, setMarket] = useState("3");

  const [date, setDate] = useState("today");

  const [searchParams, setSearchParams] =
    useSearchParams();


  // ============================================================
  // SELECTED LEAGUE
  // ============================================================

  const selectedLeagueId =
    searchParams.get("league");


  const selectedLeague =
    selectedLeagueId
      ? allLeagues.find(
          (league) =>
            String(league.id) ===
            String(selectedLeagueId)
        )
      : undefined;


  // ============================================================
  // CURRENT MARKET
  // ============================================================

  const selectedMarket =
    marketOptions.find(
      (option) =>
        String(option.value) ===
        String(market)
    );


  const activeMarketName =
    selectedMarket?.label ||
    "Match Result ";


  // ============================================================
  // OUTCOME LABELS
  // ============================================================

  const outcomeLabels = useMemo(() => {

    switch (String(market)) {

      case "304":
        return ["Yes", "No"];

      case "4":
        return ["Over", "Under"];

      case "45":
        return ["Odd", "Even"];

      case "6":
        return ["1/X", "1/2", "X/2"];

      case "3":
      default:
        return ["1", "X", "2"];
    }

  }, [market]);


  // ============================================================
  // FILTER EVENTS
  // ============================================================

  const filteredEvents = useMemo(() => {

    const query =
      normalize(search);


    return events.filter((event) => {

      // --------------------------------------------------------
      // Search
      // --------------------------------------------------------

      const matchesSearch =
        !query ||

        normalize(event.home).includes(
          query
        ) ||

        normalize(event.away).includes(
          query
        ) ||

        normalize(event.league).includes(
          query
        );


      // --------------------------------------------------------
      // League
      //
      // allLeagues.id === event.league
      // --------------------------------------------------------

      const matchesLeague =
        !selectedLeagueId ||
        event.league === selectedLeagueId;


      // --------------------------------------------------------
      // Date
      //
      // Your current feed uses:
      //
      // "30/07"
      //
      // So "today" displays the current
      // feed. Tomorrow will only display
      // events whose date is tomorrow.
      // --------------------------------------------------------

      const matchesDate =
        date === "today";


      // --------------------------------------------------------
      // Market
      // --------------------------------------------------------

      const hasMarket =
        event.markets?.some(
          (eventMarket) =>
            String(eventMarket.marketId) ===
            String(market)
        );


      return (
        matchesSearch &&
        matchesLeague &&
        matchesDate &&
        hasMarket
      );

    });

  }, [
    search,
    selectedLeagueId,
    market,
    date,
  ]);


  // ============================================================
  // GROUP EVENTS BY LEAGUE
  // ============================================================

  const groupedRows = useMemo(() => {

    const groups = new Map();


    filteredEvents.forEach((event) => {

      const league =
        event.league || "Other";


      const group =
        groups.get(league) || [];


      group.push(event);


      groups.set(
        league,
        group
      );

    });


    return Array.from(
      groups.entries()
    ).flatMap(
      ([league, group]) => [

        {
          key: `league-${league}`,
          rowType: "league",
          league,
        },

        ...group,

      ]
    );

  }, [filteredEvents]);


  // ============================================================
  // GET EVENT MARKET
  // ============================================================

  const getEventMarket = (event) => {

    return event?.markets?.find(
      (eventMarket) =>
        String(eventMarket.marketId) ===
        String(market)
    );

  };


  // ============================================================
  // CLEAR LEAGUE
  // ============================================================

  const clearLeague = () => {

    setSearchParams({});

  };


  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  const clearSearch = () => {

    setSearch("");

  };


  // ============================================================
  // SELECT ODD
  // ============================================================

  const handleOddSelect = (odd) => {

    if (!odd) {
      return;
    }


    if (typeof onOddSelect === "function") {

      onOddSelect(odd);

    }

  };


  // ============================================================
  // MORE MARKETS
  // ============================================================

  const handleMoreClick = (event) => {

    if (
      typeof onMoreClick === "function"
    ) {

      onMoreClick(event);

    }

  };


  // ============================================================
  // TABLE COLUMNS
  // ============================================================

  const columnCount =
    5 + outcomeLabels.length;


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="market-board">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="market-header">

        <div>

          <h3>

            {selectedLeague
              ? `${selectedLeague.name} - ${activeMarketName}`
              : activeMarketName}

          </h3>


          

        </div>

      </div>


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="filters">


        {/* ====================================================
            DATE
        ==================================================== */}

        <select
          className="date-filter"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
        >

          <option value="today">
            Today
          </option>

          <option value="tomorrow">
            Tomorrow
          </option>

        </select>


        {/* ====================================================
            MARKET
        ==================================================== */}

        <select
          className="market-filter"
          value={market}
          onChange={(event) =>
            setMarket(event.target.value)
          }
        >

          {marketOptions.map(
            (option) => (

              <option
                key={option.id}
                value={option.value}
              >
                {option.label}
              </option>

            )
          )}

        </select>


        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div className="search-wrapper">

          <FaSearch className="search-icon"/>


          <input
            className="search-input"
            type="text"
            placeholder="Search team or league"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />


          {search && (

            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>

          )}

        </div>


        {/* ====================================================
            SEARCH BUTTON
        ==================================================== */}

        <button
          className="search-button"
          type="button"
        >
          <FaSearch className="search-icon"/>
           Search
        </button>


        {/* ====================================================
            CLEAR LEAGUE
        ==================================================== */}

        {selectedLeague && (

          <button
            className="clear-league-button"
            type="button"
            onClick={clearLeague}
          >
            All
          </button>

        )}

      </div>


      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="table-container">

        <table className="odds-table">


          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <thead>

            <tr>

              <th className="time-column">
                Time
              </th>


              <th>
                Home
              </th>


              <th className="versus-column">
                &nbsp;
              </th>


              <th className="away-column">
                Away
              </th>


              {outcomeLabels.map(
                (label) => (

                  <th
                    key={label}
                    className="odd-column"
                  >
                    {label}
                  </th>

                )
              )}


              <th className="more-column">
                &nbsp;
              </th>

            </tr>

          </thead>


          {/* ==================================================
              TABLE BODY
          ================================================== */}

          <tbody>

            {groupedRows.map(
              (row, index) => {


                // =================================================
                // LEAGUE HEADER
                // =================================================

                if (isLeagueRow(row)) {

                  return (

                    <tr
                      key={row.key}
                      className="league-group-table-row"
                    >

                      <td
                        colSpan={columnCount}
                        className="league-group-cell"
                      >

                        <div className="league-group-row">

                          <strong>
                            {row.league}
                          </strong>

                        </div>

                      </td>

                    </tr>

                  );

                }


                // =================================================
                // EVENT MARKET
                // =================================================

                const eventMarket =
                  getEventMarket(row);


                // =================================================
                // EVENT ROW
                // =================================================

                return (

                  <tr
                    key={row.eventId}
                    className={
                      index % 2 === 0
                        ? "table-row-even"
                        : ""
                    }
                  >


                    {/* =========================================
                        TIME
                    ========================================= */}

                    <td className="time-column">

                      {row.time || "--:--"}

                    </td>


                    {/* =========================================
                        HOME
                    ========================================= */}

                    <td>

                      <div className="team-cell-home">

                        <strong>
                          {row.home}
                        </strong>

                      </div>

                    </td>


                    {/* =========================================
                        VS
                    ========================================= */}

                    <td className="versus-column">

                      <span className="versus">
                        vs
                      </span>

                    </td>


                    {/* =========================================
                        AWAY
                    ========================================= */}

                    <td>

                      <div className="team-cell-away">

                        <strong>
                          {row.away}
                        </strong>

                      </div>

                    </td>


                    {/* =========================================
                        ODDS
                    ========================================= */}

                    {outcomeLabels.map(
                      (label) => {

                        const odd =
                          eventMarket?.selections?.find(
                            (selection) =>
                              normalize(
                                selection.label
                              ) ===
                              normalize(label)
                          );


                        // -------------------------------------
                        // NO ODD
                        // -------------------------------------

                        if (!odd) {

                          return (

                            <td
                              key={label}
                              className="odd-column"
                            >

                              <span className="empty-odd">
                                -
                              </span>

                            </td>

                          );

                        }


                        // -------------------------------------
                        // SELECTED
                        // -------------------------------------

                        const selectedForEvent =
                          selectedOdds?.[
                            row.eventId
                          ];


                        const isSelected =
                          selectedForEvent?.id ===
                          odd.id;


                        // -------------------------------------
                        // LOCKED / BLOCKED
                        // -------------------------------------

                        const isDisabled =
                          Boolean(
                            odd.locked ||
                            row.blocked
                          );


                        // -------------------------------------
                        // ODDS VALUE
                        // -------------------------------------

                        const oddsValue =
                          Number(odd.odds);


                        return (

                          <td
                            key={label}
                            className="odd-column"
                          >

                          <button
                            type="button"
                            disabled={isDisabled}
                            className={[
                              "odd-button",
                              isSelected ? "selected-odd" : "",
                              isDisabled ? "locked-odd" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            onClick={() => handleOddSelect(odd)}
                          >
                            {isDisabled ? (
                              <FaLock className="lock-icon" />
                            ) : Number.isFinite(oddsValue) ? (
                              oddsValue.toFixed(2)
                            ) : (
                              "-"
                            )}
                          </button>

                          </td>

                        );

                      }
                    )}


                    {/* =========================================
                        MORE MARKETS
                    ========================================= */}

                    <td className="more-column">

                      <button
                        type="button"
                        className="more-odds-button"
                        onClick={() =>
                          handleMoreClick(row)
                        }
                        aria-label={`More markets for ${row.home} vs ${row.away}`}
                      >
                        +
                      </button>

                    </td>

                  </tr>

                );

              }
            )}


            {/* ==================================================
                NO EVENTS
            ================================================== */}

            {groupedRows.length === 0 && (

              <tr>

                <td
                  colSpan={columnCount}
                  className="no-events"
                >

                  {date === "tomorrow"
                    ? "No events available for tomorrow"
                    : "No events found"}

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}