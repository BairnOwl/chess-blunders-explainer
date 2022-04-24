import React from 'react';

// import { convertToFEN } from 'pgn-to-fen';

interface GameProps {
  id: string,
  user: string,
  winner: string,
  white: string,
  black: string,
  pgn: string

};

interface GameStates {};

export default class GameInfoBox extends React.Component<GameProps, GameStates> {

  constructor(props) {
    super(props);

  }

  render() {
    const { id, user, winner, white, black, pgn }  = this.props;

    // console.log(convertToFEN(pgn));
    return (
      <li key="{id}">
        {id}, {user}, {pgn}

      </li>
    );

  }
}
