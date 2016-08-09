import React from 'react';
import { connect } from 'react-redux';

import { updatePlayerPositions } from '../actions';
import './unknownPlayers.scss';

const availablePositions = ['GK', 'FB', 'CB', 'WM', 'CM', 'STR', 'park'];

class UnknownPayers extends React.Component {

  constructor(props) {
    super(props);
    this.SavePlayerPositions = this.SavePlayerPositions.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.state = {
      isUpdating: false,
      updatedOn: null
    };
  }

  SavePlayerPositions() {
    this.setState({
      isUpdating: true
    });
    this.props.updatePlayerPositions()
      .then(() => {
        this.setState({
          isUpdating: false,
          updatedOn: new Date()
        });
      });
  }

  updatePosition(player, pos) {
    this.refs[`btn-${player.code}-${pos}`].className += ' unknown-player__btn--selected';
  }

  render() {
    const { players } = this.props;
    const { isSaving, updatedOn } = this.state;

    const Save = (isSaving)
      ? <em>Retrieving Players Positions...</em>
      : <button onClick={this.SavePlayerPositions} >Save Players Positions</button>;

    return (
      <div>
        <h2>Unknown Players ({players.length}) <small>last updated: {String(updatedOn)}</small></h2>
        {Save}
        <ul className="unknown-player__list">
        {players.map(player => (
          <li id={player.code} key={player.code} className="unknown-player__item">
            {player.fullName}, {player.club}
            {availablePositions.map(pos => (
              <button className="unknown-player__btn" key={pos} ref={`btn-${player.code}-${pos}`}
                      onClick={() => this.updatePosition(player, pos)}
              >
                {pos}
              </button>
            ))}
          </li>
        ))}
        </ul>
      </div>
    );
  }
}

export default connect(
  null,
  { updatePlayerPositions }
)(UnknownPayers);
