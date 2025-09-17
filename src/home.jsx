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
import { GlobalChat, Loading, UserModal } from "./components/templates";
import { RiTwitterXLine } from "react-icons/ri";

const ENV = window.__ENV || {};
const title = ENV.TITLE || "Chess Game";
const xLink = ENV.X || "https://x.com/sol_chessgame";

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

// Taş render fonksiyonu:
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

// Oyuncular:
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

// Leaderboard:
const generateLeaderboard = () => {
  const shuffled = [...allPlayers].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);
  return selected
    .map((player) => ({
      ...player,
      score: Math.floor(Math.random() * 101),
      flag: `https://flagcdn.com/w80/${player.code}.png`,
    }))
    .sort((a, b) => b.score - a.score);
};

// Room izleyici üret:
const generateRoomViewers = () => {
  return roomSlots.map((room) => ({
    ...room,
    viewers: Math.floor(Math.random() * 20) + 5,
  }));
};

export const App = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(50);
  const [leaders, setLeaders] = useState(generateLeaderboard());
  const [roomsWithViewers, setRoomsWithViewers] = useState(
    generateRoomViewers()
  );
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300000);

  // Leaderboard refresh:
  useEffect(() => {
    const interval = setInterval(
      () => setLeaders(generateLeaderboard()),
      15000
    );
    return () => clearInterval(interval);
  }, []);

  // Online users refresh:
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        let next = prev + Math.floor(Math.random() * 7 - 3);
        if (next < 35) next = 35;
        if (next > 65) next = 65;
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Room viewers refresh:
  useEffect(() => {
    const interval = setInterval(
      () => setRoomsWithViewers(generateRoomViewers()),
      10000
    );
    return () => clearInterval(interval);
  }, []);

  // Timer:
  useEffect(() => {
    if (!activeRoom) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeRoom]);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("color-clash-user");
    if (user) setAuthorized(true);
  }, []);

  const startLoading = (slot) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimer(300000);
      setActiveRoom(slot);
    }, 4000);
  };

  // GAME SCREEN
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
              tabIndex="0"
              role="button"
              className="user-profile"
              onClick={() => setActiveRoom(null)}
            >
              <div className="user-profile-inner">
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

  // LOBBY SCREEN
  return (
    <div className="main-layout">
      <img src={bg} alt="background" className="background" />
      <div className="left-panel">
        <div className="new-match">
          <h1 className="title">{title}</h1>
          <div className="df gap-10 aic">
            <small>{onlineUsers} ONLINE</small>
            <small
              className="df aic gap-10 cp"
              onClick={() => window.open(xLink, "_blank")}
            >
              Follow us <RiTwitterXLine />
            </small>
          </div>
        </div>

        <div className="room-grid">
          {roomsWithViewers.map((room, index) => (
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
              <div className="viewers-count">
                {room.viewers + 2}/{room.viewers} viewers
              </div>
            </div>
          ))}

          <button className="button" onClick={() => startLoading(roomSlots[0])}>
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
                <div className="df aic jcsb fs-14">
                  <span className="player-name">{player.name}</span>
                  <img
                    src={player.flag}
                    alt={player.name}
                    className="flag-icon"
                  />
                </div>
                <span className="fs-12" style={{ color: "red" }}>
                  {player.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && <Loading />}
      {!authorized && <UserModal onFinish={() => setAuthorized(true)} />}
    </div>
  );
};
