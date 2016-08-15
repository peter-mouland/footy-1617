import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchWeeklyPoints, saveWeeklyPoints } from '../../actions';

const log = debug('footy:WeeklyPoints.js'); //eslint-disable-line

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
    this.props.fetchWeeklyPoints().then((response) => {
      if (!response) {
        this.setState({ oops: true });
      }
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
    } else if (status && status.isLoading) {
      return <h3>Loading Player Stats...</h3>;
    } else if (status && status.isError) {
      return <div>
        <h3>ERROR Loading Player Stats...</h3>
        <p>{error.message}</p>
      </div>;
    } else if (!weekly || !weekly.length) {
      return <strong>No weekly points yet!</strong>;
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
              {Object.keys(weekly[0]).map((key, i) => {
                if (key.indexOf('week') < 0) return null;
                return <th key={i}>{key}</th>;
              })}
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
                    {Object.keys(player).map((key, i) => {
                      if (key.indexOf('week') < 0) return null;
                      return <td key={i}>{player[key]}</td>;
                    })}
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

