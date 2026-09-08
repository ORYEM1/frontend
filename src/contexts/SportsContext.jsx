import { createContext, useContext, useMemo, useState } from "react";
import { feedData } from "../data/feedData.js";

// ==========================================================
// CONTEXT
// ==========================================================

const SportsContext = createContext(null);

// ==========================================================
// MARKET OPTIONS BY SPORT
// ==========================================================

const marketOptionsBySport = {
  football: [
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
  ],

  basketball: [
    {
      id: "101",
      value: "101",
      label: "Moneyline",
    },
    {
      id: "102",
      value: "102",
      label: "Point Spread",
    },
    {
      id: "103",
      value: "103",
      label: "Total Points",
    },
  ],

  tennis: [
    {
      id: "201",
      value: "201",
      label: "Match Winner",
    },
    {
      id: "202",
      value: "202",
      label: "Total Sets",
    },
  ],

  rugby: [
    {
      id: "301",
      value: "301",
      label: "Match Result",
    },
    {
      id: "302",
      value: "302",
      label: "Total Points",
    },
  ],

  volleyball: [
    {
      id: "401",
      value: "401",
      label: "Match Winner",
    },
    {
      id: "402",
      value: "402",
      label: "Total Sets",
    },
  ],

  handball: [
    {
      id: "501",
      value: "501",
      label: "Match Result",
    },
    {
      id: "502",
      value: "502",
      label: "Total Goals",
    },
  ],
};

// ==========================================================
// DEFAULT MARKETS BY SPORT
// ==========================================================

const defaultMarkets = {
  football: "3",
  basketball: "101",
  tennis: "201",
  rugby: "301",
  volleyball: "401",
  handball: "501",
};

// ==========================================================
// NORMALIZE SPORT
// ==========================================================

const normalizeSport = (sport) => {
  return String(sport || "")
    .trim()
    .toLowerCase();
};

// ==========================================================
// PROVIDER
// ==========================================================

