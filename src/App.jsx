
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { SportsProvider } from "./contexts/SportsContext.jsx";

import PageHeader from "./components/PageHeader/PageHeader.jsx";
import LeaguePanel from "./components/LeaguePanel/LeaguePanel.jsx";
import EventsPage from "./pages/EventsPage/EventsPage.jsx";
import Betslips from "./components/Betslips/Betslips.jsx";

import "./App.css";


function App() {

  return (

    <SportsProvider>

      <Router>

        {/* ================================================
            TOP HEADER
        ================================================= */}

        <PageHeader />


        {/* ================================================
            APPLICATION ROUTES
        ================================================= */}

        <Routes>

          <Route
            path="/"
            element={

              <div className="sports-layout">

                {/* ========================================
                    LEFT
                    LEAGUES
                ======================================== */}

                <LeaguePanel />


                {/* ========================================
                    CENTER
                    EVENTS
                ======================================== */}

                <main className="events-section">

                  <EventsPage />

                </main>


                {/* ========================================
                    RIGHT
                    BETSLIP
                ======================================== */}

                <aside className="betslip-section">

                  <Betslips />

                </aside>

              </div>

            }
          />

        </Routes>

      </Router>

    </SportsProvider>

  );

}


export default App;

