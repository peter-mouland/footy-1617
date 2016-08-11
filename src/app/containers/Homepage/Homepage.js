import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { copy } from './homepage-copy';
import { fetchPlayers } from '../../actions';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class Homepage extends React.Component {

  // just loading this here for now as other components needed it
  // todo: hydrate state with fetch players on all server requests
  static needs = [fetchPlayers];

  componentDidMount() {
    const { stats } = this.props;
    if (stats.isTimeout) {
      this.props.fetchPlayers();
    }
  }

  render() {
    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>
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

