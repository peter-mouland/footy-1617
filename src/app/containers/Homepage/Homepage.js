import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import PlayerStats from '../../components/PlayerStats';
import Players from '../../components/Players';
import { copy } from './homepage-copy';
import { fetchPlayers } from '../../actions';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class Homepage extends React.Component {

  static needs = [fetchPlayers];

  componentDidMount() {
    const { stats } = this.props;
    if (stats.isTimeout) {
      this.props.fetchPlayers();
    }
  }

  render() {
    const { data, status, error } = this.props.stats;
    if (status.isLoading) {
      return <h3>Loading Player Stats...</h3>;
    } else if (status.isError) {
      return <div>
        <h3>ERROR Loading Player Stats...</h3>
        <p>{error.message}</p>
      </div>;
    }

    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>
        <div>
          <Players />
          <PlayerStats players={data.players} />
        </div>
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
  { fetchPlayers }
)(Homepage);

