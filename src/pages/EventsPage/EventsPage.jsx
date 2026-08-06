
import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import EventBoard from "../../components/EventBoard/EventBoard.jsx";
import MoreMarkets from "../../components/MoreMarket/MoreMarkets.jsx";
import { feedData } from "../../data/feedData.js";

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


const EventsPage = ({
  feed,
  onOddSelect,
  activeMenu,
  selectedOdds,
  onMoreClick,
}) => {

  // ============================================================
  // STATE
  // ============================================================

  const [date, setDate] = useState("today");

  const [market, setMarket] = useState("3");

  const [search, setSearch] = useState("");

  const [selectedLeague, setSelectedLeague] =
    useState(null);
  const [selectedEvent,setSelectedEvent] = useState(null);


  // ============================================================
  // ACTIVE MARKET NAME
  // ============================================================

  /*const activeMarketName = useMemo(() => {

    const selectedMarket =
      marketOptions.find(
        (option) =>
          option.value === market
      );

    return (
      selectedMarket?.label ||
      "Match Result (1X2)"
    );

  }, [market]);*/

  const activeMarketName = 
    marketOptions.find(
        (item)=>item.value === market
    )?.label || "Match Result";


  // ============================================================
  // FEED
  // ============================================================

  const filteredFeed = useMemo(() => {

    const result = {};
    Object.entries(feedData).forEach(
        ([leagueName,leagueEvents])=>{
            if(selectedLeague &&
                selectedLeague.name !== leagueName 
            )
            {
                return;
            }
            const filteredEvents = {};

            //events
            Object.entries(leagueEvents).forEach(
                ([eventKey,event])=>{

                    //search
                    const searchValue = 
                    search.trim().toLowerCase();

                    if(searchValue)
                    {
                        const home = 
                        String(event.home || "")
                        .toLowerCase();

                        const away =
                        String(event.away || "")
                        .toLowerCase();

                        const league = 
                        String(event.league ||
                            leagueName || ""
                        ).toLowerCase();

                        const matchesSearch = 
                        home.includes(searchValue) ||
                        away.includes(searchValue) ||
                        league.includes(searchValue) ||
                        leagueName 
                        .toLowerCase()
                        .includes(searchValue);

                        if(!matchesSearch)
                        {
                            return;
                        }
                    }

                    //date filter
                    if(date !== "all")
                    {
                        const eventDate = 
                        String(
                            event.date || ""
                        ).toLowerCase();

                        if(date === "today" && !eventDate.includes("today"))
                        {

                        }
                        if(
                            date === "tomorrow" && 
                            eventDate.includes("today")
                                
                        )
                        {
                            return;
                        }
                    }
                    //market
                    const selectedMarket = 
                    event.markets?.[market];
                    if(!selectedMarket)
                    {
                        return;
                    }
                    //add event
                    filteredEvents[eventKey] = event;
                }
            );

            if(Object.keys(filteredEvents).length>0)
            {
                result[leagueName] = filteredEvents;
            }
        }
    );
    return result;

  }, [selectedLeague,market,search,date]);


  // ============================================================
  // SEARCH
  // ============================================================

  const clearSearch = () => {

    setSearch("");

  };


  // ============================================================
  // CLEAR LEAGUE
  // ============================================================

  const clearLeague = () => {

    setSelectedLeague(null);

  };


  // ============================================================
  // SELECTED MARKET CHANGE
  // ============================================================

  const handleMarketChange = (event) => {

    setMarket(event.target.value);

  };
  const handleMoreClick =()=>{
    setSelectedEvent(event);
  };

  const handleBack = ()=>{
    setSelectedEvent(null);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section className="events-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="events-page-header">


        {/* ====================================================
            MARKET TITLE
        ==================================================== */}

        <div className="market-header">

          <h3> {selectedLeague ? `${selectedLeague.name} - ${activeMarketName}` : activeMenu === "live" ? `Live - ${activeMarketName}` : activeMenu === "football" ? `Football - ${activeMarketName}` : activeMarketName } </h3>

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
              setDate(event.target.value)
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
            onChange={handleMarketChange}
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
              SEARCH INPUT
          ================================================== */}

          <div className="search-wrapper">

            <FaSearch className="search-icon" />

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
              onClick={clearLeague}
            >
              All
            </button>

          )}

        </div>

      </div>


      {/* ======================================================
          EVENTS
      ====================================================== */}

      <div className="events-page-content">

        {selectedEvent? (
            <MoreMarkets
            event={selectedEvent}
            onBack={()=>setSelectedEvent(null)}
            setSelectedOdds={selectedOdds}/>
        ):(

        <EventBoard
          feed={filteredFeed}
          marketId={market}
          onOddSelect={onOddSelect}
          selectedOdds={selectedOdds}
          onMoreClick={(event)=>setSelectedEvent(event)}
        />
        )}

      </div>

    </section>

  );

};


export default EventsPage;

