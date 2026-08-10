
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
// DEFAULT MARKETS BY SPORT
// ============================================================

const defaultMarkets = {
  football: "3",
  basketball: "3",
  tennis: "3",
  volleyball: "3",
  rugby: "3",
};

// ============================================================
// NORMALIZE SPORT
// ============================================================

const normalizeSport = (sport) => {
  return String(sport || "")
    .trim()
    .toLowerCase();
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
    useState(
      defaultMarkets.football
    );

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

  const [bets, setBets] = useState(() => {

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

  // ==========================================================
  // SELECTED ODDS
  // ==========================================================

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
  // CHANGE SPORT
  // ==========================================================

  const changeActiveSport = (sport) => {

    if (!sport) {
      return;
    }

    const normalizedSport =
      normalizeSport(sport);

    console.log(
      "Changing sport to:",
      normalizedSport
    );

    setActiveSport(
      normalizedSport
    );

    // Reset sport-specific filters
    setSelectedLeague(null);

    setSelectedEvent(null);

    setDate("all");

    setSearch("");

    // Set the default market
    // for the selected sport
    setMarket(
      defaultMarkets[
        normalizedSport
      ] || "3"
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
        of Object.values(
          leagueEvents || {}
        )
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

      sport:
        event.sport,

      time:
        event.kickoff_time,

      market:
        selection.market ||
        selection.market_name ||
        selection.marketName ||
        "",

      label:
        selection.label ||
        selection.bet ||
        "",

    };

    // ========================================================
    // SAME ODDS SELECTED
    // ========================================================

    if (
      String(
        selectedOdds[eventId]?.id
      ) ===
      String(selection.id)
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
          String(item.id) ===
          String(id)
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

    const normalizedActiveSport =
      normalizeSport(
        activeSport
      );

    const searchValue =
      search
        .trim()
        .toLowerCase();

    // ========================================================
    // LOOP THROUGH LEAGUES
    // ========================================================

    Object.entries(
      feedData || {}
    ).forEach(
      ([leagueName, leagueEvents]) => {

        // ====================================================
        // SELECTED LEAGUE
        // ====================================================

        if (
          selectedLeague &&
          selectedLeague.name !==
            leagueName
        ) {

          return;

        }

        const filteredEvents = {};

        // ====================================================
        // LOOP EVENTS
        // ====================================================

        Object.entries(
          leagueEvents || {}
        ).forEach(
          ([eventKey, event]) => {

            if (!event) {
              return;
            }

            // ==============================================
            // SPORT
            // ==============================================

            const eventSport =
              normalizeSport(
                event.sport
              );

            /*
             * IMPORTANT:
             *
             * Feed:
             * "Football"
             *
             * activeSport:
             * "football"
             *
             * Both become:
             * "football"
             */

            if (
              eventSport !==
              normalizedActiveSport
            ) {

              return;

            }

            // ==============================================
            // LIVE
            // ==============================================

            if (
              activeMenu === "live"
            ) {

              if (
                String(
                  event.live
                ) !== "1"
              ) {

                return;

              }

            }

            // ==============================================
            // INCOMING
            // ==============================================

            if (
              activeMenu === "incoming"
            ) {

              if (
                String(
                  event.live
                ) === "1"
              ) {

                return;

              }

            }

            // ==============================================
            // POPULAR
            // ==============================================

            /*
             * For now Popular displays
             * all events for the selected
             * sport.
             *
             * Later we can add a proper
             * popular flag/ranking.
             */

            if (
              activeMenu === "popular"
            ) {

              // No additional filter
              // for now.

            }

            // ==============================================
            // COMPETITIONS
            // ==============================================

            if (
              activeMenu ===
              "competition"
            ) {

              // Competition filtering
              // is handled by league
              // selection.

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

              if (
                !matchesSearch
              ) {

                return;

              }

            }

            // ==============================================
            // DATE
            // ==============================================

            if (
              date !== "all"
            ) {

              const eventDate =
                String(
                  event.date || ""
                ).trim().toLowerCase();

              /*
               * Current feed examples:
               *
               * 30/07
               *
               * Therefore "today"/"tomorrow"
               * cannot be matched directly
               * against event.date.
               *
               * Until we convert the feed
               * date into a real Date object,
               * don't incorrectly remove
               * events.
               */

              if (
                eventDate === ""
              ) {

                return;

              }

            }

            // ==============================================
            // MARKET
            // ==============================================

            const eventMarkets =
              event.markets || {};

            if (
              !eventMarkets[
                String(market)
              ]
            ) {

              return;

            }

            // ==============================================
            // KEEP EVENT
            // ==============================================

            filteredEvents[
              eventKey
            ] = event;

          }
        );

        // ==================================================
        // KEEP LEAGUE
        // ==================================================

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

    // ========================================================
    // SPORT
    // ========================================================

    activeSport,

    setActiveSport:
      changeActiveSport,

    // ========================================================
    // MENU
    // ========================================================

    activeMenu,

    setActiveMenu:
      changeActiveMenu,

    // ========================================================
    // FILTERS
    // ========================================================

    date,
    setDate,

    market,
    setMarket,

    search,
    setSearch,

    clearSearch,

    // ========================================================
    // LEAGUE
    // ========================================================

    selectedLeague,

    selectLeague,

    clearLeague,

    // ========================================================
    // MORE MARKETS
    // ========================================================

    selectedEvent,

    openMoreMarkets,

    closeMoreMarkets,

    // ========================================================
    // FEED
    // ========================================================

    filteredFeed,

    // ========================================================
    // BETSLIP
    // ========================================================

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

