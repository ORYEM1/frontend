
import {
  FaBolt,
  FaFire,
  FaClock,
  FaFutbol,
  FaTrophy,
  FaUserLock,
  FaUser,
  FaCube,
  FaGamepad,
  FaBasketballBall,
  FaDice
  

  
  
} from "react-icons/fa";

import "./PageHeader.css";


const PageHeader = ({
  activeMenu,
  onMenuChange,
}) => {

  const menuItems = [
    {
      id: "live",
      label: "Live",
      icon: <FaBolt />,
    },

    {
      id: "popular",
      label: "Popular Games",
      icon: <FaFire />,
    },

    {
      id: "incoming",
      label: "Incoming",
      icon: <FaClock />,
    },

    {
      id: "football",
      label: "Football",
      icon: <FaFutbol />,
    },

    {
      id: "competitions",
      label: "Competitions",
      icon: <FaTrophy />,
    },
    {
      id:"basketball",
      label:"Basketball",
      icon:<FaBasketballBall/>

    },
    {
      id: "esport",
      label: "e-Sports",
      icon: <FaFutbol />,
    },

    {
      id: "tennis",
      label: "Tennis",
      icon: <FaTrophy />,
    },
    {
      id:"casino",
      label:"Casino",
      icon:<FaDice/>
    },
    {
      id:"virtual",
      label:"Virtual",
      icon:<FaGamepad/>
    }

  ];


  return (
    <header className="sports-header">

      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div className="sports-header-top">


        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="sports-header-logo">

          <strong>
            <img src="logo.png" alt="" />
          </strong>

        </div>


        {/* ===================================================
            AUTH BUTTONS
        =================================================== */}

        <div className="sports-header-auth">

          <button
            type="button"
            className="header-register-button"
          >
            Register
          </button>


          <button
            type="button"
            className="header-login-button"
          >
            <FaUser/> Login
            
          </button>

        </div>

      </div>


      {/* =====================================================
          MENU
      ===================================================== */}

      <nav className="sports-header-menu">

        {menuItems.map((item) => (

          <button
            key={item.id}
            type="button"

            className={`header-menu-item ${
              activeMenu === item.id
                ? "active"
                : ""
            }`}

            onClick={() =>
              onMenuChange?.(item.id)
            }
          >

            <span className="header-menu-icon">
              {item.icon}
            </span>


            <span className="header-menu-label">
              {item.label}
            </span>

          </button>

        ))}

      </nav>

    </header>
  );
};


export default PageHeader;

