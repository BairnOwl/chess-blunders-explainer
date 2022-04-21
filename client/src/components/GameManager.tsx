import React from 'react';

import ndjsonStream from 'can-ndjson-stream';

import GameInfoBox from './GameInfoBox';

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
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" value={this.state.username} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Import Games" />
        </form>

        <ul>
          { gameList }
        </ul>
      </div>
    );
  }

}
