import React from 'react';
import { connect } from 'react-redux';
import bemHelper from 'react-bem-helper';
import debug from 'debug';

import { fetchWeeklyPoints, saveWeeklyPoints } from '../../actions';
import { LinkHelper } from '../../routes';
import { availablePositions } from '../../components/Positions/Positions';

const log = debug('footy:WeeklyPoints.js'); //eslint-disable-line
const bem = bemHelper({ name: 'player-stats' });

const displayWeeks = (array, cb) => {
  return Object.keys(array)
    .sort((curr, prev) => curr < prev)
    .map(key => {
      if (key.indexOf('week') < 0) return null;
      return cb(key, array[key]);
    });
};

class WeeklyPoints extends React.Component {

  static needs = [fetchWeeklyPoints];

  constructor(props) {
    super(props);
    this.saveWeeklyPoints = this.saveWeeklyPoints.bind(this);
    this.posFilter = this.posFilter.bind(this);
    this.clubFilter = this.clubFilter.bind(this);
    this.state = {
      oops: false
    };
  }

  componentDidMount() {
    if (this.props.stats.weekly) return;
    this.props.fetchWeeklyPoints().then(() => {
      this.setState({
        error: false,
        dealing: false
      });
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

  saveWeeklyPoints() {
    this.setState({ isSaving: true });
    this.props.saveWeeklyPoints(this.props.stats.weekly)
      .then(() => {
        this.setState({ isSaving: false });
      });
  }

  render() {
    const { weekly, status, error } = this.props.stats;
    const { oops, isSaving, posFilter, clubFilter } = this.state;

    if (oops) {
      return <strong>oops</strong>;
    } else if (!weekly || (status && status.isLoading)) {
      return <h3>Loading Weekly Points...</h3>;
    } else if (status && status.isError) {
      return <div>
        <h3>ERROR Loading Weekly Points...</h3>
        <p>{error.message}</p>
      </div>;
    } else if (!weekly.length) {
      return (
        <div>
          <h3>No weekly points yet!</h3>
          Please tag a <LinkHelper to="statsSnapshots" /> as a 'week end'
        </div>
      );
    }

    const clubsObj = {};
    weekly.forEach(player => { clubsObj[player.club] = true; });
    const clubs = Object.keys(clubsObj).sort();

    const Save = (isSaving)
      ? <em>Saving points... this may take a minute or two.</em>
      : <button onClick={this.saveWeeklyPoints} >Save weekly points</button>;

    return (
        <div { ...bem() }>
          <h2>Weekly Points</h2>
          {Save}
          <table cellPadding={0} cellSpacing={0} { ...bem('table') }>
            <thead>
            <tr { ...bem('data-header')}>
              <th>code</th>
              <th>position</th>
              <th>player</th>
              <th>club</th>
              <th>total</th>
              {displayWeeks(weekly[0], key => <th>{key}</th>)}
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
              weekly
                .filter(player => {
                  const isFiltered = (!!posFilter && posFilter !== player.position)
                    || (!!clubFilter && clubFilter !== player.club);
                  return !isFiltered;
                })
                .map(player => (
                  <tr key={player.code} { ...bem('player')}>
                    <td { ...bem('meta')} >{player.code}</td>
                    <td { ...bem('meta', player.position)} >{player.position}</td>
                    <td { ...bem('meta')} >{player.player}</td>
                    <td { ...bem('meta')} >{player.club}</td>
                    <td { ...bem('meta')} >{player.total}</td>
                    {displayWeeks(player, key => <td>{player[key]}</td>)}
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
  { fetchWeeklyPoints, saveWeeklyPoints }
)(WeeklyPoints);

