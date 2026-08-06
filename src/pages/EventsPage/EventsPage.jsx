import { useMemo, useState,useEffect} from "react";
import { FaSearch } from "react-icons/fa";
import EventBoard from "../../components/EventBoard/EventBoard.jsx";
import MoreMarkets from "../../components/MoreMarket/MoreMarkets.jsx";
import { feedData } from "../../data/feedData.js";
import "./EventsPage.css";

// ============================================================
// MARKET OPTIONS
// ============================================================

const marketOptions = [

  {
    id:"3",
    value:"3",
    label:"Match Result (1X2)"
  },

  {
    id:"304",
    value:"304",
    label:"Both Teams To Score"
  },

  {
    id:"6",
    value:"6",
    label:"Double Chance"
  },

  {
    id:"4",
    value:"4",
    label:"Over/Under"
  },

  {
    id:"45",
    value:"45",
    label:"Odd/Even"
  }

];



// ============================================================
// SPORT MENUS
// ============================================================

const sportMenus = {


football:[

{
 id:"live",
 label:"Live"
},

{
 id:"incoming",
 label:"Upcoming"
},

{
 id:"popular",
 label:"Popular"
},

{
 id:"competition",
 label:"Competitions"
}

],



basketball:[

{
 id:"live",
 label:"Live"
},

{
 id:"incoming",
 label:"Upcoming"
},

{
 id:"popular",
 label:"Popular"
},

{
 id:"competition",
 label:"Leagues"
}

],



tennis:[

{
 id:"live",
 label:"Live"
},

{
 id:"incoming",
 label:"Upcoming"
},

{
 id:"popular",
 label:"Popular"
},

{
 id:"competition",
 label:"Tournaments"
}

]


};

const EventsPage = ({feed,onOddSelect,activeMenu,selectedOdds}) => {

const [eventMenu,setEventMenu] = useState("incoming");
const [date,setDate] = useState("today");
const [market,setMarket] = useState("3");
const [search,setSearch] = useState("");
const [selectedLeague,setSelectedLeague] = useState(null);
const [selectedEvent,setSelectedEvent] = useState(null);

//
// RESET CATEGORY WHEN SPORT CHANGES
//

useEffect(()=>{setEventMenu("incoming");},[activeMenu]);

// ACTIVE SPORT MENU
const eventMenus = sportMenus[ activeMenu?.toLowerCase() ] || sportMenus.football;

// MARKET NAME
const activeMarketName =marketOptions.find((item)=>item.value === market)?.label || "Match Result";

// FILTER FEED
const filteredFeed = useMemo(()=>{

  const result={};

  Object.entries(feedData)
  .forEach(

  ([leagueName,leagueEvents])=>{

    if(selectedLeague &&selectedLeague.name !== leagueName)
    return;

    const filteredEvents={};
   
    Object.entries(leagueEvents).forEach(([eventKey,event])=>{

  // SPORT FILTER

    if(event.sport?.toLowerCase() !== activeMenu?.toLowerCase())
    {
    return;
    }

    // CATEGORY FILTER

    if(eventMenu==="live")
    {
      if(!event.live)
      return;
    }

    if(eventMenu==="incoming")
    {
      if(event.live)
      return;
    }

    if(eventMenu==="popular")
    {
      if(!event.popular) 
      return;
    }

    // SEARCH

    const searchValue = search.trim().toLowerCase();

    if(searchValue)
    {
      const home = String(event.home || "") .toLowerCase();
      const away = String(event.away || "") .toLowerCase();
      const league = String( event.league || leagueName || "").toLowerCase();
      const match = home.includes(searchValue) || away.includes(searchValue) || league.includes(searchValue) || leagueName .toLowerCase() .includes(searchValue);
    
    if(!match)
    return;
    }

    // DATE FILTER
    if(date !== "all")
    {
    const eventDate =
    String(
    event.date || ""
    )
    .toLowerCase();

    if(date==="today"&&!eventDate.includes("today"))
    return;

    if(date==="tomorrow" && eventDate.includes("today"))
    return;
    }


    // MARKET FILTER
    const selectedMarket = event.markets?.[market];

    if(!selectedMarket)
    return;

    filteredEvents[eventKey]=event;

  }

    );

    if( Object.keys(filteredEvents).length>0)
    {
     result[leagueName]=filteredEvents;
    }
  }

);

return result;

},[activeMenu,eventMenu,selectedLeague,market,search,date]);

return (

<section className="events-page">

{/* SPORT CATEGORY MENU */}

<div className="event-category-menu">
{
  eventMenus.map((item)=>(

<button key={item.id} className={ eventMenu===item.id ? "active" : "" } onClick={()=>setEventMenu(item.id)}>

{item.label}

</button>

))

}

</div>


{/* HEADER */}

<div className="events-page-header">
<div className="market-header">
<h3>

    {
    selectedLeague
    ?
    `${selectedLeague.name} - ${activeMarketName}`
    :
    `${activeMenu.toUpperCase()} - ${eventMenu.toUpperCase()} - ${activeMarketName}`
    
    }

</h3>
</div>
<div className="filters">
<select value={date} onChange={(e)=> setDate(e.target.value) } >
    <option value="all">
    All
    </option>


    <option value="today">
    Today
    </option>


    <option value="tomorrow">
    Tomorrow
    </option>   
</select>
<select value={market} onChange={(e)=> setMarket(e.target.value) }>

{
marketOptions.map(option=>(
<option key={option.id} value={option.value} >
 {option.label}
</option>
))
}
</select>

<div className="search-wrapper">
<FaSearch/>
<input value={search} placeholder="Search team or league" onChange={(e)=> setSearch(e.target.value) } />

{
search &&
<button onClick={()=>setSearch("")} > × </button>
}
</div>
</div>

</div>

{/* EVENTS */}
<div className="events-page-content">
{
selectedEvent
?
<MoreMarkets event={selectedEvent} onBack={()=> setSelectedEvent(null) } onOddSelect={onOddSelect} selectedOdds={selectedOdds} />
:
<EventBoard
  feed={filteredFeed} 
  marketId={market}
  onOddSelect={onOddSelect}
  selectedOdds={selectedOdds}
  onMoreClick={(event)=>
  setSelectedEvent(event)
}
/>
}

</div>
</section>

);

};

export default EventsPage;