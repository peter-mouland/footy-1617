import React from 'react';
import { connect } from 'react-redux';
import bemHelper from 'react-bem-helper';
import debug from 'debug';

import { availablePositions } from '../../components/Positions/Positions';
import { saveStatsSnapshot, fetchPlayers } from '../../actions';
import './playerStats.scss';

const log = debug('footy:Homepage.js'); //eslint-disable-line
const bem = bemHelper({ name: 'player-stats' });

class PlayerStats extends React.Component {

  static needs = [fetchPlayers];

  constructor(props) {
    super(props);
    this.saveStatsSnapshot = this.saveStatsSnapshot.bind(this);
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

  saveStatsSnapshot() {
    this.setState({ isSaving: true });
    this.props.saveStatsSnapshot(this.props.stats.players)
      .then(() => {
        this.setState({ isSaving: false });
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
      : <button onClick={this.saveStatsSnapshot} >Save Stats-Snapshot</button>;

    const clubsObj = {};
    players.forEach(player => { clubsObj[player.tName] = true; });
    const clubs = Object.keys(clubsObj).sort();

    return (
      <div { ...bem() }>
        <h2>Players Stats</h2>
        {Save}
        <table cellPadding={0} cellSpacing={0} { ...bem('table') }>
          <thead>
          <tr { ...bem('data-header')}>
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
              <select onChange={this.posFilter}>
                <option value={''}>all</option>
                {availablePositions.map(pos => <option value={pos} key={pos}>{pos}</option>)}
              </select>
            </th>
            <th></th>
            <th>
              <select onChange={this.clubFilter}>
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
            return isFiltered
              ? null
              : (
                <tr key={player.id} { ...bem('player')}>
                  <td { ...bem('meta')} >{player.code || player.id}</td>
                  <td { ...bem('meta', player.pos)} >{player.pos}</td>
                  <td { ...bem('meta')} >{player.fullName}</td>
                  <td { ...bem('meta')} >{player.tName}</td>
                  {Object.keys(player.ffPoints).map((key, i) => (
                    <td key={i} { ...bem('meta', 'stat')} >{player.ffPoints[key]}</td>
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
  { saveStatsSnapshot, fetchPlayers }
)(PlayerStats);

