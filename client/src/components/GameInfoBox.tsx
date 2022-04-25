import React from 'react';

import './GameInfoStyle.css';

interface Opening {
  eco: string
  name: string
}

interface Clock {
  initial: number
  increment: number
}

interface GameProps {
  showGameAnalysis: (pgn: string) => void
  id: string
  createdAt: number
  user: string
  winner: string
  status: string
  white: string
  black: string
  pgn: string
  opening: Opening
  speed: string
  clock: Clock

};

interface GameStates {};

export default class GameInfoBox extends React.Component<GameProps, GameStates> {

  constructor(props) {
    super(props);
  }

  render() {
    const { showGameAnalysis, id, createdAt, user, winner, status, white, black, pgn, opening, speed, clock }  = this.props;

    let timeControlImg = <img className="time-control-img" src="bullet.png" />;

    if (speed === "bullet") {
      timeControlImg = <img className="time-control-img" src="bullet.png" />;
    } else if (speed === "blitz") {
      timeControlImg = <img className="time-control-img" src="blitz.png" />
    } else if (speed === "rapid") {
      timeControlImg = <img className="time-control-img" src="rapid.png" />
    } else if (speed === "classical") {
      timeControlImg = <img className="time-control-img" src="classical.png" />
    }

    const clockInitial = clock.initial / 60;
    const clockIncrement = clock.increment;

    const timeControlText = <span>{clockInitial} + {clockIncrement}</span>;

    let gameResultText: JSX.Element = <area />;

    if ((winner === "white" && white === user) || (winner === "black" && black === user)) {
      gameResultText = <span className="game-result won">{user + " won"}</span>;
    } else if (status === "draw") {
      gameResultText = <span className="game-result draw">Draw</span>
    } else {
      gameResultText = <span className="game-result lost">{user + " lost"}</span>;
    }

    const date = new Date(createdAt).toLocaleDateString("en-US");

    return (
      <div className="game-box" onClick={() => showGameAnalysis(pgn)}>
        <div className="time-control-div">
          {timeControlImg}
          {timeControlText}
        </div>
        <div>
          <span className="versus-text">{white} vs. {black}</span>
          {gameResultText}
        </div>
        <div>
          <span className="opening-text">Opening: {opening.eco} {opening.name}</span>
          <span className="date-text">{date}</span>
        </div>
      </div>
    );

  }
}
