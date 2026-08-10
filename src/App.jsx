
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import { SportsProvider } from "./contexts/SportsContext.jsx";

import PageHeader from "./components/PageHeader/PageHeader.jsx";
import LeaguePanel from "./components/LeaguePanel/LeaguePanel.jsx";
import EventsPage from "./pages/EventsPage/EventsPage.jsx";
import Betslips from "./components/Betslips/Betslips.jsx";
import Footer from "./components/Footer/Footer.jsx";

import "./App.css";


function App() {

  return (

    <SportsProvider>

      <Router>
        <PageHeader />
        <Routes>

          <Route
            path="/"
            element={

              <div className="sports-layout">

                
                {/**left side panel/league panel */}

                <LeaguePanel />


                {/**main page/event page */}

                <main className="events-section">

                  <EventsPage />

                </main>

                {/**betslip section */}

                <aside className="betslip-section">

                  <Betslips />

                </aside>

              </div>

            }
          />

        </Routes>
        <Footer/>

      </Router>

    </SportsProvider>

  );

}


export default App;

