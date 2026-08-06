import "./EventBoard.css";


function EventBoard({
  feed,
  marketId = "3",
  onOddSelect,
  selectedOdds,
  onMoreClick,
}) {


  return (

    <div className="event-board">


      {
        Object.entries(feed || {}).map(
          ([leagueName, leagueEvents]) => {


            const events =
              Object.entries(leagueEvents || {});



            if(events.length === 0)
            {
              return null;
            }




            // ==================================================
            // FIRST EVENT
            // ==================================================

            const firstEvent =
              events[0]?.[1];





            // ==================================================
            // MARKET
            // ==================================================

            const mainMarket =
              firstEvent?.markets?.[marketId];





            // ==================================================
            // HEADERS
            // ==================================================

            const headers =

              mainMarket?.headers

              ?

              mainMarket.headers
              .split(",")
              .map(header=>header.trim())

              :

              [];







            return (


              <section

                key={leagueName}

                className="league-group"

              >




                {/* =============================================
                    LEAGUE HEADER
                ============================================== */}



                <div className="league-header">



                  <div className="league-name">

                    <strong>
                      {leagueName}
                    </strong>


                  </div>







                  <div className="league-market-headers">


                    {
                      headers.map(header=>(


                        <div

                          key={header}

                          className="market-header"

                        >

                          {header}


                        </div>


                      ))
                    }



                  </div>








                  <div className="league-more">

                    <span>
                      More
                    </span>


                  </div>




                </div>








                {/* =============================================
                    EVENTS
                ============================================== */}



                <div className="league-events">



                {

                events.map(
                  ([eventKey,event])=>{



                    const eventMarket =
                      event.markets?.[marketId];



                    const eventBets =
                      eventMarket?.bets || {};





                    const selectedBet =
                      selectedOdds?.[
                        String(event.id)
                      ];







                    return (



                      <div

                        key={
                          event.id ||
                          eventKey
                        }

                        className="event-row"

                      >






                        {/* TIME */}


                        <div className="event-time">


                          {
                            event.kickoff_time
                            ||
                            "--:--"
                          }


                        </div>









                        {/* TEAMS */}



                        <div className="event-teams">



                          <div className="home-team">


                            <strong>

                              {event.home}

                            </strong>


                          </div>





                          <div className="away-team">


                            <strong>

                              {event.away}

                            </strong>


                          </div>



                        </div>









                        {/* ODDS */}



                        <div className="event-odds">



                        {


                        headers.map(header=>{



                          const bet =
                            eventBets[header];





                          if(!bet)
                          {


                            return (


                              <button

                                key={header}

                                type="button"

                                className="
                                  odd-button
                                  odd-unavailable
                                "

                                disabled

                              >

                                -

                              </button>


                            );

                          }








                          const isSelected =

                            selectedBet?.id ===
                            bet.id;






                          const isLocked =

                            String(
                              bet.locked
                            ) === "1";







                          const isBlocked =

                            String(
                              event.blocked
                            ) === "1";








                          return (


                            <button


                              key={header}


                              type="button"



                              className={

                              `odd-button

                              ${
                                isSelected
                                ?
                                "odd-selected"
                                :
                                ""
                              }


                              ${
                                isLocked ||
                                isBlocked

                                ?

                                "odd-locked"

                                :

                                ""

                              }

                              `

                              }




                              disabled={

                                isLocked ||
                                isBlocked

                              }





                              onClick={()=>{


                                onOddSelect?.({


                                  ...bet,



                                  // EVENT DATA

                                  eventId:
                                    event.id,


                                  home:
                                    event.home,


                                  away:
                                    event.away,


                                  league:
                                    event.league ||
                                    leagueName,



                                  sport:
                                    event.sport,



                                  kickoff_time:
                                    event.kickoff_time,



                                  eventDate:
                                    event.date,





                                  // MARKET DATA


                                  marketId,


                                  marketName:

                                    eventMarket
                                    ?.market_name
                                    ||
                                    "",


                                });


                              }}



                            >



                              {bet.odds}



                            </button>


                          );



                        })


                        }



                        </div>









                        {/* MORE MARKETS */}



                        <div className="event-more">


                          <button


                            type="button"


                            className="more-button"



                            onClick={()=>{

                              onMoreClick?.(
                                event
                              );

                            }}




                            aria-label={

                              `More markets for ${
                                event.home
                              } vs ${
                                event.away
                              }`

                            }


                          >

                            +


                          </button>


                        </div>






                      </div>



                    );



                  }

                )


                }



                </div>






              </section>



            );



          }

        )

      }



    </div>


  );


}



export default EventBoard;