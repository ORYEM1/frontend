import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { feedData } from "../data/feedData.js";

// ============================================================
// CONTEXT
// ============================================================

const SportsContext = createContext(null);

// ============================================================
// DEFAULT MARKETS
// ============================================================

const defaultMarkets = {
  football: "3",
  basketball: "3",
  tennis: "3",
  volleyball: "3",
  rugby: "3",
};

// ============================================================
// PROVIDER
// ============================================================

export const SportsProvider = ({ children }) => {

  // ==========================================================
  // SPORT
  // ==========================================================

  const [activeSport, setActiveSport] =
    useState("football");

  // ==========================================================
  // EVENT MENU
  // ==========================================================

  const [activeMenu, setActiveMenu] =
    useState("incoming");

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [date, setDate] =
    useState("all");

  const [market, setMarket] =
    useState("3");

  const [search, setSearch] =
    useState("");

  // ==========================================================
  // LEAGUE
  // ==========================================================

  const [selectedLeague, setSelectedLeague] =
    useState(null);

  // ==========================================================
  // MORE MARKETS
  // ==========================================================

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  // ==========================================================
  // BETSLIP
  // ==========================================================

  const [bets, setBets] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem("bets");

        if (!saved) {
          return [];
        }

        const parsed =
          JSON.parse(saved);

        return Array.isArray(parsed)
          ? parsed
          : [];

      } catch (error) {

        console.error(
          "Unable to load saved bets:",
          error
        );

        return [];
      }

    });


  const [selectedOdds, setSelectedOdds] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem(
            "selectedOdds"
          );

        if (!saved) {
          return {};
        }

        const parsed =
          JSON.parse(saved);

        return parsed &&
          typeof parsed === "object"
          ? parsed
          : {};

      } catch (error) {

        console.error(
          "Unable to load selected odds:",
          error
        );

        return {};
      }

    });


  // ==========================================================
  // SPORT CHANGE
  // ==========================================================

  const changeActiveSport = (sport) => {

    if (!sport) {
      return;
    }

    setActiveSport(sport);

    // Clear previous sport league
    setSelectedLeague(null);

    // Close More Markets
    setSelectedEvent(null);

    // Reset filters
    setDate("all");
    setSearch("");

    // Set default market for sport
    setMarket(
      defaultMarkets[sport] || "3"
    );

  };


  // ==========================================================
  // EVENT MENU CHANGE
  // ==========================================================

  const changeActiveMenu = (menu) => {

    setActiveMenu(menu);

    // A menu change removes
    // a previously selected league.
    setSelectedLeague(null);

    // Close More Markets
    setSelectedEvent(null);

  };


  // ==========================================================
  // SELECT LEAGUE
  // ==========================================================

  const selectLeague = (league) => {

    if (!league) {
      return;
    }

    setSelectedLeague(league);

    // Close More Markets
    setSelectedEvent(null);

  };


  // ==========================================================
  // CLEAR LEAGUE
  // ==========================================================

  const clearLeague = () => {

    setSelectedLeague(null);

  };


  // ==========================================================
  // MORE MARKETS
  // ==========================================================

  const openMoreMarkets = (event) => {

    if (!event) {
      return;
    }

    setSelectedEvent(event);

  };


  const closeMoreMarkets = () => {

    setSelectedEvent(null);

  };


  // ==========================================================
  // SEARCH
  // ==========================================================

  const clearSearch = () => {

    setSearch("");

  };


  // ==========================================================
  // FIND EVENT
  // ==========================================================

  const findEventById = (eventId) => {

    const targetId =
      String(eventId);

    for (
      const leagueEvents
      of Object.values(feedData)
    ) {

      for (
        const event
        of Object.values(leagueEvents)
      ) {

        if (
          String(event.id) ===
          targetId
        ) {

          return event;

        }

      }

    }

    return null;

  };


  // ==========================================================
  // SELECT ODDS
  // ==========================================================

  const selectOdd = (selection) => {

    if (!selection) {
      return;
    }

    const eventId =
      String(selection.eventId);

    const event =
      findEventById(eventId);

    if (!event) {

      console.error(
        "Event not found:",
        eventId
      );

      return;
    }


    // ========================================================
    // CREATE BET
    // ========================================================

    const bet = {

      ...selection,

      event:
        `${event.home} - ${event.away}`,

      home:
        event.home,

      away:
        event.away,

      league:
        event.league,

      time:
        event.kickoff_time,

      /*
       * Important:
       * Keep both names available.
       */

      market:
        selection.market_name ||
        selection.marketName ||
        "",

      market_name:
        selection.market_name ||
        selection.marketName ||
        "",

    };


    // ========================================================
    // SAME ODDS SELECTED
    // ========================================================

    if (
      selectedOdds[eventId]?.id ===
      selection.id
    ) {

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


      setBets((current) => {

        const updated =
          current.filter(
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


    // ========================================================
    // SAVE SELECTED ODDS
    // ========================================================

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


    // ========================================================
    // REPLACE BET FOR SAME EVENT
    // ========================================================

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
          item.id === id
      );

    if (!bet) {
      return;
    }


    const eventId =
      String(bet.eventId);


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


    setBets((current) => {

      const updated =
        current.filter(
          (item) =>
            item.id !== id
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

    localStorage.removeItem(
      "bets"
    );

    localStorage.removeItem(
      "selectedOdds"
    );

  };


  // ==========================================================
  // LOAD TICKET
  // ==========================================================

  const loadTicket = (loadedBets) => {

    if (!Array.isArray(loadedBets)) {
      return;
    }

    const newSelectedOdds = {};


    loadedBets.forEach((bet) => {

      newSelectedOdds[
        String(bet.eventId)
      ] = bet;

    });


    setBets(loadedBets);

    setSelectedOdds(
      newSelectedOdds
    );


    localStorage.setItem(
      "bets",
      JSON.stringify(
        loadedBets
      )
    );


    localStorage.setItem(
      "selectedOdds",
      JSON.stringify(
        newSelectedOdds
      )
    );

  };


  // ==========================================================
  // FILTER FEED
  // ==========================================================

  const filteredFeed = useMemo(() => {

    const result = {};

    const searchValue =
      search
        .trim()
        .toLowerCase();


    Object.entries(feedData).forEach(
      ([leagueName, leagueEvents]) => {

        // ====================================================
        // LEAGUE FILTER
        // ====================================================

        if (
          selectedLeague &&
          selectedLeague.name !==
            leagueName
        ) {

          return;

        }


        const filteredEvents = {};


        Object.entries(
          leagueEvents
        ).forEach(
          ([eventKey, event]) => {

            // ==============================================
            // SPORT FILTER
            // ==============================================

            const eventSport =
              String(
                event.sport || ""
              ).toLowerCase();


            if (
              eventSport !==
              activeSport.toLowerCase()
            ) {

              return;

            }


            // ==============================================
            // LIVE
            // ==============================================

            if (
              activeMenu === "live" &&
              !event.live
            ) {

              return;

            }


            // ==============================================
            // SEARCH
            // ==============================================

            if (searchValue) {

              const home =
                String(
                  event.home || ""
                ).toLowerCase();


              const away =
                String(
                  event.away || ""
                ).toLowerCase();


              const league =
                String(
                  event.league ||
                  leagueName ||
                  ""
                ).toLowerCase();


              const matchesSearch =
                home.includes(
                  searchValue
                ) ||
                away.includes(
                  searchValue
                ) ||
                league.includes(
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


            // ==============================================
            // DATE
            // ==============================================

            if (date !== "all") {

              const eventDate =
                String(
                  event.date || ""
                ).toLowerCase();


              if (
                date === "today" &&
                !eventDate.includes(
                  "today"
                )
              ) {

                return;

              }


              if (
                date === "tomorrow" &&
                !eventDate.includes(
                  "tomorrow"
                )
              ) {

                return;

              }

            }


            // ==============================================
            // MARKET
            // ==============================================

            if (
              !event.markets?.[market]
            ) {

              return;

            }


            // ==============================================
            // KEEP EVENT
            // ==============================================

            filteredEvents[eventKey] =
              event;

          }
        );


        // ====================================================
        // KEEP LEAGUE
        // ====================================================

        if (
          Object.keys(
            filteredEvents
          ).length > 0
        ) {

          result[leagueName] =
            filteredEvents;

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

    // Sport
    activeSport,
    setActiveSport:
      changeActiveSport,

    // Menu
    activeMenu,
    setActiveMenu:
      changeActiveMenu,

    // Filters
    date,
    setDate,

    market,
    setMarket,

    search,
    setSearch,

    clearSearch,

    // League
    selectedLeague,
    selectLeague,
    clearLeague,

    // More markets
    selectedEvent,
    openMoreMarkets,
    closeMoreMarkets,

    // Feed
    filteredFeed,

    // Betslip
    bets,
    selectedOdds,

    selectOdd,
    removeBet,
    clearBetslip,
    loadTicket,
  };


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
    useContext(SportsContext);

  if (!context) {

    throw new Error(
      "useSports must be used inside SportsProvider"
    );

  }

  return context;

};