import React from 'react'
import {FaArrowLeft} from "react-icons/fa";
import Markets from "../Markets/Markets.jsx";
import "./MoreMarkets.css";

const MoreMarkets = ({
  event,onBack,OnOddSelect,selectedOdds
}) => {
  if(!event)
  {
    return null;
  }
  return (
    <section className='more-markets'>
      <div className="more-markets-header">
        <button
        type='button'
        className='more-markets-back'
        onClick={onBack}>
          <FaArrowLeft/>
          <span>
            Back
          </span>

        </button>
        <div className="more-markets-event">
          <div className="more-market-league">
            {event.league}
          </div>
          <div className='more-markets-teams'>
            <div className='more-market-home'>
              {event.home}

            </div>
            <span>
              VS
            </span>
            <div className="more-market-away">
              {event.away}
            </div>
            <div className="more-market-time">
              {event.kickoff_time || "--:--"}
            </div>

          </div>
        </div>
        <Markets
        event={event}
        selectedOdds={selectedOdds}
        OnOddSelect={OnOddSelect}/>
      </div>

    </section>
  );
}

export default MoreMarkets