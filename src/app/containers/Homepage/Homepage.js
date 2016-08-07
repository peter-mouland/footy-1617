import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { copy } from './homepage-copy';
import { fetchPlayers } from '../../actions';
import debug from 'debug';

const log = debug('lego:Homepage.js'); //eslint-disable-line

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

class Homepage extends React.Component {

  static needs = [ fetchPlayers ];

  constructor(props){
    super(props);
    this.sendToGoogle = this.sendToGoogle.bind(this);
    this.state = {
      isSaving: false,
      isUpdating: false,
      savedOn: null
    }
  }

  sendToGoogle() {
    const data = this.props.stats.data;
    this.setState({
      isSaving: true
    });
    fetch('/save-data', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(checkStatus)
      .then((data) => {
        console.log('request succeeded with JSON response', data);
        this.setState({
          isSaving: false,
          savedOn: new Date()
        });
      }).catch((error) => {
      console.log('request failed', error)
    });
  }

  updatePosFromGoogle() {
    this.setState({
      isUpdating: true
    });
    fetch('/update-player-positions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(checkStatus)
      .then((data) => {
        console.log('request succeeded with JSON response', data);
        this.setState({
          isUpdating: false
        });
      }).catch((error) => {
      console.log('request failed', error)
    });
  }

  componentDidMount() {
    const { stats } = this.props;
    if (stats.isTimeout) {
      this.props.fetchPlayers();
    }
  }

  render() {
    const { data, status, error} = this.props.stats;
    const { isSaving, isUpdating, savedOn } = this.state;
    if (isSaving) {
      return <h3>Saving to Google...</h3>;
    } else if (isUpdating ) {
      return <h3>Updates Players from Google...</h3>;
    } else if (status.isError ) {
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
          <h2>Unknown Players ({data.unknown.length}) <small>last updated: {data.updatedFromGoogleOn}</small></h2>
          <button onClick={this.updatePosFromGoogle} >Update Players from Google</button>
          <ul>
            {data.unknown.map(u => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          <h2>Players Points <small>last updated: {savedOn}</small></h2>
          <button onClick={this.sendToGoogle} >Send Points to Google</button>
          <table>
            <thead>
              <tr>
                 <th>code</th>
                 <th>position</th>
                 <th>player</th>
                 <th>club</th>
                {Object.keys(data.players[0].ffPoints).map((key,i) => (
                  <th key={i}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {
              data.players.map(player => (
                <tr key={player.id}>
                  <td>{player.code || player.id}</td>
                  <td>{player.pos}</td>
                  <td>{player.fullName}</td>
                  <td>{player.tName}</td>
                  {Object.keys(player.ffPoints).map((key,i) => (
                    <td key={i}>{player.ffPoints[key]}</td>
                  ))}
                </tr>
              ))
            }
            </tbody>
          </table>
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

