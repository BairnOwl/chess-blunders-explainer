import React from 'react';

interface GameProps {
  id: string,
  user: string,
  winner: string,
  white: number,
  black: number,
  pgn: string

};

interface GameStates {};

export default class GameInfoBox extends React.Component<GameProps, GameStates> {

  constructor(props) {
    super(props);

  }

  render() {
    const { id, user, winner, white, black, pgn }  = this.props;

    return (
      <div>
        {user}, {winner}, {white}, {black}
      </div>
    );

  }
}
