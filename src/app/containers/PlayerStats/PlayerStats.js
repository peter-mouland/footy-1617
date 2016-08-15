import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { availablePositions } from '../../components/Positions/Positions';
import { savePlayerStats, fetchPlayers } from '../../actions';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class PlayerStats extends React.Component {

  static needs = [fetchPlayers];

  constructor(props) {
    super(props);
    this.savePlayerStats = this.savePlayerStats.bind(this);
    this.posFilter = this.posFilter.bind(this);
    this.clubFilter = this.clubFilter.bind(this);
    this.state = {
      isSaving: false,
      posFilter: '',
      clubFilter: ''
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

  posFilter(e) {
    this.setState({ posFilter: e.target.value });
  }

  clubFilter(e) {
    this.setState({ clubFilter: e.target.value });
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
    const { isSaving, oops, posFilter, clubFilter } = this.state;

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
      ? <em>Saving ALL stats to Google... this may take a minute or two.</em>
      : <button onClick={this.savePlayerStats} >Save Stats-Snapshot</button>;

    const clubsObj = {};
    players.forEach(player => { clubsObj[player.tName] = true; });
    const clubs = Object.keys(clubsObj).sort();

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
          <tr>
            <th></th>
            <th>
              <select onChange={this.posFilter} ref="posFilter">
                <option value={''}>all</option>
                {availablePositions.map(pos => <option value={pos} key={pos}>{pos}</option>)}
              </select>
            </th>
            <th></th>
            <th>
              <select onChange={this.clubFilter} ref="clubFilter">
                <option value={''}>all</option>
                {clubs.map(club => <option value={club} key={club}>{club}</option>)}
              </select>
            </th>

          </tr>
        </thead>
        <tbody>
        {
          players.map(player => {
            const isFiltered = (!!posFilter && posFilter !== player.pos)
              || (!!clubFilter && clubFilter !== player.tName);
            return (isFiltered)
              ? null
              : (
              <tr key={player.id}>
                <td>{player.code || player.id}</td>
                <td>{player.pos}</td>
                <td>{player.fullName}</td>
                <td>{player.tName}</td>
                {Object.keys(player.ffPoints).map((key, i) => (
                  <td key={i}>{player.ffPoints[key]}</td>
                ))}
              </tr>
            );
          })
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

