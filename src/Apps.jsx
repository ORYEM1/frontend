
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { EventsPage } from "./pages/EventsPages/EventsPages.jsx";
import {SportsPage} from "./pages/SportsPage/SportsPage.jsx";
import Betslips from "./components/Betslips/Betslips.jsx";

import { feedData } from "./data/data.js";

import "./App.css";


// ============================================================
// FIND EVENT FROM RAW FEED
// ============================================================
//
// The feed provider structure is:
//
// league
//   -> event index
//      -> event
//         -> markets
//            -> bets
//
// We keep this structure intact in data.js.
//

const getEventFromFeed = (eventId) => {

  const targetId = String(eventId);

  for (const [leagueName, leagueEvents] of Object.entries(feedData)) {

    for (const [eventKey, event] of Object.entries(leagueEvents)) {

      if (String(event.id) === targetId) {

        return {
          ...event,
          leagueName,
          eventKey,
        };

      }

    }

  }

  return null;
};


// ============================================================
// LOAD SAVED BETS
// ============================================================

const getSavedBets = () => {

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

};


// ============================================================
// LOAD SELECTED ODDS
// ============================================================

const getSavedSelectedOdds = () => {

  try {

    const saved =
      localStorage.getItem("selectedOdds");

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

};


// ============================================================
// APP
// ============================================================

const App = () => {


  // ==========================================================
  // BETSLIP STATE
  // ==========================================================

  const [bets, setBets] =
    useState(getSavedBets);


  // ==========================================================
  // SELECTED ODDS
  // ==========================================================

  const [selectedOdds, setSelectedOdds] =
    useState(getSavedSelectedOdds);


  // ==========================================================
  // SELECT ODDS
  // ==========================================================

  const handleOddSelect = (selection) => {

    if (!selection) {
      return;
    }


    // --------------------------------------------------------
    // Find event directly from raw feed
    // --------------------------------------------------------

    const event =
      getEventFromFeed(selection.eventId);


    if (!event) {

      console.error(
        "Event not found:",
        selection.eventId
      );

      return;

    }


    const eventId =
      String(event.id);


    // --------------------------------------------------------
    // Create betslip item
    // --------------------------------------------------------

    const bet = {

      ...selection,

      eventId,

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

      market:
        selection.marketName,

    };


    // ========================================================
    // SAME ODDS SELECTED
    // ========================================================

    if (
      selectedOdds[eventId]?.id ===
      selection.id
    ) {


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
      // Remove bet from betslip
      // ------------------------------------------------------

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
    // SELECT NEW ODDS
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
    // REPLACE EXISTING BET FOR SAME EVENT
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
  // REMOVE BET FROM BETSLIP
  // ==========================================================

  const handleRemoveBet = (id) => {

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


    // --------------------------------------------------------
    // Remove selected odd
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Remove bet
    // --------------------------------------------------------

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

  const handleClear = () => {

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
  // LOAD BOOKED TICKET
  // ==========================================================

  const handleLoadTicket = (
    loadedBets
  ) => {

    if (!Array.isArray(loadedBets)) {
      return;
    }


    const newSelectedOdds = {};


    loadedBets.forEach((bet) => {

      newSelectedOdds[
        String(bet.eventId)
      ] = bet;

    });


    setBets(
      loadedBets
    );


    setSelectedOdds(
      newSelectedOdds
    );


    // --------------------------------------------------------
    // Save loaded ticket
    // --------------------------------------------------------

    localStorage.setItem(
      "bets",
      JSON.stringify(loadedBets)
    );


    localStorage.setItem(
      "selectedOdds",
      JSON.stringify(
        newSelectedOdds
      )
    );

  };


  // ==========================================================
  // MORE MARKETS
  // ==========================================================
  //
  // The + button from EventBoard will eventually call this.
  //
  // For now we simply receive the event.
  //
  // Later:
  //
  // + button
  //    ↓
  // EventBoard
  //    ↓
  // EventsPage
  //    ↓
  // App
  //    ↓
  // MoreMarketsModal
  //
  // The modal will display ALL markets belonging
  // to that particular event.
  //

  const handleMoreClick = (event) => {

    console.log(
      "More markets:",
      event
    );

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <Router>

      <Routes>

        <Route
          path="/"
          element={

            <div className="sports-layout">


              {/* ============================================
                  EVENTS
              ============================================ */}

              <main className="events-section">

                <EventsPage

                  onOddSelect={
                    handleOddSelect
                  }

                  selectedOdds={
                    selectedOdds
                  }

                  onMoreClick={
                    handleMoreClick
                  }

                />

              </main>


              {/* ============================================
                  BETSLIP
              ============================================ */}

              <aside className="betslip-section">

                <Betslips

                  bets={
                    bets
                  }

                  onRemove={
                    handleRemoveBet
                  }

                  onClear={
                    handleClear
                  }

                  onLoadTicket={
                    handleLoadTicket
                  }

                />

              </aside>


            </div>

          }

        />

      </Routes>

    </Router>

  );

};


export default App;

