
import {
  FaSearch,
  FaFire,
  FaBroadcastTower,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";

import { useEffect, useRef } from "react";

import EventBoard from "../../components/EventBoard/EventBoard.jsx";
import MoreMarkets from "../../components/MoreMarket/MoreMarkets.jsx";
import { useSports } from "../../contexts/SportsContext.jsx";

import "./EventsPage.css";


/* ============================================================
   CATEGORY MENU
============================================================ */

const eventMenus = [
  {
    id: "live",
    label: "Live",
    icon: FaBroadcastTower,
    colorClass: "live-icon",
  },
  {
    id: "incoming",
    label: "Incoming",
    icon: FaClock,
    colorClass: "incoming-icon",
  },
  {
    id: "popular",
    label: "Popular",
    icon: FaFire,
    colorClass: "popular-icon",
  },
  {
    id: "results",
    label: "Results",
    icon: FaClipboardList,
    colorClass: "results-icon",
  },
];


/* ============================================================
   EVENTS PAGE
============================================================ */

const EventsPage = () => {

  /* ==========================================================
     SPORTS CONTEXT
  ========================================================== */

  const {
    activeMenu,
    setActiveMenu,
    filteredFeed,
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


  /* ==========================================================
     EVENT BOARD REF
  ========================================================== */

  const eventBoardRef = useRef(null);

  const scrollPosition = useRef(0);


  /* ==========================================================
     OPEN MORE MARKETS
  ========================================================== */

  const handleMoreClick = (event) => {

    /*
      Save EventBoard's scroll position
      before opening More Markets.
    */

    if (eventBoardRef.current) {

      scrollPosition.current =
        eventBoardRef.current.scrollTop;

    }

    openMoreMarkets(event);
  };


  /* ==========================================================
     RESTORE EVENT BOARD SCROLL
  ========================================================== */

  useEffect(() => {

    /*
      When More Markets is closed,
      restore the previous EventBoard position.
    */

    if (
      !selectedEvent &&
      eventBoardRef.current
    ) {

      requestAnimationFrame(() => {

        eventBoardRef.current.scrollTo({
          top: scrollPosition.current,
          left: 0,
          behavior: "instant",
        });

      });

    }

  }, [selectedEvent]);


  /* ==========================================================
     ACTIVE MARKET NAME
  ========================================================== */

  const activeMarketName =
    currentMarketOptions.find(
      (item) =>
        item.value === market
    )?.label ||
    currentMarketOptions[0]?.label ||
    "Market";


  /* ==========================================================
     MARKET CHANGE
  ========================================================== */

  const handleMarketChange = (event) => {

    setMarket(
      event.target.value
    );

  };


  /* ==========================================================
     EVENT MENU CHANGE
  ========================================================== */

  const handleEventMenuChange = (menuId) => {

    setActiveMenu(menuId);

  };


  /* ==========================================================
     PAGE TITLE
  ========================================================== */

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


  /* ==========================================================
     MORE MARKETS PAGE 
  ========================================================== */

  if (selectedEvent) {

    return (

      <section className="events-page more-markets-page">

        <MoreMarkets
          event={selectedEvent}
          selectedOdds={selectedOdds}
          onBack={closeMoreMarkets}
          onOddSelect={selectOdd}
        />

      </section>

    );

  }


  /* ==========================================================
     NORMAL EVENTS PAGE
  ========================================================== */

  return (

    <section className="events-page">

      {/* ======================================================
          EVENT CATEGORY MENU
      ====================================================== */}

      <div className="event-category-menu">

        {eventMenus.map((item) => {

          const Icon = item.icon;

          return (

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

              {Icon && (
                <Icon
                  className={
                    item.colorClass || ""
                  }
                />
              )}

              <span>
                {item.label}
              </span>

            </button>

          );

        })}

      </div>


      {/* ======================================================
          EVENTS PAGE HEADER
      ====================================================== */}

      <div className="events-page-header">

        <div className="market-header">

          <h3>
            {pageTitle}
          </h3>

        </div>


        {/* ====================================================
            FILTERS
        ==================================================== */}

        <div className="filters">

          {/* DATE FILTER */}

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


          {/* MARKET FILTER */}

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


          {/* SEARCH */}

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


          {/* SEARCH BUTTON */}

          <button
            className="search-button"
            type="button"
          >

            <FaSearch />

            <span>
              Search
            </span>

          </button>


          {/* CLEAR LEAGUE */}

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
          EVENT CONTENT
      ====================================================== */}

      <div className="events-page-content">

        <div className="events-view">

          <EventBoard
            ref={eventBoardRef}
            feed={filteredFeed}
            marketId={market}
            onOddSelect={selectOdd}
            selectedOdds={selectedOdds}
            onMoreClick={handleMoreClick}
          />

        </div>

      </div>

    </section>

  );
};


export default EventsPage;

