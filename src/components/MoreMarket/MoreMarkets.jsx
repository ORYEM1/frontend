
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

import Markets from "../Markets/Markets.jsx";
import Footer from "../Footer/Footer.jsx";

import "./MoreMarkets.css";

const MoreMarkets = ({
  event,
  onBack,
  onOddSelect,
  selectedOdds,
}) => {

  if (!event) {
    return null;
  }

  return (
    <section className="more-markets">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="more-markets-header">

        <button
          type="button"
          className="more-markets-back"
          onClick={onBack}
        >
          <FaArrowLeft />

          <span>
            Back
          </span>
        </button>


        {/* ===================================================
            EVENT INFORMATION
        =================================================== */}

        <div className="more-markets-event">

          <div className="more-market-league">
            {event.league}
          </div>


          <div className="more-markets-teams">

            <div className="more-market-home">
              {event.home}
            </div>

            <span>
              VS
            </span>

            <div className="more-market-away">
              {event.away}
            </div>

          </div>


          <div className="more-market-time">
            {event.kickoff_time || "--:--"}
          </div>

        </div>

      </div>


      {/* =====================================================
          MARKETS
      ===================================================== */}

      <div className="more-markets-content">

        <Markets
          event={event}
          selectedOdds={selectedOdds}
          onOddSelect={onOddSelect}
        />

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </section>
  );
};

export default MoreMarkets;

