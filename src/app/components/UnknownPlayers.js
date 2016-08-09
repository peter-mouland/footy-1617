import React from 'react';
import { connect } from 'react-redux';
import bemHelper from 'react-bem-helper';

import { savePlayerPositions } from '../actions';
import './unknownPlayers.scss';

const bem = bemHelper({ name: 'unknown-players' });
const availablePositions = ['GK', 'FB', 'CB', 'WM', 'CM', 'STR', 'park'];

class UnknownPayers extends React.Component {

  constructor(props) {
    super(props);
    this.SavePlayerPositions = this.SavePlayerPositions.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.state = {
      isSaving: false,
      updatedOn: null,
      playersToUpdate: {},
      playersUpdated: {}
    };
  }

  SavePlayerPositions() {
    this.setState({
      isSaving: true
    });
    this.props.savePlayerPositions(this.state.playersToUpdate)
      .then(() => {
        const playersUpdated = Object.assign(this.state.playersUpdated, this.state.playersToUpdate);
        this.setState({
          isSaving: false,
          updatedOn: new Date(),
          playersUpdated,
          playersToUpdate: {}
        });
      });
  }

  updatePosition(player, pos) {
    this.setState({
      playersToUpdate: {
        ...this.state.playersToUpdate,
        [player.fullName]: {
          code: player.code,
          pos,
          fullName: player.fullName,
          club: player.club
        }
      }
    });
  }

  render() {
    const { players } = this.props;
    const { isSaving, updatedOn, playersToUpdate, playersUpdated } = this.state;

    const Save = (isSaving)
      ? <em>Retrieving Players Positions...</em>
      : <button onClick={this.SavePlayerPositions} >Save Players Positions</button>;

    return (
      <div { ...bem() }>
        <h2>Unknown Players ({players.length}) <small>last updated: {String(updatedOn)}</small></h2>
        {Save}
        <ul { ...bem('list') }>
        {players.map(player => {
          return (
            <li { ...bem('item', { updated: playersUpdated[player.fullName] }) }
                id={player.code} key={player.code}
            >
              {player.fullName}, {player.club}
              {availablePositions.map(pos => {
                const update = playersToUpdate[player.fullName];
                const selected = update && update.pos === pos;
                return (
                  <button { ...bem('btn', { selected }) }
                          key={pos} onClick={() => this.updatePosition(player, pos)}
                  >
                    {pos}
                  </button>
                );
              })}
            </li>
          );
        })}
        </ul>
      </div>
    );
  }
}

export default connect(
  null,
  { savePlayerPositions }
)(UnknownPayers);
