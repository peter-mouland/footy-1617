import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { copy } from './homepage-copy';
import { fetchPlayers } from '../../actions';
import debug from 'debug';

const log = debug('lego:Homepage.js'); //eslint-disable-line

class Homepage extends React.Component {

  static needs = [ fetchPlayers ];

  componentDidMount() {
    const { stats } = this.props;
    if (stats.isTimeout) {
      this.props.fetchPlayers();
    }
  }

  render() {
    const { data, status, error} = this.props.stats;
    if (status.isLoading || status.isTimeout) {
      return <h3>Loading Player Stats...</h3>;
    } else if (status.isError ) {
      return <div>
        <h3>ERROR Loading Player Stats...</h3>
        <p>{error.message}</p>
      </div>
    }
    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>

        <div>
          <h1>FF</h1>
          <h2>unknown players</h2>
          <ul>
            {data.unknown.map(u => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          <h2>players points</h2>
          <ul>
            {data.players.map(u => (
              <li key={u.id}>{JSON.stringify(u)}</li>
            ))}
          </ul>
        </div>

        <Link to='/search'>search</Link>
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

