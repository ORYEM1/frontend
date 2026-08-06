import React from 'react'
import './MoreMarkets.css';
import { FaBackward } from 'react-icons/fa';

const MoreMarkets = ({event,onBack,onOddSelect,selectedOdds}) => {
    if(!event)
    {
        return null;
    }
//get markets from feed provider
const markets = 
Object.entries(
    event.markets || {}
);
//check the seleceted bet
const selectedBet = 
    selectedOdds?.[String(event.id)];
  return (
    <section className='more-markets-page'>
        {/**header */}
        <div className="more-markets-header">
            <button type='button' className='back-button' onClick={onBack}>
                <FaBackward/>
                Back
            </button>

            <div className="more-markets-event">
                <div className="more-market-league">
                    {event.league}
                </div>
                <div className="more-markets-teams">
                    <div className='more-market-home'>
                        {event.home}
                    </div>
                        
                    
                    <span>
                        vs
                    </span>
                    <div className='more-market-away'>
                        {event.away}
                    </div>
                </div>
                <div className="more-market-time">
                    {event.kickoff_time || "--:--"}
                </div>
            </div>
        </div>

        {/**market */}
        <div className="more-markets-content">
            {markets.map(
                ([marketId,market])=>{
                    const headers = 
                    market.headers
                    ? market.headers
                    .split(",")
                    .map((item)=>item.trim())
                    :[];

                    const bets = 
                    market.bets || {};

                    return(
                        <div key={marketId}
                        className='market-card'>
                            {/**market name */}
                            <div className="market-card-header">
                                <strong>
                                    {market.market_name || `Market ${marketId}`}
                                </strong>
                            </div>

                            {/**market odds */}
                            <div className="market-bets">
                                {headers.map(
                                    (header)=>{
                                        const bet = 
                                        bets[header];

                                        if(!bet)
                                        {
                                            return(
                                                <button
                                                key={header}
                                                type='button'
                                                className='
                                                more-market-odd
                                                odd-unavailable'
                                                disabled>
                                                    {header}
                                                    <span>
                                                        -
                                                    </span>
                                                </button>
                                            );
                                        }
                                        const isSelected = 
                                        selectedBet?.id === bet.id;
                                        const isLocked =
                                        String(bet.locked) === "1";

                                        const isBlocked = 
                                        String(bet.blocked) === "1";

                                        return(
                                            <button
                                            key={header}
                                            type='button'
                                            className={`more-market-odd
                                                ${isSelected? "odd-selected":""}
                                                ${isLocked || isBlocked? "odd-locked":""}`}
                                                disabled={isBlocked ||
                                                    isLocked
                                                }
                                                onClick={()=>onOddSelect?.({
                                                    ...bet,
                                                    eventId:
                                                    event.id,
                                                    home:
                                                    event.home,
                                                    away:
                                                    event.away,
                                                    league:
                                                    event.league,
                                                    kickoff_time:
                                                    event.kickoff_time,
                                                    sport:
                                                    event.sport,
                                                    eventDate:
                                                    event.eventDate,
                                                    marketId:
                                                    event.marketId,
                                                    marketName:
                                                    event.marketName,
                                                })}
                                        >
                                            
                                            <span>
                                                {header}
                                            </span>
                                            <strong>
                                                {bet.odds}
                                            </strong>
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                        </div>
                    )
                }
            )}
        </div>

    </section>
  )
}

export default MoreMarkets;