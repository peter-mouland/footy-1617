import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { savePlayerStats } from '../actions';

const log = debug('lego:Homepage.js'); //eslint-disable-line

class PlayerStats extends React.Component {

  constructor(props){
    super(props);
    this.savePlayerStats = this.savePlayerStats.bind(this);
    this.state = {
      isSaving: false,
      savedOn: null
    }
  }

  savePlayerStats() {
    this.setState({
      isSaving: true
    });
    this.props.savePlayerStats(this.props.players)
      .then(() => {
        this.setState({
          isSaving: false,
          savedOn: new Date()
        });
      });
  }

  render() {
    const { players } = this.props;
    const { isSaving, savedOn } = this.state;
    const Save = (isSaving)
      ? <h3>Saving to Google...</h3>
      : <button onClick={this.savePlayerStats} >Send Points to Google</button>;

    return (
        <div>
          <h2>Players Points <small>last updated: {String(savedOn)}</small></h2>
          {Save}
          <table>
            <thead>
            <tr>
              <th>code</th>
              <th>position</th>
              <th>player</th>
              <th>club</th>
              {Object.keys(players[0].ffPoints).map((key,i) => (
                <th key={i}>{key}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {
              players.map(player => (
                <tr key={player.id}>
                  <td>{player.code || player.id}</td>
                  <td>{player.pos}</td>
                  <td>{player.fullName}</td>
                  <td>{player.tName}</td>
                  {Object.keys(player.ffPoints).map((key,i) => (
                    <td key={i}>{player.ffPoints[key]}</td>
                  ))}
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
    );
  }
}

export default connect(
  null,
  { savePlayerStats }
)(PlayerStats);

