import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchStatsSnapshots } from '../../actions';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class StatsSnapshots extends React.Component {

  static needs = [fetchStatsSnapshots];

  constructor(props) {
    super(props);
    this.state = {
      oops: false,
    };
  }

  componentDidMount() {
    if (this.props.statsSnapshots.data) return;
    this.props.fetchStatsSnapshots().then((response) => {
      if (!response) {
        this.setState({ oops: true });
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  render() {
    const { data, status, error } = this.props.statsSnapshots;
    const { oops } = this.state;

    if (oops) {
      return <strong>oops</strong>;
    } else if (!data || status.isLoading) {
      return <h3>Loading Stats-Snapshots...</h3>;
    } else if (status.isError) {
      return <div>
        <h3>ERROR Loading Stats-Snapshots...</h3>
        <p>{error.message}</p>
      </div>;
    } else if (!data.statsSnapshots || !data.statsSnapshots.length) {
      return (<strong>No Stats-Snapshots!</strong>);
    }

    return (
      <div>
        <h2>Stats-Snapshot</h2>
          {
            data.statsSnapshots.map(snapshot => (
              <div key={snapshot.id}>
                <strong>{snapshot.title}</strong>
                <span>{snapshot.weekEndTag ? '(week end)' : null}</span>
                <a href="#">View Snapshot</a> | <a href="#">Tag as 'Week End'</a>
              </div>
            ))
          }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    statsSnapshots: state.statsSnapshots
  };
}

export default connect(
  mapStateToProps,
  { fetchStatsSnapshots }
)(StatsSnapshots);

