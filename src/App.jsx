
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import { SportsProvider } from "./contexts/SportsContext.jsx";

import PageHeader from "./components/PageHeader/PageHeader.jsx";
import LeaguePanel from "./components/LeaguePanel/LeaguePanel.jsx";
import EventsPage from "./pages/EventsPage/EventsPage.jsx";
import Betslips from "./components/Betslips/Betslips.jsx";
import Footer from "./components/Footer/Footer.jsx";
import authFormSchemas from "./data/authFormSchemas.js";
import GenericForm from "./components/GenericForm/GenericForm.jsx";

import "./App.css";

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

function App() {

 return (
  <SportsProvider>

    <Router>

      <div className="app">

        <PageHeader />

        <div className="sports-layout">

          <section className="league-section">
            <LeaguePanel />
          </section>

          <main className="events-section">
            <Routes>

              <Route
                path="/"
                element={<EventsPage />}
              />

              <Route
                path="/register"
                element={<AuthFormRoute formType="register" />}
              />

              <Route
                path="/login"
                element={<AuthFormRoute formType="login" />}
              />

            </Routes>
          </main>

          <aside className="betslip-section">
            <Betslips />
          </aside>

        </div>

        <Footer />

      </div>

    </Router>

  </SportsProvider>
);

}


export default App;
