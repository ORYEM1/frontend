import { useState } from "react";

import { useSports } from "../../contexts/SportsContext.jsx";

import "./Betslips.css";




// BETSLIPS


const Betslips = () => {
  
  const {bets,removeBet,clearBetslip,filteredFeed,openMoreMarkets} = useSports();

  const [stake, setStake] = useState("");
  const [activeTab, setActiveTab] = useState("bets");
  const [bookingCode, setBookingCode] = useState("");
  const [message, setMessage] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  
  // TOTAL ODDS

  const totalOdds = bets.reduce((product, bet) => product * Number(bet.odds || 0), 1 );

 
  // POSSIBLE WIN
  
  const possibleWin = Number(stake || 0) * totalOdds;


  // FORMAT MONEY

  const formatMoney = (amount) => {
    return new Intl.NumberFormat(
      "en-UG",
      {
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  
  // REMOVE BET
 
  const handleRemove = (id) => {
    removeBet(id);
  };

  
  // CLEAR BETSLIP
  
  const handleClear = () => {
    clearBetslip();

    setMessage("");
    setStake("");
  };

  //open more market
  const handleBetEvent = (bet)=>{
    const eventId = String(bet?.eventId);
    if(!eventId)
    {
      return ;
    }
    for(const leagueEvents of Object.values(filteredFeed || {}))
    {
      for(const event of Object.values(leagueEvents || {}))
      {
        if(String(event?.id) === eventId)
        {
          openMoreMarkets(event);
          return;
        }
      }
    }
    

  }

   
  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="betslip-card">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="betslip-header">
        <h3>
          Betslip
        </h3>
        <span className="betslip-count">
          {bets.length}
        </span>
      </div>

      {/* ====================================================
          TABS
      ==================================================== */}

      <div className="betslip-tabs">

        <button
          type="button"
          className={
            activeTab === "bets"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("bets")
          }
        >
          Betslip
        </button>

        <button
          type="button"
          className={
            activeTab === "load"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("load")
          }
        >
          Load Ticket
        </button>

      </div>

      {/* ====================================================
          BETSLIP TAB
      ==================================================== */}

      {activeTab === "bets" && (

        <div className="betslip-content">

          {bets.length === 0 ? (

            <div className="empty-betslip">

              <div className="empty-icon"></div>

              <h4>
                Your betslip is empty
              </h4>

              <p>
                Select odds from the
                events to add them
                to your betslip.
              </p>

            </div>

          ) : (

            <>

              {/* ==========================================
                  BET ITEMS
              ========================================== */}

              <div className="bets-list">

                {bets.map((bet) => (

                  <div
                    key={bet.id}
                    className="bet-card"
                  >

                    <div className="bet-card-top">

                      <div className="bet-event"
                      onClick={()=>handleBetEvent(bet)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event)=>{
                        if(event.key === "Enter" || 
                          event.key === ""
                        ){
                          event.preventDefault();
                          handleBetEvent(bet);
                        }
                      }}   
                           >

                          <strong>
                            {bet.home}
                          </strong>
                          <strong>
                            {bet.away}
                          </strong>
                          
                      </div>

                      <button
                        type="button"
                        className="remove-bet"
                        onClick={() =>
                          handleRemove(
                            bet.id
                          )
                        }
                        title="Remove bet"
                      >
                        ×
                      </button>

                    </div>

                    <div className="bet-selection">

                      <span>
                        {bet.market}
                      </span>

                      <span className="bet-label">
                        {bet.label}
                      </span>

                      <strong className="bet-odd">

                        {Number(
                          bet.odds
                        ).toFixed(2)}

                      </strong>

                    </div>

                  </div>

                ))}

              </div>

              {/* ==========================================
                  STAKE
              ========================================== */}

              <div className="stake-section">

                <label>
                  Stake
                </label>

                <div className="stake-input-wrapper">

                  <span>
                    UGX
                  </span>

                  <input
                    type="number"
                    min="500"
                    value={stake}
                    onChange={(event) =>
                      setStake(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* ==========================================
                  SUMMARY
              ========================================== */}

              <div className="bet-summary">

                <div className="summary-row">

                  <span>
                    Total Odds
                  </span>

                  <strong>
                    {totalOdds.toFixed(2)}
                  </strong>

                </div>

                <div className="summary-row">

                  <span>
                    Possible Win
                  </span>

                  <strong>
                    UGX{" "}
                    {formatMoney(
                      possibleWin
                    )}
                  </strong>

                </div>

                <div className="summary-row">

                  <span>
                    Tax
                  </span>

                  <strong>
                    UGX 0
                  </strong>

                </div>

                <div className="summary-row net-win">

                  <span>
                    Net Win
                  </span>

                  <strong>
                    UGX{" "}
                    {formatMoney(
                      possibleWin
                    )}
                  </strong>

                </div>

              </div>

              {/* ==========================================
                  MESSAGE
              ========================================== */}

              {message && (

                <div className="betslip-message">
                  {message}
                </div>

              )}

              {/* ==========================================
                  ACTIONS
              ========================================== */}

              <div className="bet-actions">

                <button
                  type="button"
                  className="clear-bets-button"
                  onClick={
                    handleClear
                  }
                >
                  Clear Betslip
                </button>

                <button
                  type="button"
                  className="place-bet-button"
                  
                >
                  Place Bet
                </button>

              </div>

              <button
                type="button"
                className="book-ticket-button"
                
              >
                Book Ticket
              </button>

            </>

          )}

        </div>

      )}

      {/* ====================================================
          LOAD TICKET TAB
      ==================================================== */}

      {activeTab === "load" && (

        <div className="load-ticket-content">

          <label>
            Booking Code
          </label>

          <input
            type="text"
            placeholder="e.g. BK1753960000000"
            value={bookingCode}
            onChange={(event) =>
              setBookingCode(
                event.target.value
              )
            }
          />

          <button
            type="button"
            className="load-ticket-button"
            
          >
            Load Ticket
          </button>

          {message && (

            <div className="betslip-message">
              {message}
            </div>

          )}

        </div>

      )}
 

    </div>
  );
};

export default Betslips;