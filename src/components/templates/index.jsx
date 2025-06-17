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

// avatarları roomSlots'tan çıkartıyoruz:
const allAvatars = [
  "https://static.vecteezy.com/system/resources/previews/011/483/813/non_2x/guy-anime-avatar-free-vector.jpg",
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
  "https://static.vecteezy.com/system/resources/previews/011/483/377/non_2x/anime-girl-avatar-free-vector.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/011/484/063/small_2x/boy-anime-avatar-free-vector.jpg",
  "https://static.vecteezy.com/ti/vettori-gratis/p1/11483944-anime-ragazzo-ritratto-gratuito-vettoriale.jpg",
  "https://img.freepik.com/premium-photo/subtle-elegance-minimalistic-animestyle-user-avatar-black-female-simple-color-patterns-ve_983420-37443.jpg",
  "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/234080722/original/c99ca05f1d79fda61836b70e991fae719025cc85/create-anime-style-avatar-or-profile-picture.png",
  "https://static.vecteezy.com/system/resources/thumbnails/011/484/893/small_2x/teen-boy-anime-free-vector.jpg",
];

export const UserModal = ({ onFinish }) => {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(allAvatars[0]);

  const handleSave = () => {
    if (!username.trim()) return alert("Please enter username");
    localStorage.setItem(
      "color-clash-user",
      JSON.stringify({ username, avatar: selectedAvatar })
    );
    onFinish();
  };

  return (
    <div className="modal-overlay">
      <div className="df fdc aic gap-10 modal-content">
        <h2>Welcome to Our Platform</h2>
        <small>
          Please enter your username and select an avatar to get started.
        </small>

        <input
          type="text"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />

        <div className="avatar-grid">
          {allAvatars.map((avatar, idx) => (
            <img
              key={idx}
              src={avatar}
              alt={`avatar-${idx}`}
              className={`avatar-option ${
                selectedAvatar === avatar ? "selected" : ""
              }`}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>

        <button className="save-btn" onClick={handleSave}>
          Enter The Arena
        </button>
      </div>
    </div>
  );
};
