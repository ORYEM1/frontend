import {
  NavLink,Link,useNavigate
} from "react-router-dom";

import {
  FaFutbol,
  FaBasketballBall,
  FaTableTennis,
  FaVolleyballBall,
  FaFootballBall,
  FaUser,
  FaLock
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

  const navigate = useNavigate();

  const handleSportSelect = (sportId) => {

    setActiveSport(sportId);

    navigate("/");

  };

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
          <Link to={'/'}>
          <strong>
            <img src="/logo.webp" alt="Logo" />
          </strong>
          </Link>

        </div>


        {/* ==================================================
            AUTH
        ================================================== */}

        <div className="sports-header-auth">

          <NavLink
            to="/register"
            className="register-button"
          > 
            <FaUser/>
            Register
          </NavLink>


          <NavLink
            to="/login"
            className="login-button"
          >
            <FaLock/>
            Login
          </NavLink>

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
              handleSportSelect(
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
