import { FaSearch } from "react-icons/fa";

import EventBoard from "../../components/EventBoard/EventBoard.jsx";
import MoreMarkets from "../../components/MoreMarket/MoreMarkets.jsx";

import { useSports } from "../../contexts/SportsContext.jsx";

import "./EventsPage.css";

// ============================================================
// MARKET OPTIONS
// ============================================================

const marketOptions = [
  {
    id: "3",
    value: "3",
    label: "Match Result (1X2)",
  },
  {
    id: "304",
    value: "304",
    label: "Both Teams To Score",
  },
  {
    id: "6",
    value: "6",
    label: "Double Chance",
  },
  {
    id: "4",
    value: "4",
    label: "Over/Under",
  },
  {
    id: "45",
    value: "45",
    label: "Odd/Even",
  },
];

// ============================================================
// EVENT CATEGORY MENU
// ============================================================

const eventMenus = [
  {
    id: "live",
    label: "Live",
  },
  {
    id: "incoming",
    label: "Incoming",
  },
  {
    id: "popular",
    label: "Popular",
  },
  {
    id: "competition",
    label: "Competitions",
  },
];

// ============================================================
// EVENTS PAGE
// ============================================================

const EventsPage = () => {
  // ==========================================================
  // SPORTS CONTEXT
  // ==========================================================

  const {
    // Menu
    activeMenu,
    setActiveMenu,

    // Feed
    filteredFeed,

    // League
    selectedLeague,
    clearLeague,

    // More markets
    selectedEvent,
    openMoreMarkets,
    closeMoreMarkets,

    // Filters
    market,
    setMarket,

    date,
    setDate,

    search,
    setSearch,

    // Betslip
    selectedOdds,
    selectOdd,
  } = useSports();

  // ==========================================================
  // ACTIVE MARKET NAME
  // ==========================================================

  const activeMarketName =
    marketOptions.find(
      (item) =>
        item.value === market
    )?.label ||
    "Match Result (1X2)";

  // ==========================================================
  // SEARCH
  // ==========================================================

  const clearSearch = () => {
    setSearch("");
  };

  // ==========================================================
  // MARKET CHANGE
  // ==========================================================

  const handleMarketChange = (event) => {
    setMarket(
      event.target.value
    );
  };

  // ==========================================================
  // EVENT MENU CHANGE
  // ==========================================================

  const handleEventMenuChange = (
    menuId
  ) => {
    setActiveMenu(menuId);
  };

  // ==========================================================
  // PAGE TITLE
  // ==========================================================

  const pageTitle =
    selectedLeague
      ? `${selectedLeague.name} - ${activeMarketName}`
      : activeMenu === "live"
      ? `Live - ${activeMarketName}`
      : activeMenu === "incoming"
      ? `Incoming - ${activeMarketName}`
      : activeMenu === "popular"
      ? `Popular - ${activeMarketName}`
      : activeMenu === "competition"
      ? `Competitions - ${activeMarketName}`
      : activeMarketName;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="events-page">

      {/* ======================================================
          EVENT CATEGORY MENU
      ====================================================== */}

      <div className="event-category-menu">

        {eventMenus.map(
          (item) => (
            <button
              key={item.id}
              type="button"
              className={
                activeMenu === item.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleEventMenuChange(
                  item.id
                )
              }
            >
              {item.label}
            </button>
          )
        )}

      </div>

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="events-page-header">

        {/* ====================================================
            MARKET TITLE
        ==================================================== */}

        <div className="market-header">

          <h3>
            {pageTitle}
          </h3>

        </div>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="filters">

          {/* ==================================================
              DATE
          ================================================== */}

          <select
            className="date-filter"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
          >
            <option value="all">
              All
            </option>

            <option value="today">
              Today
            </option>

            <option value="tomorrow">
              Tomorrow
            </option>
          </select>

          {/* ==================================================
              MARKET
          ================================================== */}

          <select
            className="market-filter"
            value={market}
            onChange={
              handleMarketChange
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

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div className="search-wrapper">

            <FaSearch
              className="search-icon"
            />

            <input
              className="search-input"
              type="text"
              placeholder="Search team or league"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={
                  clearSearch
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

          {/* ==================================================
              SEARCH BUTTON
          ================================================== */}

          <button
            className="search-button"
            type="button"
          >
            <FaSearch />

            <span>
              Search
            </span>
          </button>

          {/* ==================================================
              CLEAR LEAGUE
          ================================================== */}

          {selectedLeague && (
            <button
              className="clear-league-button"
              type="button"
              onClick={
                clearLeague
              }
            >
              All
            </button>
          )}

        </div>

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="events-page-content">

        {selectedEvent ? (

          <MoreMarkets
            event={selectedEvent}
            selectedOdds={selectedOdds}
            onBack={
              closeMoreMarkets
            }
            onOddSelect={
              selectOdd
            }
          />

        ) : (

          <EventBoard
            feed={filteredFeed}
            marketId={market}
            onOddSelect={
              selectOdd
            }
            selectedOdds={
              selectedOdds
            }
            onMoreClick={
              openMoreMarkets
            }
          />

        )}

      </div>

    </section>
  );
};

export default EventsPage;