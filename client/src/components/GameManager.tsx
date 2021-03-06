import React from 'react';

import ndjsonStream from 'can-ndjson-stream';
import Button from '@mui/material/Button';
import { FormControl, TextField, InputLabel, FormHelperText } from '@mui/material';

import GameInfoBox from './GameInfoBox';
import GameAnalysis from './GameAnalysis';

import './Base.css';

interface Props {}

interface States {
  username: string,
  gameList: GameInfo[],
  showAnalysis: boolean,
  pgn: string
}

interface UserInfo {
  id: string,
  name: string
}

interface PlayerInfo {
  rating: number,
  ratingDiff: number,
  user: UserInfo
}

interface Player {
  white: PlayerInfo,
  black: PlayerInfo
}

interface Opening {
  eco: string,
  name: string
}

interface Clock {
  initial: number,
  increment: number
}

export interface GameInfo {
  id: string,
  createdAt: number,
  winner: string,
  players: Player,
  pgn: string,
  status: string,
  opening: Opening,
  speed: string,
  clock: Clock
}

export default class GameManager extends React.Component<Props, States> {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      gameList: [],
      showAnalysis: false,
      pgn: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showGameAnalysis = this.showGameAnalysis.bind(this);
    this.hideGameAnalysis = this.hideGameAnalysis.bind(this);
  }

  handleChange(e) {
    this.setState({ username: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    fetch('https://lichess.org/api/games/user/' + this.state.username + '?max=50&pgnInJson=true&opening=true', {
      method: 'GET',
      headers: {'Accept': 'application/x-ndjson'}
    })
      .then( res => {
        return ndjsonStream(res.body);
      })
      .then(
        (stream) => {
          const reader = stream.getReader();
          let read;
          reader.read().then( read = (result) => {
              if (result.done) {
                  return;
              }

              let gameList = this.state.gameList;
              gameList.push(result.value);
              // console.log(result.value);
              this.setState({
                gameList: gameList
              });
              reader.read().then(read);

        } );
        },
        (error) => {
          console.log(error);
        }

      )
  }

  showGameAnalysis(pgn) {
    this.setState({
      showAnalysis: true,
      pgn: pgn
    });
  }

  hideGameAnalysis() {
    this.setState({
      showAnalysis: false
    });
  }

  render() {

    let gameList = this.state.gameList.map((d) =>
      <GameInfoBox
        showGameAnalysis={this.showGameAnalysis}
        id={d.id}
        createdAt={d.createdAt}
        user={this.state.username}
        winner={d.winner}
        status={d.status}
        white={d.players.white.user.name}
        black={d.players.black.user.name}
        pgn={d.pgn}
        opening={d.opening}
        speed={d.speed}
        clock={d.clock}
      />
    );

    let gameAnalysis =
    <GameAnalysis
      hideGameAnalysis={this.hideGameAnalysis}
      pgn={this.state.pgn}
    />;

    let display = <div></div>;

    if (this.state.showAnalysis) {

      display = gameAnalysis;

    } else {
      display =
      <div>
        <div className="form">
          <FormControl>
            <TextField id="my-input" aria-describedby="my-helper-text" variant="outlined" label="Username"
              value={this.state.username} onChange={this.handleChange} margin="dense" />
            <FormHelperText id="my-helper-text">Enter your Lichess username.</FormHelperText>
            <Button variant="contained" onClick={this.handleSubmit} sx={{margin: 2}}>Import Games</Button>
          </FormControl>
        </div>

        <div>
          { gameList }
        </div>
      </div>;
    }

    return (
      <div>
      <div className="header">
        <img src="logo.png" className="logo" />
        <h1>Chess Blunders Explained</h1>
      </div>
      { display }
      </div>
    );
  }

}
