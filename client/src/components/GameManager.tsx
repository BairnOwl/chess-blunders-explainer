import React from 'react';

import ndjsonStream from 'can-ndjson-stream';
import Button from '@mui/material/Button';
import { FormControl, TextField, InputLabel, FormHelperText } from '@mui/material';

import GameInfoBox from './GameInfoBox';

import './Base.css';

interface Props {}

interface States {
  username: string,
  gameList: GameInfo[]
}

interface UserInfo {
  id: string,
  name: string
}

interface PlayerInfo {
  rating: number,
  ratingDiff: number,
  userInfo: UserInfo
}

interface Player {
  white: PlayerInfo,
  black: PlayerInfo
}

export interface GameInfo {
  id: string,
  winner: string,
  players: Player,
  pgn: string
}

export default class GameManager extends React.Component<Props, States> {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      gameList: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ username: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    fetch('https://lichess.org/api/games/user/' + this.state.username + '?max=30&pgnInJson=true', {
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
              console.log(result.value);
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

  render() {

    let gameList = this.state.gameList.map((d) =>
      <GameInfoBox
        id={d.id}
        user={this.state.username}
        winner={d.winner}
        white={d.players.white.rating}
        black={d.players.black.rating}
        pgn={d.pgn}
      />
    );

    return (
      <div>
        <div className="header">
          <img src="logo.png" className="logo" />
          <h1>Chess Blunders Explained</h1>
        </div>
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
      </div>
    );
  }

}
