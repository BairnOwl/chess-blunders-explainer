import React from 'react';

import { Chessboard } from 'react-chessboard';

interface GameProps {
  pgn: string
};

interface GameStates {
  pgn: string
  moves: string
};

export default class GameInfoBox extends React.Component<GameProps, GameStates> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const pgn = this.props.pgn;
    const moves = pgn.substr(pgn.indexOf('1.'));

    this.setState({
      pgn: pgn,
      moves: moves
    });
  }

  render() {
    return (
      <div>
        <Chessboard position={"start"} />
        {this.state.moves}
      </div>
    );
  }
}
