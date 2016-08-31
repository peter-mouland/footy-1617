import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchStatsSnapshots, saveWeekEndTag } from '../../actions';
import { LinkHelper } from '../../routes';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class StatsSnapshots extends React.Component {

  static needs = [fetchStatsSnapshots];

  constructor(props) {
    super(props);
    this.state = {
      oops: false,
    };
    this.tagAsWeekEnd = this.tagAsWeekEnd.bind(this);
  }

  componentDidMount() {
    if (this.props.statsSnapshots.data) return;
    this.props.fetchStatsSnapshots().then(() => {
      this.setState({
        error: false,
        dealing: false
      });
    }).catch((err) => {
      throw new Error(err);
    });
  }

  tagAsWeekEnd(snapshot) {
    this.setState({ saving: true });
    this.props.saveWeekEndTag({ ...snapshot, weekEndTag: true })
      .then((results) => {
        if (!results) {
          this.setState({ oops: true });
        }
        this.setState({ saving: false });
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
    } else if (!data.length) {
      return (
        <div>
          <h3>No Stats-Snapshots saved!</h3>
          Please save a Stats Snapshot from the <LinkHelper to="playerStats" /> page
        </div>
      );
    }

    return (
      <div>
        <h2>Stats-Snapshot</h2>
          {
            data.map(snapshot => (
              <div key={snapshot.id}>
                <a href="#">{snapshot.title}</a>
                {
                  snapshot.weekEndTag
                    ? <span>(week end)</span>
                    : <button onClick={() => this.tagAsWeekEnd(snapshot)}>Tag as 'Week End'</button>
                }
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
  { fetchStatsSnapshots, saveWeekEndTag }
)(StatsSnapshots);