export const SportsProvider = ({ children }) => {
  // ========================================================
  // GLOBAL UI STATE
  // ========================================================

  const [activeSport, setActiveSport] = useState("football");

  const [activeMenu, setActiveMenu] = useState("");

  const [date, setDate] = useState("all");

  const [market, setMarket] = useState(defaultMarkets.football);

  const [search, setSearch] = useState("");

  const [selectedLeague, setSelectedLeague] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);

  // ========================================================
  // BETSLIP
  // ========================================================

  const [bets, setBets] = useState(() => {
    try {
      const saved = localStorage.getItem("bets");

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Unable to load saved bets:", error);

      return [];
    }
  });

  // ========================================================
  // SELECTED ODDS
  // ========================================================

  const [selectedOdds, setSelectedOdds] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedOdds");

      if (!saved) {
        return {};
      }

      const parsed = JSON.parse(saved);

      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      console.error("Unable to load selected odds:", error);

      return {};
    }
  });

  // ========================================================
  // CURRENT SPORT MARKETS
  // ========================================================

  const currentMarketOptions =
    marketOptionsBySport[activeSport] || [];

  // ========================================================
  // CHANGE SPORT
  // ========================================================

  const changeActiveSport = (sport) => {
    if (!sport) {
      return;
    }

    const normalizedSport = normalizeSport(sport);

    if (!marketOptionsBySport[normalizedSport]) {
      console.warn(`Unsupported sport: ${sport}`);
      return;
    }

    // ------------------------------------------------------
    // Normal sport navigation
    // ------------------------------------------------------

    setActiveSport(normalizedSport);

    setSelectedLeague(null);

    setSelectedEvent(null);

    setDate("all");

    setSearch("");

    // ------------------------------------------------------
    // Set default market
    // ------------------------------------------------------

    setMarket(
      defaultMarkets[normalizedSport]
    );
  };

  // ==========================================================
  // CHANGE EVENT MENU
  // ==========================================================

  const changeActiveMenu = (menu) => {
    setActiveMenu(menu);

    setSelectedLeague(null);

    setSelectedEvent(null);
  };

  // ==========================================================
  // SELECT LEAGUE
  // ==========================================================

  const selectLeague = (league) => {
    if (!league) {
      setSelectedLeague(null);
      return;
    }

    setSelectedLeague(league);

    setSelectedEvent(null);
  };

  // ==========================================================
  // CLEAR LEAGUE
  // ==========================================================

  const clearLeague = () => {
    setSelectedLeague(null);
  };

  // ==========================================================
  // FIND EVENT BY ID
  //
  // IMPORTANT:
  // This searches the COMPLETE feedData.
  // It does NOT depend on activeSport.
  // ==========================================================

  const findEventById = (eventId) => {
    if (eventId === undefined ||eventId === null ||eventId === "")
    {
      return null;
    }

    const targetId = String(eventId);

    // ------------------------------------------------------
    // Loop through every league
    // ------------------------------------------------------

    for (const leagueEvents of Object.values(feedData || {})) {
      // ----------------------------------------------------
      // Loop through every event in the league
      // ----------------------------------------------------

      for (const event of Object.values(leagueEvents || {})) {
        if (event &&String(event.id) === targetId) 
        {
          return event;
        }
      }
    }

    return null;
  };

  // ==========================================================
  // MORE MARKETS
  //
  // IMPORTANT:
  // This can be called from the betslip even when the
  // current active sport is different from the event sport.
  // ==========================================================

  const openMoreMarkets = (eventOrId) => {
    if (!eventOrId) {
      return;
    }

    let event = null;

    // If an actual event object was supplied
    if (typeof eventOrId === "object")
    {
      event = findEventById(eventOrId.id) || eventOrId;
    }

    else {
      event = findEventById(eventOrId);
    }

    if (!event) {
      console.error(
        "Unable to open More Markets. Event not found:",
        eventOrId
      );

      return;
    }

    // ------------------------------------------------------
    // Get the event sport
    // ------------------------------------------------------

    const eventSport = normalizeSport(
      event.sport
    );

    

    if (eventSport &&marketOptionsBySport[eventSport])
    {
      setActiveSport(eventSport);
      setMarket(defaultMarkets[eventSport]);
    }

    setSelectedLeague(null);
    setSearch("");
    setDate("all");
    setSelectedEvent(event);
  };

  // ==========================================================
  // CLOSE MORE MARKETS
  // ==========================================================

  const closeMoreMarkets = () => {setSelectedEvent(null);};

  const clearSearch = () => {
    setSearch("");
  };

  // ==========================================================
  // SELECT ODD
  // ==========================================================

  const selectOdd = (selection) => {
    if (!selection) {
      return;
    }

    const eventId = String(selection.eventId);

    // ------------------------------------------------------
    // Always find event from COMPLETE feed
    // ------------------------------------------------------

    const event = findEventById(eventId);

    if (!event) {
      console.error(
        "Event not found:",
        eventId
      );

      return;
    }

    // ======================================================
    // CREATE BET OBJECT
    // ======================================================

    const bet = {
      ...selection,

      event:`${event.home} - ${event.away}`,
      home:event.home,
      away:event.away,
      league:event.league,
      sport:event.sport,
      time:event.kickoff_time,
      market:selection.market_name,
      label:selection.label,
    };

    // ======================================================
    // SELECTING SAME ODD
    // ======================================================

    if (String(selectedOdds[eventId]?.id) ===String(selection.id))
    {
      setSelectedOdds((current) => {
        const updated = {
          ...current,
        };

        delete updated[eventId];

        localStorage.setItem(
          "selectedOdds",
          JSON.stringify(updated)
        );

        return updated;
      });

      // ----------------------------------------------------
      // Remove bet from betslip
      // ----------------------------------------------------

      setBets((current) => {
        const updated = current.filter(
          (item) =>
            String(item.eventId) !==
            eventId
        );

        localStorage.setItem(
          "bets",
          JSON.stringify(updated)
        );

        return updated;
      });

      return;
    }

    // ======================================================
    // SAVE SELECTED ODD
    // ======================================================

    setSelectedOdds((current) => {
      const updated = {
        ...current,
        [eventId]: bet,
      };

      localStorage.setItem(
        "selectedOdds",
        JSON.stringify(updated)
      );

      return updated;
    });

    // ======================================================
    // REPLACE BET FOR SAME EVENT
    // ======================================================

    setBets((current) => {
      const filtered =
        current.filter(
          (item) =>
            String(item.eventId) !==
            eventId
        );

      const updated = [
        ...filtered,
        bet,
      ];

      localStorage.setItem(
        "bets",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // ==========================================================
  // REMOVE BET
  // ==========================================================

  const removeBet = (id) => {
    const bet =
      bets.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    if (!bet) {
      return;
    }

    const eventId =
      String(bet.eventId);

    // ------------------------------------------------------
    // Remove selected odd
    // ------------------------------------------------------

    setSelectedOdds((current) => {
      const updated = {
        ...current,
      };

      delete updated[eventId];

      localStorage.setItem(
        "selectedOdds",
        JSON.stringify(updated)
      );

      return updated;
    });

    // ------------------------------------------------------
    // Remove bet
    // ------------------------------------------------------

    setBets((current) => {
      const updated =
        current.filter(
          (item) =>
            String(item.id) !==
            String(id)
        );

      localStorage.setItem(
        "bets",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // ==========================================================
  // CLEAR BETSLIP
  // ==========================================================

  const clearBetslip = () => {
    setBets([]);

    setSelectedOdds({});

    localStorage.removeItem("bets");

    localStorage.removeItem(
      "selectedOdds"
    );
  };

  // ==========================================================
  // FILTER FEED DATA
  // ==========================================================

  const filteredFeed = useMemo(() => {
    const result = {};

    const normalizedActiveSport =
      normalizeSport(activeSport);

    const searchValue = search.trim().toLowerCase();

    Object.entries(feedData || {}).forEach( ([leagueName, leagueEvents]) => {

        // ====================================================
        // SELECTED LEAGUE
        // ====================================================

        if (selectedLeague && selectedLeague.name !== leagueName)
        {
          return;
        }

        const filteredEvents = {};

        // ====================================================
        // LOOP EVENTS
        // ====================================================

        Object.entries(leagueEvents || {}).forEach(([eventKey, event]) => {

            if (!event) {
              return;
            }

            // ================================================
            // SPORT
            // ================================================

            const eventSport =
              normalizeSport(
                event.sport
              );

            if (
              eventSport !==
              normalizedActiveSport
            ) {
              return;
            }

            // ================================================
            // LIVE
            // ================================================

            if (
              activeMenu === "live" &&
              String(event.live) !== "1"
            ) {
              return;
            }

            // ================================================
            // INCOMING
            // ================================================

            if (
              activeMenu === "incoming" &&
              String(event.live) === "1"
            ) {
              return;
            }

            // ================================================
            // SEARCH
            // ================================================

            if (searchValue) {
              const home =
                String(
                  event.home || ""
                ).toLowerCase();

              const away =
                String(
                  event.away || ""
                ).toLowerCase();

              const eventLeague =
                String(
                  event.league ||
                    leagueName ||
                    ""
                ).toLowerCase();

              const region =
                String(
                  event.region || ""
                ).toLowerCase();

              const matchesSearch =
                home.includes(
                  searchValue
                ) ||
                away.includes(
                  searchValue
                ) ||
                eventLeague.includes(
                  searchValue
                ) ||
                region.includes(
                  searchValue
                ) ||
                leagueName
                  .toLowerCase()
                  .includes(
                    searchValue
                  );

              if (!matchesSearch) {
                return;
              }
            }

            // ================================================
            // DATE
            // ================================================

            if (date !== "all") {
              const eventDate =
                String(
                  event.date || ""
                ).trim();

              if (!eventDate) {
                return;
              }
            }

            // ================================================
            // MARKET
            // ================================================

            const eventMarkets =
              event.markets || {};

            if (
              !eventMarkets[
                String(market)
              ]
            ) {
              return;
            }

            // ================================================
            // ADD EVENT
            // ================================================

            filteredEvents[
              eventKey
            ] = event;
          }
        );

        if (
          Object.keys(
            filteredEvents
          ).length > 0
        ) {
          result[
            leagueName
          ] = filteredEvents;
        }
      }
    );

    return result;

  }, [
    activeSport,
    activeMenu,
    selectedLeague,
    market,
    search,
    date,
  ]);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    // --------------------------------------------------------
    // SPORT
    // --------------------------------------------------------

    activeSport,

    setActiveSport:
      changeActiveSport,

    marketOptionsBySport,

    currentMarketOptions,

    // --------------------------------------------------------
    // MENU
    // --------------------------------------------------------

    activeMenu,

    setActiveMenu:
      changeActiveMenu,

    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    date,

    setDate,

    // --------------------------------------------------------
    // MARKET
    // --------------------------------------------------------

    market,

    setMarket,

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    search,

    setSearch,

    clearSearch,

    // --------------------------------------------------------
    // LEAGUE
    // --------------------------------------------------------

    selectedLeague,

    selectLeague,

    clearLeague,

    // --------------------------------------------------------
    // EVENT
    // --------------------------------------------------------

    selectedEvent,

    openMoreMarkets,

    closeMoreMarkets,

    findEventById,

    // --------------------------------------------------------
    // FEED
    // --------------------------------------------------------

    filteredFeed,

    // --------------------------------------------------------
    // BETSLIP
    // --------------------------------------------------------

    bets,

    selectedOdds,

    selectOdd,

    removeBet,

    clearBetslip,
  };

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <SportsContext.Provider
      value={value}
    >
      {children}
    </SportsContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK
// ============================================================

export const useSports = () => {
  const context =
    useContext(
      SportsContext
    );

  if (!context) {
    throw new Error(
      "useSports must be used inside SportsProvider"
    );
  }

  return context;
};