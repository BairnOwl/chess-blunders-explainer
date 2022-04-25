import React from 'react';

import { Chessboard } from 'react-chessboard';
import Button from '@mui/material/Button';

import './GameAnalysisStyle.css';

interface GameProps {
  hideGameAnalysis: () => void
  pgn: string
};

interface GameStates {
  pgn: string
  moves: string
};

export default class GameInfoBox extends React.Component<GameProps, GameStates> {
  constructor(props) {
    super(props);

    this.setState({
      pgn: '',
      moves: ''
    });
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
      <div className="analysis-div">
        <Button className="back-button" variant="outlined" sx={{margin: 2}} size="large" onClick={() => this.props.hideGameAnalysis()}>Back</Button>
        <div className="board"><Chessboard position={"start"} /></div>
        <div className="move-list">{this.state.moves}</div>
      </div>
    );
  }
}
