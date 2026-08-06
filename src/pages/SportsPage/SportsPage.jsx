
import { useCallback, useState } from "react";

import { feedData } from "../../data/feedData.js";

import EventBoard from "../../components/EventBoard/EventBoard.jsx";

import "./SportsPage.css";


function SportsPage({
  onOddSelect,
  selectedOdds,
}) {

  /*
   * ============================================================
   * MORE MARKETS STATE
   * ============================================================
   *
   * We store the ORIGINAL event from the feed.
   *
   * No normalization is done here.
   */

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);


  /*
   * ============================================================
   * OPEN MORE MARKETS
   * ============================================================
   */

  const handleMoreClick = useCallback(
    (event) => {

      setSelectedEvent(event);

    },
    []
  );


  /*
   * ============================================================
   * CLOSE MORE MARKETS
   * ============================================================
   */

  const handleCloseMoreMarkets =
    useCallback(
      () => {

        setSelectedEvent(null);

      },
      []
    );


  return (

    <div className="sports-page">

      {/* ======================================================
          SPORTS HEADER
      ====================================================== */}

      <header className="sports-page-header">

        <h1>
          Football
        </h1>

      </header>


      {/* ======================================================
          EVENT BOARD
      ====================================================== */}

      <section className="sports-page-events">

        <EventBoard

          feed={feedData}

          onOddSelect={
            onOddSelect
          }

          selectedOdds={
            selectedOdds
          }

          onMoreClick={
            handleMoreClick
          }

        />

      </section>


      {/* ======================================================
          MORE MARKETS
          
          We will replace this with the real modal next.
      ====================================================== */}

      {selectedEvent && (

        <div className="more-markets-overlay">

          <div className="more-markets-box">

            <div className="more-markets-header">

              <div>

                <strong>
                  {selectedEvent.home}
                </strong>

                <span>
                  {" "}vs{" "}
                </span>

                <strong>
                  {selectedEvent.away}
                </strong>

              </div>


              <button
                type="button"
                className="more-markets-close"
                onClick={
                  handleCloseMoreMarkets
                }
              >
                ×
              </button>

            </div>


            <div className="more-markets-content">

              {Object.entries(
                selectedEvent.markets || {}
              ).map(
                ([marketId, market]) => (

                  <div
                    key={marketId}
                    className="market-preview"
                  >

                    <strong>
                      {
                        Object.values(
                          market.bets || {}
                        )[0]?.market_name ||
                        "Market"
                      }
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default SportsPage;

