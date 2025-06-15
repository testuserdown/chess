import React, { useState, useEffect, useRef } from "react";
import "../index.scss";
import loading from "../../assets/loading.gif";

// Dummy players:
const players = [
  "Takashi",
  "Aiko",
  "Yuzu",
  "PixelPanda",
  "Hiro",
  "Renji",
  "Miyuki",
  "Luna",
  "Haruka",
  "Shun",
];

// Random helper:
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Event generator:
const generateEvent = () => {
  const eventTypes = [
    () => ({
      type: "MATCH",
      players: [getRandom(players), getRandom(players)],
    }),
    () => ({ type: "CHALLENGE", player: getRandom(players), challenge: true }),
    () => ({ type: "CHECK", player: getRandom(players) }),
    () => ({
      type: "STREAK",
      player: getRandom(players),
      streak: Math.floor(Math.random() * 5) + 2,
    }),
    () => ({ type: "JOIN", player: getRandom(players) }),
  ];
  return getRandom(eventTypes)();
};

export const GlobalChat = () => {
  const [events, setEvents] = useState([]);
  const [popup, setPopup] = useState(null);
  const contentRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => [...prev, generateEvent()]);
    }, Math.floor(Math.random() * 3000) + 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [events]);

  const renderLine = (event) => {
    switch (event.type) {
      case "MATCH":
        return (
          <span className="df fw aic gap-10">
            🔥 Match started between{" "}
            <span className="name">{event.players[0]}</span> and{" "}
            <span className="name">{event.players[1]}</span>.
          </span>
        );
      case "CHALLENGE":
        return (
          <span className="df fw aic gap-10">
            ⚔️ <span className="name">{event.player}</span> has issued a global
            challenge!
          </span>
        );
      case "CHECK":
        return (
          <span className="df fw aic gap-10">
            🎯 <span className="name">{event.player}</span> delivered a check!
          </span>
        );
      case "STREAK":
        return (
          <span className="df fw aic gap-10">
            🏆 <span className="name">{event.player}</span> increased their win
            streak to {event.streak}.
          </span>
        );
      case "JOIN":
        return (
          <span className="df fw aic gap-10">
            🚀 <span className="name">{event.player}</span> joined a new room.
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="global-chat">
      <div className="chat-header">
        GLOBAL LIVE <span style={{ fontSize: "1.4rem" }}>🌐</span>
      </div>

      <div className="chat-content" ref={contentRef}>
        {events.map((event, idx) => (
          <div key={idx} className="event-line">
            {renderLine(event)}
            {event.challenge && (
              <button
                className="challenge-btn"
                onClick={() =>
                  setPopup(`${event.player} challenged you to a duel!`)
                }
              >
                Accept Challenge
              </button>
            )}
          </div>
        ))}
      </div>

      {popup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>{popup}</h3>
            <button onClick={() => setPopup(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="df aic jcc loading">
      <img src={loading} alt="Loading..." />
    </div>
  );
};
