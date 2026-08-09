import { useState } from "react";

import { useSports } from "../../contexts/SportsContext.jsx";

import "./Betslips.css";

// ============================================================
// BOOKING CODE
// ============================================================

const createBookingCode = () => {
  return `BK${Date.now()}`;
};

// ============================================================
// BETSLIPS
// ============================================================

const Betslips = () => {
  // ==========================================================
  // SPORTS CONTEXT
  // ==========================================================

  const {
    bets,
    removeBet,
    clearBetslip,
    loadTicket,
  } = useSports();

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [stake, setStake] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("bets");

  const [bookingCode, setBookingCode] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [bookingResult, setBookingResult] =
    useState(null);

  // ==========================================================
  // TOTAL ODDS
  // ==========================================================

  const totalOdds = bets.reduce(
    (product, bet) =>
      product *
      Number(bet.odds || 0),
    1
  );

  // ==========================================================
  // POSSIBLE WIN
  // ==========================================================

  const possibleWin =
    Number(stake || 0) *
    totalOdds;

  // ==========================================================
  // FORMAT MONEY
  // ==========================================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat(
      "en-UG",
      {
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  // ==========================================================
  // REMOVE BET
  // ==========================================================

  const handleRemove = (id) => {
    removeBet(id);
  };

  // ==========================================================
  // CLEAR BETSLIP
  // ==========================================================

  const handleClear = () => {
    clearBetslip();

    setMessage("");
    setStake("");
  };

  // ==========================================================
  // PLACE BET
  // ==========================================================

  const handlePlaceBet = () => {
    if (bets.length === 0) {
      setMessage(
        "Please select at least one bet."
      );

      return;
    }

    if (
      !stake ||
      Number(stake) < 500
    ) {
      setMessage(
        "Minimum stake is UGX 500."
      );

      return;
    }

    const ticket = {
      bets,

      stake:
        Number(stake),

      totalOdds:
        Number(
          totalOdds.toFixed(2)
        ),

      possibleWin:
        Number(
          possibleWin.toFixed(2)
        ),

      eventCount:
        bets.length,

      createdAt:
        new Date().toISOString(),
    };

    console.log(
      "Bet ticket:",
      ticket
    );

    setMessage(
      "Bet submitted successfully."
    );
  };

  // ==========================================================
  // BOOK TICKET
  // ==========================================================

  const handleBookTicket = () => {
    if (bets.length === 0) {
      setMessage(
        "Please select at least one bet."
      );

      return;
    }

    const newBookingCode =
      createBookingCode();

    const booking = {
      bookingCode:
        newBookingCode,

      bets: bets.map(
        (bet) => ({
          ...bet,

          odds:
            Number(
              Number(
                bet.odds
              ).toFixed(2)
            ),
        })
      ),

      totalOdds:
        Number(
          totalOdds.toFixed(2)
        ),

      eventCount:
        bets.length,

      createdAt:
        new Date().toISOString(),
    };

    const existingBookings =
      JSON.parse(
        localStorage.getItem(
          "bookings"
        ) || "[]"
      );

    existingBookings.push(
      booking
    );

    localStorage.setItem(
      "bookings",
      JSON.stringify(
        existingBookings
      )
    );

    setBookingResult(
      newBookingCode
    );

    setMessage("");
  };

  // ==========================================================
  // COPY BOOKING CODE
  // ==========================================================

  const copyBookingCode = async () => {
    if (!bookingResult) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        bookingResult
      );

      setMessage(
        "Booking code copied."
      );
    } catch (error) {
      console.error(
        "Unable to copy booking code:",
        error
      );

      setMessage(
        "Unable to copy booking code."
      );
    }
  };

  // ==========================================================
  // LOAD TICKET
  // ==========================================================

  const handleLoadTicket = () => {
    const code =
      bookingCode.trim();

    if (!code) {
      setMessage(
        "Enter a booking code."
      );

      return;
    }

    const bookings =
      JSON.parse(
        localStorage.getItem(
          "bookings"
        ) || "[]"
      );

    const booking =
      bookings.find(
        (item) =>
          item.bookingCode ===
          code
      );

    if (!booking) {
      setMessage(
        "Invalid booking code."
      );

      return;
    }

    loadTicket(
      booking.bets
    );

    setMessage(
      "Ticket loaded successfully."
    );

    setActiveTab("bets");
  };

  // ==========================================================
  // CLOSE BOOKING RESULT
  // ==========================================================

  const closeBookingResult = () => {
    setBookingResult(null);
  };

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

                      <div className="bet-event">

                        <div className="bet-teams">

                          <strong>
                            {bet.home}
                          </strong>

                          <span>
                            vs
                          </span>

                          <strong>
                            {bet.away}
                          </strong>

                        </div>

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
                  onClick={
                    handlePlaceBet
                  }
                >
                  Place Bet
                </button>

              </div>

              <button
                type="button"
                className="book-ticket-button"
                onClick={
                  handleBookTicket
                }
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
            onClick={
              handleLoadTicket
            }
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

      {/* ====================================================
          BOOKING SUCCESS MODAL
      ==================================================== */}

      {bookingResult && (

        <div className="booking-overlay">

          <div className="booking-modal">

            <button
              type="button"
              className="booking-close"
              onClick={
                closeBookingResult
              }
            >
              ×
            </button>

            <div className="booking-success-icon">
              ✓
            </div>

            <h3>
              Ticket Booked Successfully
            </h3>

            <p>
              Your booking code is
            </p>

            <div className="booking-code">
              {bookingResult}
            </div>

            <button
              type="button"
              className="copy-code-button"
              onClick={
                copyBookingCode
              }
            >
              Copy Booking Code
            </button>

            <p className="booking-help">
              Keep your booking code safe.
              You can use it to reload
              this ticket later.
            </p>

            <button
              type="button"
              className="close-modal-button"
              onClick={
                closeBookingResult
              }
            >
              Done
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Betslips;