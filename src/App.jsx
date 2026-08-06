import { useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import PageHeader from "./components/PageHeader/PageHeader.jsx";
import LeaguePanel from "./components/LeaguePanel/LeaguePanel.jsx";
import Betslips from "./components/Betslips/Betslips.jsx";
import Footer from "./components/Footer/Footer.jsx";

import EventsPage from "./pages/EventsPage/EventsPage.jsx";


import "./App.css";




// ============================================================
// LOAD SAVED BETS
// ============================================================

const getSavedBets = () => {

  try {

    const saved =
      localStorage.getItem("bets");


    if(!saved)
    {
      return [];
    }


    const parsed =
      JSON.parse(saved);


    return Array.isArray(parsed)
      ? parsed
      : [];


  }
  catch(error)
  {

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
      localStorage.getItem(
        "selectedOdds"
      );


    if(!saved)
    {
      return {};
    }


    const parsed =
      JSON.parse(saved);



    return parsed &&
      typeof parsed === "object"

      ?

      parsed

      :

      {};



  }
  catch(error)
  {

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
  // ACTIVE SPORT
  // ==========================================================


  const [
    activeSport,
    setActiveSport
  ] = useState("football");






  // ==========================================================
  // SELECTED LEAGUE
  // ==========================================================


  const [
    selectedLeague,
    setSelectedLeague
  ] = useState(null);







  // ==========================================================
  // BETSLIP
  // ==========================================================


  const [
    bets,
    setBets
  ] = useState(
    getSavedBets
  );



  const [
    selectedOdds,
    setSelectedOdds
  ] = useState(
    getSavedSelectedOdds
  );








  // ==========================================================
  // SPORT CHANGE
  // ==========================================================


  const handleSportChange = (sport)=>{


    setActiveSport(
      sport.toLowerCase()
    );


    // reset league

    setSelectedLeague(null);


  };









  // ==========================================================
  // LEAGUE CHANGE
  // ==========================================================


  const handleLeagueChange = (league)=>{


    setSelectedLeague(
      league
    );


  };









  // ==========================================================
  // SELECT ODDS
  // ==========================================================


  const handleOddSelect = (selection)=>{


    if(!selection)
    {
      return;
    }




    const eventId =
      String(
        selection.eventId
      );





    const bet = {


      ...selection,



      event:

      `${selection.home} - ${selection.away}`,



      time:

      selection.kickoff_time,



      market:

      selection.marketName,


    };








    // REMOVE EXISTING SELECTION

    if(
      selectedOdds[eventId]?.id
      ===
      selection.id
    )
    {


      setSelectedOdds(current=>{


        const updated={
          ...current
        };


        delete updated[eventId];


        localStorage.setItem(
          "selectedOdds",
          JSON.stringify(updated)
        );


        return updated;

      });





      setBets(current=>{


        const updated =
          current.filter(

            item=>

            String(item.eventId)
            !==
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









    // ADD / REPLACE SELECTION


    setSelectedOdds(current=>{


      const updated={


        ...current,


        [eventId]:

          bet,


      };



      localStorage.setItem(
        "selectedOdds",
        JSON.stringify(updated)
      );



      return updated;


    });







    setBets(current=>{


      const filtered =

        current.filter(

          item=>

          String(item.eventId)
          !==
          eventId

        );



      const updated=[

        ...filtered,

        bet

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


  const handleRemoveBet=(id)=>{


    const bet =
      bets.find(
        item=>
        item.id===id
      );



    if(!bet)
    {
      return;
    }



    const eventId =
      String(
        bet.eventId
      );




    setSelectedOdds(current=>{


      const updated={
        ...current
      };


      delete updated[eventId];



      localStorage.setItem(
        "selectedOdds",
        JSON.stringify(updated)
      );


      return updated;


    });






    setBets(current=>{


      const updated=

        current.filter(

          item=>

          item.id!==id

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


  const handleClear=()=>{


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


  const handleLoadTicket=(loadedBets)=>{


    if(!Array.isArray(loadedBets))
    {
      return;
    }



    const selected={};



    loadedBets.forEach(bet=>{


      selected[
        String(bet.eventId)
      ]=bet;


    });





    setBets(
      loadedBets
    );


    setSelectedOdds(
      selected
    );



    localStorage.setItem(
      "bets",
      JSON.stringify(loadedBets)
    );


    localStorage.setItem(
      "selectedOdds",
      JSON.stringify(selected)
    );


  };









  // ==========================================================
  // MORE MARKETS
  // ==========================================================


  const handleMoreClick=(event)=>{


    console.log(
      "More markets:",
      event
    );


  };










  return (


    <Router>


      <div className="app">






        <PageHeader

          activeSport={
            activeSport
          }


          onSportChange={
            handleSportChange
          }


        />







        <Routes>


          <Route


            path="/"



            element={




              <div className="sports-layout">





                <aside className="league-section">


                  <LeaguePanel


                    activeSport={
                      activeSport
                    }


                    selectedLeague={
                      selectedLeague
                    }


                    onLeagueChange={
                      handleLeagueChange
                    }


                  />



                </aside>








                <main className="events-section">


                  <EventsPage


                    selectedLeague={
                      selectedLeague
                    }


                    activeMenu={
                      activeSport
                    }



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






        <Footer />




      </div>



    </Router>


  );


};



export default App;