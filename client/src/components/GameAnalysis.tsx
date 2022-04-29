import React from 'react';

import { Chessboard } from 'react-chessboard';
import Button from '@mui/material/Button';
import { Ring } from 'react-spinners-css';

import './GameAnalysisStyle.css';

interface GameProps {
  hideGameAnalysis: () => void
  pgn: string
};

interface GameStates {
  isLoading: boolean,
  pgn: string
  moveList: any,
  analysisData: any,
  result: string,
  boardPosition: string,
  currMoveNum: number,
  shouldDisplayText : boolean
};

export default class GameAnalysis extends React.Component<GameProps, GameStates> {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pgn: '',
      moveList: [],
      analysisData: [],
      result: '',
      boardPosition: 'start',
      currMoveNum: 0,
      shouldDisplayText: false
    };

    this.setBoard = this.setBoard.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  componentDidMount() {
    const pgn = this.props.pgn;
    const moves = pgn.substr(pgn.indexOf('1.')).split(' ');

    let moveList : string[] = [];

    for (let move of moves) {
      if (!move.includes('.')) {
        moveList.push(move);
      }
    }

    this.setState({
      pgn: pgn,
      moveList: moveList
    });

    fetch('http://127.0.0.1:5000/analysis?pgn=' + pgn, {
      method: 'GET'
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      this.setState( {
        isLoading: false,
        analysisData: data
      });
    })
  }

  setBoard(i) {
    this.setState({
      boardPosition: this.state.analysisData[i].fen,
      currMoveNum: i,
      shouldDisplayText: true
    });
  }

  keyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.code === "ArrowLeft") {
      this.setBoard(this.state.currMoveNum - 1);
    }

    if (e.code === "ArrowRight") {
      this.setBoard(this.state.currMoveNum + 1);
    }
  }

  render() {
    const moveList = this.state.moveList.map((move, i) => {

      let numberBox = <div></div>;

      if ((i+1) % 2 == 1) {
        // 1 => 1, 3 => 2, 5 => 3, 7 => 4, 9 => 5
        const num = (i + 2) / 2;
        numberBox = <div className="num-box">{num}.</div>
      }
      return (
        <div>
        {numberBox}
        <div className={`move ${this.state.currMoveNum == (i+1) ? 'selected' : ''}`} onClick={() => this.setBoard(i+1)}>
          {move}
        </div>
        </div>
      )
    });

    let explanationText;

    if (this.state.shouldDisplayText) {
      const moveNum = this.state.currMoveNum;
      const moveAnalysis = this.state.analysisData[moveNum];
      const score = moveAnalysis.score;

      let evalPosText;

      if (score > 0) {
        evalPosText = 'White is better and has an advantage of ' + score + ' pawns.';
      } else if (score == 0) {
        evalPosText = 'The game is equal and neither side has an advantage.'
      } else {
        evalPosText = 'Black is better and has an advantage of ' + score + ' pawns.';
      }

      let mistakeText;

      if (moveAnalysis.isMistake) {
        if (moveAnalysis.mistakeSide == 'white') {
          mistakeText = 'White';
        } else {
          mistakeText = 'Black';
        }

        mistakeText += ' made a mistake. The category of this mistake is a ' + moveAnalysis.mistakeCategory[0] + '.';


      } else {
        mistakeText = '';
      }

      explanationText = <div>
      <h2>Explanation</h2>
      <p>{evalPosText}</p>
      <p>{mistakeText}</p>
      </div>
    } else {
      explanationText = '';
    }

    let toRender;

    if (this.state.isLoading) {
      toRender = <div className="loading-screen"><Ring color="#9dd0e1" /></div>;
    } else {
      toRender =
      <div className="analysis-div">
        <Button className="back-button" variant="outlined" sx={{margin: 2}} size="large" onClick={() => this.props.hideGameAnalysis()}>Back</Button>
        <div className="board"><Chessboard position={this.state.boardPosition} arePiecesDraggable={false}/></div>
        <div className="move-list" tabIndex={0} onKeyDown={this.keyDownHandler}>
          {moveList}
        </div>
        <div className="explanation-text">
          {explanationText}
        </div>
      </div>
    }

    return (
      <div>
      {toRender}
      </div>
    );
  }
}
