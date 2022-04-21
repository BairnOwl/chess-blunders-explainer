import React from 'react';

import ndjsonStream from 'can-ndjson-stream';

interface Props {}

interface States {
  username: string
}

export default class GameRetrievalForm extends React.Component<Props, States> {

  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ username: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    fetch('https://lichess.org/api/games/user/' + this.state.username + '?max=30', {
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

              console.log(result.value);
              reader.read().then(read);

        } );
        },
        (error) => {
          console.log(error);
        }

      )
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" value={this.state.username} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Import Games" />
      </form>
    );
  }

}
