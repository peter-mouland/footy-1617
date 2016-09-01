import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchWeeklyPoints, saveWeeklyPoints } from '../../actions';
import { LinkHelper } from '../../routes';

const log = debug('footy:WeeklyPoints.js'); //eslint-disable-line

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

  saveWeeklyPoints() {
    this.setState({ isSaving: true });
    this.props.saveWeeklyPoints(this.props.stats.weekly)
      .then(() => {
        this.setState({ isSaving: false });
      });
  }


  render() {
    const { weekly, status, error } = this.props.stats;
    const { oops, isSaving } = this.state;

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

    const Save = (isSaving)
      ? <em>Saving points... this may take a minute or two.</em>
      : <button onClick={this.saveWeeklyPoints} >Save weekly points</button>;

    return (
        <div>
          <h2>Weekly Points</h2>
          {Save}
          <table>
            <thead>
            <tr>
              <th>code</th>
              <th>position</th>
              <th>player</th>
              <th>club</th>
              <th>total</th>
              {displayWeeks(weekly[0], key => <th>{key}</th>)}
            </tr>
            </thead>
            <tbody>
            {
              weekly.map(player => {
                return (
                  <tr key={player.code}>
                    <td>{player.code}</td>
                    <td>{player.position}</td>
                    <td>{player.player}</td>
                    <td>{player.club}</td>
                    <td>{player.total}</td>
                    {displayWeeks(player, key => <td>{player[key]}</td>)}
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
  { fetchWeeklyPoints, saveWeeklyPoints }
)(WeeklyPoints);

