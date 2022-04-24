import React from 'react';

import ndjsonStream from 'can-ndjson-stream';
import Button from '@mui/material/Button';
import { FormControl, Input, InputLabel, FormHelperText } from '@mui/material';

import GameInfoBox from './GameInfoBox';

import './Base.css';

interface Props {}

interface States {
  username: string,
  gameList: GameInfo[]
}

export interface GameInfo {
  id: string,
  winner: string,
  white: string,
  black: string,
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
        white={d.white}
        black={d.black}
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
          <FormControl onSubmit={this.handleSubmit}>
            <InputLabel htmlFor="my-input">Username</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" value={this.state.username} onChange={this.handleChange} />
            <FormHelperText id="my-helper-text">Enter your Lichess username.</FormHelperText>
            <Button variant="contained" onClick={this.handleSubmit} className="form-button">Import Games</Button>
          </FormControl>
        </div>

        <ul>
          { gameList }
        </ul>
      </div>
    );
  }

}
