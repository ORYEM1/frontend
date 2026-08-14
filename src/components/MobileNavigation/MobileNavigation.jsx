import {
  FaBars,
  FaFutbol,
  FaTicketAlt,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";

import { useSports } from "../../contexts/SportsContext.jsx";

import "./MobileNavigation.css";


const MobileNavigation = () => {

  const {
    activeMenu,
    setActiveMenu,
  } = useSports();


  const handleMenuClick = (menu) => {

    if (menu === "menu") {
      // Later we can open the side menu
      console.log("Open mobile menu");
      return;
    }

    setActiveMenu(menu);
  };


  return (
    <nav className="mobile-navigation">

      <button
        type="button"
        onClick={() => handleMenuClick("menu")}
      >
        <FaBars />

        <span>
          Menu
        </span>
      </button>


      <button
        type="button"
        onClick={() => handleMenuClick("sports")}
      >
        <FaFutbol />

        <span>
          Sports
        </span>
      </button>


      <button
        type="button"
        onClick={() => handleMenuClick("betslip")}
      >
        <FaTicketAlt />

        <span>
          Betslip
        </span>
      </button>


      <button
        type="button"
        onClick={() => handleMenuClick("mybets")}
      >
        <FaClipboardList />

        <span>
          My Bets
        </span>
      </button>


      <button
        type="button"
        onClick={() => handleMenuClick("account")}
      >
        <FaUser />

        <span>
          Account
        </span>
      </button>

    </nav>
  );
};


export default MobileNavigation;