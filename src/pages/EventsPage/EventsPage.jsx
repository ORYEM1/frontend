import { FaSearch } from "react-icons/fa";

import EventBoard from "../../components/EventBoard/EventBoard.jsx";
import MoreMarkets from "../../components/MoreMarket/MoreMarkets.jsx";

import { useSports } from "../../contexts/SportsContext.jsx";

import "./EventsPage.css";

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
  {
    id:"result",
    label:"Results",
  }
];

// ============================================================
// EVENTS PAGE
// ============================================================

const EventsPage = () => {
  // ==========================================================
  // SPORTS CONTEXT
  // ==========================================================

  const {
    // ========================================================
    // SPORT
    // ========================================================

    activeSport,

    // ========================================================
    // MENU
    // ========================================================

    activeMenu,
    setActiveMenu,

    // ========================================================
    // FEED
    // ========================================================

    filteredFeed,

    // ========================================================
    // LEAGUE
    // ========================================================

    selectedLeague,
    clearLeague,
    selectedEvent,
    openMoreMarkets,
    closeMoreMarkets,
    market,
    setMarket,
    currentMarketOptions,
    date,
    setDate,
    search,
    setSearch,
    clearSearch,
    selectedOdds,
    selectOdd,
  } = useSports();

  const activeMarketName =
    currentMarketOptions.find(
      (item) =>
        item.value === market
    )?.label ||
    currentMarketOptions[0]?.label ||
    "Market";

  
  const handleMarketChange = (
    event
  ) => {
    setMarket(
      event.target.value
    );
  };


  const handleEventMenuChange = (
    menuId
  ) => {
    setActiveMenu(menuId);
  };

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

  
  return (
    <section className="events-page">
      <div className="event-category-menu">
        {eventMenus.map(
          (item) => (
            <button
              key={item.id}
              type="button"
              className={
                activeMenu ===
                item.id
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
      <div className="events-page-header">
        <div className="market-header">
          <h3>
            {pageTitle}
          </h3>
        </div>
        <div className="filters">
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

          {/* ================================================
              MARKET
          ================================================ */}

          <select
            className="market-filter"
            value={market}
            onChange={
              handleMarketChange
            }
          >
            {currentMarketOptions.map(
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

          {/* ================================================
              SEARCH
          ================================================ */}

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
          <button
            className="search-button"
            type="button"
          >
            <FaSearch />

            <span>
              Search
            </span>
          </button>

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

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <div className="events-page-content">

        {selectedEvent ? (
          <MoreMarkets
            event={selectedEvent}
            selectedOdds={
              selectedOdds
            }
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