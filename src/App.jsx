
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

import authFormSchemas from "./data/authFormSchemas.js";
import GenericForm from "./components/GenericForm/GenericForm.jsx";

import "./App.css";


// ============================================================
// AUTH FORM ROUTE
// ============================================================

function AuthFormRoute({ formType }) {

  const formConfig = authFormSchemas[formType];

  return (
    <div className="auth-form-page">

      <GenericForm
        requestContext={formConfig}
        submitLabel={formConfig.submitLabel}
      />

    </div>
  );
}


// ============================================================
// BETTING LAYOUT
// ============================================================

function BettingLayout() {

  return (
    <div className="app">

      <PageHeader />

      <div className="sports-layout">

        {/* ==================================================
            LEFT SIDE - LEAGUES
        ================================================== */}

        <section className="league-sidebar">

          <LeaguePanel />

        </section>


        {/* ==================================================
            CENTER - EVENTS / PAGES
        ================================================== */}

        <main className="events-section">

          <Routes>

            <Route
              path="/"
              element={<EventsPage />}
            />

          </Routes>

        </main>


        {/* ==================================================
            RIGHT SIDE - BETSLIP
        ================================================== */}

        <aside className="betslip-section">

          <Betslips />

        </aside>

      </div>

    </div>
  );
}


// ============================================================
// MAIN APP
// ============================================================

function App() {

  return (

    <SportsProvider>

      <Router>

        <Routes>

          {/* ==================================================
              AUTHENTICATION PAGES
          ================================================== */}

          <Route
            path="/login"
            element={
              <AuthFormRoute
                formType="login"
              />
            }
          />

          <Route
            path="/register"
            element={
              <AuthFormRoute
                formType="register"
              />
            }
          />


          {/* ==================================================
              BETTING APPLICATION
          ================================================== */}

          <Route
            path="/*"
            element={
              <BettingLayout />
            }
          />

        </Routes>

      </Router>

    </SportsProvider>

  );
}


export default App;

