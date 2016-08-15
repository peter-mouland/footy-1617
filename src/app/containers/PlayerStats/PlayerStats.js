import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { savePlayerStats, fetchPlayers } from '../../actions';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class PlayerStats extends React.Component {

  static needs = [fetchPlayers];

  constructor(props) {
    super(props);
    this.savePlayerStats = this.savePlayerStats.bind(this);
    this.state = {
      isSaving: false
    };
  }

  componentDidMount() {
    if (this.props.stats.players) return;
    this.props.fetchPlayers().then((response) => {
      if (!response) {
        this.setState({ oops: true });
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  savePlayerStats() {
    this.setState({
      isSaving: true
    });
    this.props.savePlayerStats(this.props.stats.players)
      .then(() => {
        this.setState({
          isSaving: false,
          savedOn: new Date()
        });
      });
  }

  render() {
    const { players, status, error } = this.props.stats;
    const { isSaving, oops } = this.state;

    if (oops) {
      return <strong>oops</strong>;
    } else if ((status && status.isLoading) || !players || !players.length) {
      return <h3>Loading Player Stats...</h3>;
    } else if ((status && status.isError)) {
      return <div>
        <h3>ERROR Loading Player Stats...</h3>
        <p>{error.message}</p>
      </div>;
    } else if (!players) {
      return <strong>No Players!</strong>;
    }

    const Save = (isSaving)
      ? <em>Saving to Google... this may take a minute or two.</em>
      : <button onClick={this.savePlayerStats} >Save Stats-Snapshot</button>;

    return (
        <div>
          <h2>Players Points</h2>
          {Save}
          <table>
            <thead>
            <tr>
              <th>code</th>
              <th>position</th>
              <th>player</th>
              <th>club</th>
              {Object.keys(players[0].ffPoints).map((key, i) => (
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
                  {Object.keys(player.ffPoints).map((key, i) => (
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

function mapStateToProps(state) {
  return {
    stats: state.stats
  };
}

export default connect(
  mapStateToProps,
  { savePlayerStats, fetchPlayers }
)(PlayerStats);

