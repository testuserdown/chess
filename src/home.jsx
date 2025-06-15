import React, { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaCrown,
  FaComments,
  FaClock,
  FaChessRook,
  FaChessPawn,
  FaChessBishop,
  FaChessKing,
  FaChessQueen,
  FaChessKnight,
} from "react-icons/fa";
import "./home.scss";
import bg from "./assets/bg.png";
import { fullStartingBoard, roomSlots } from "./context/data";
import { GlobalChat, Loading } from "./components/templates";

// Board setup üretici:
const getBoardSetup = (status) => {
  if (status === "OPPONENT WAITING" || status === "NEW GAME") {
    return fullStartingBoard;
  }

  if (status === "IN PROGRESS" || status === "WATCHING") {
    const midBoard = [...fullStartingBoard];
    midBoard[28] = { type: "queen", side: "white" };
    midBoard[36] = null;
    midBoard[42] = { type: "rook", side: "black" };
    return midBoard;
  }

  return Array(64).fill(null);
};

// Taş render fonksiyonu (renkli):
const renderPiece = (piece) => {
  if (!piece) return null;

  const color = piece.side === "white" ? "#f90bed" : "#ffe600";

  const iconProps = { className: "chess-piece", style: { color } };

  switch (piece.type) {
    case "pawn":
      return <FaChessPawn {...iconProps} />;
    case "rook":
      return <FaChessRook {...iconProps} />;
    case "bishop":
      return <FaChessBishop {...iconProps} />;
    case "queen":
      return <FaChessQueen {...iconProps} />;
    case "king":
      return <FaChessKing {...iconProps} />;
    case "knight":
      return <FaChessKnight {...iconProps} />;
    default:
      return null;
  }
};

const allPlayers = [
  { name: "Takashi", code: "jp" },
  { name: "Yuzu", code: "kr" },
  { name: "PixelPanda", code: "us" },
  { name: "Haruka", code: "de" },
  { name: "Renji", code: "gb" },
  { name: "Aiko", code: "fr" },
  { name: "Luna", code: "it" },
  { name: "Hiro", code: "br" },
  { name: "Shun", code: "ca" },
  { name: "Miyuki", code: "ru" },
];

// Leaderboard generator:
const generateLeaderboard = () => {
  const shuffled = [...allPlayers].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);
  return selected
    .map((player) => ({
      ...player,
      score: Math.floor(Math.random() * 500) + 1500,
      flag: `https://flagcdn.com/w80/${player.code}.png`,
    }))
    .sort((a, b) => b.score - a.score); // skora göre sırala
};
export const App = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [onlineUsders, setOnlineUsers] = useState(432);
  const [leaders, setLeaders] = useState(generateLeaderboard());
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300000);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaders(generateLeaderboard());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate fetching online users
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev + Math.floor(Math.random() * 10 - 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeRoom) return; // sadece oyun başladığında çalışsın

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000; // her saniye azalt
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRoom]);

  const startLoading = (slot) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimer(300000); // Her yeni oyunda timer'ı sıfırla
      setActiveRoom(slot);
    }, 4000);
  };

  if (activeRoom) {
    const boardData = getBoardSetup(activeRoom.status);

    return (
      <div className="game-wrapper">
        <img src={bg} alt="background" className="background" />
        <div className="game-board">
          <div className="players-bar">
            <div className="player-info">
              <img
                src={activeRoom.players[0].avatar}
                alt="avatar"
                className="avatar"
              />
              <span className="player-name">{activeRoom.players[0].name}</span>
            </div>
            <div className="df fdc aic gap-10">
              <FaClock className="timer-icon" />
              <span className="timer">
                {Math.floor(timer / 60000)}:
                {(Math.floor(timer / 1000) % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="player-info">
              <span className="player-name">{activeRoom.players[1].name}</span>
              <img
                src={activeRoom.players[1].avatar}
                alt="avatar"
                className="avatar"
              />
            </div>
          </div>

          <div className="board-body">
            <div
              aria-label="User Login Button"
              tabindex="0"
              role="button"
              class="user-profile"
              onClick={() => setActiveRoom(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveRoom(null);
                }
              }}
            >
              <div class="user-profile-inner">
                <p>Go Back</p>
              </div>
            </div>
            <div className="chess-grid">
              {boardData.map((piece, idx) => (
                <div
                  key={idx}
                  className={`chess-cell ${
                    (Math.floor(idx / 8) + idx) % 2 === 0
                      ? "cell-light"
                      : "cell-dark"
                  }`}
                >
                  {renderPiece(piece)}
                </div>
              ))}
            </div>

            <div className="chat-box">
              <div className="chat-header">
                Live Chat <FaComments />
              </div>
              <div className="chat-content">
                <div>
                  <b>Emily:</b> Good luck!
                </div>
                <div>
                  <b>Jason:</b> Thanks, you too!
                </div>
                <div>
                  <b>Emily:</b> Nice opening 😄
                </div>
                <div>
                  <b>Jason:</b> Let’s see who wins!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOBBY
  return (
    <div className="main-layout">
      <img src={bg} alt="background" className="background" />
      <div className="left-panel">
        <div className="new-match">
          <h1 className="title">COLOR CLASH CHESS</h1>
          <small>{onlineUsders} ONLINE</small>
        </div>
        <div className="room-grid">
          {roomSlots.map((room, index) => (
            <div
              key={room.id}
              className={`room-slot slot-${index + 1} ${room.color}`}
              onClick={() => startLoading(room)}
            >
              <div className="players">
                {room.players.map((user, idx) => (
                  <img
                    key={idx}
                    src={user.avatar}
                    alt="avatar"
                    className="avatar"
                  />
                ))}
              </div>
              <div className="room-status">{room.status}</div>
            </div>
          ))}
          <button
            class="button"
            onClick={() => startLoading(roomSlots[0])}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                startLoading({ status: "NEW GAME", players: [] });
              }
            }}
          >
            <div>
              <div>
                <div>START GAME</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="right-panel">
        <GlobalChat />

        <div className="leaderboard">
          <div className="leaderboard-header">
            <div className="leaderboard-title">LEADERBOARD</div>
            <FaCrown className="crown-icon" />
          </div>

          {leaders.map((player, index) => (
            <div className="df gap-10 mt-10" key={index}>
              <FaUserAlt />
              <div className="w100 df fdc gap-5">
                <div className="df aic jcsb fs-20">
                  <span className="player-name">{player.name}</span>
                  <img
                    src={player.flag}
                    alt={player.name}
                    className="flag-icon"
                  />
                </div>
                <span className="fs-14" style={{ color: "red" }}>
                  {player.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};
