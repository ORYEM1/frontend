import {
  FaFutbol,
  FaBasketballBall,
  FaTableTennis,
  FaVolleyballBall,
  FaFootballBall,
  FaTrophy,
  FaUser,
} from "react-icons/fa";

import {
  useSports,
} from "../../contexts/SportsContext.jsx";

import "./PageHeader.css";

const PageHeader = () => {

  const {
    activeSport,
    setActiveSport,
  } = useSports();

  // ==========================================================
  // SPORTS
  // ==========================================================

  const sports = [
    {
      id: "football",
      label: "Football",
      icon: <FaFutbol />,
    },
    {
      id: "basketball",
      label: "Basketball",
      icon: <FaBasketballBall />,
    },
    {
      id: "tennis",
      label: "Tennis",
      icon: <FaTableTennis />,
    },
    {
      id: "volleyball",
      label: "Volleyball",
      icon: <FaVolleyballBall />,
    },
    {
      id: "rugby",
      label: "Rugby",
      icon: <FaFootballBall />,
    },
  ];

  return (
    <header className="sports-header">
      <div className="sports-header-top">
        <div className="sports-logo">

          <strong>
            <img src="/logo.png" alt="Logo" />
          </strong>

        </div>


        {/* ==================================================
            AUTH
        ================================================== */}

        <div className="sports-header-auth">

          <button
            type="button"
            className="register-button"
          >
            Register
          </button>


          <button
            type="button"
            className="login-button"
          >
            <FaUser/>
            Login
          </button>

        </div>

      </div>


      {/* ==================================================
          SPORTS MENU
      ================================================== */}

      <nav className="sports-header-menu">

        {sports.map((sport) => (

          <button
            key={sport.id}
            type="button"

            className={`
              header-menu-item
              ${
                activeSport === sport.id
                  ? "active"
                  : ""
              }
            `}

            onClick={() =>
              setActiveSport(
                sport.id
              )
            }
          >

            <span className="header-menu-icon">
              {sport.icon}
            </span>

            <span className="header-menu-label">
              {sport.label}
            </span>

          </button>

        ))}

      </nav>

    </header>
  );
};

export default PageHeader;