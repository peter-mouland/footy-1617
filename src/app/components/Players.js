import React from 'react';
import { connect } from 'react-redux';
import bemHelper from 'react-bem-helper';

import { savePlayerPositions } from '../actions';
import './players.scss';

const bem = bemHelper({ name: 'unknown-players' });
const availablePositions = ['unknown', 'GK', 'FB', 'CB', 'WM', 'CM', 'STR', 'park'];

class Payers extends React.Component {

  constructor(props) {
    super(props);
    this.SavePlayerPositions = this.SavePlayerPositions.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.changePos = this.changePos.bind(this);
    this.state = {
      isSaving: false,
      playersToUpdate: {},
      playersUpdated: {},
      position: 'unknown'
    };
  }

  SavePlayerPositions() {
    this.setState({
      isSaving: true
    });
    this.props.savePlayerPositions(this.state.playersToUpdate)
      .then(() => {
        this.setState({
          isSaving: false,
          playersToUpdate: {}
        });
      });
  }

  changePos(e, position) {
    e.preventDefault();
    this.setState({ position });
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

  positionButtons(player) {
    if (player.pos !== 'unknown') return null;
    return availablePositions.map(pos => {
      const update = this.state.playersToUpdate[player.fullName];
      const selected = (!update && player.pos === pos) || (update && update.pos === pos);
      return (
        <button { ...bem('btn', { selected }) }
                key={pos} onClick={() => this.updatePosition(player, pos)}
        >
          {pos}
        </button>
      );
    });
  }

  render() {
    const { data } = this.props.stats;
    const { isSaving, position } = this.state;

    const Save = (isSaving)
      ? <em>Saving Players Positions...</em>
      : <button onClick={this.SavePlayerPositions} >Save Players Positions</button>;

    const filteredPlayers = data.players.filter(player => player.pos === position);
    return (
      <div { ...bem() }>
        <h2>Players ({position}: {filteredPlayers.length})</h2>
        {Save}
        <p>
          <strong>change view:</strong>
          {availablePositions.map(pos =>
            <a href={'#'} { ...bem('pos-link') } key={pos} onClick={(e) => this.changePos(e, pos)}>
              {pos}
            </a>
          )}
        </p>
        <ul { ...bem('list') }>
        {filteredPlayers
          .map(player => {
            return (
              <li { ...bem('item') } id={player.code} key={player.code} >
                {player.fullName}, {player.club}
                {this.positionButtons(player)}
              </li>
            );
          })
        }
        </ul>
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
  { savePlayerPositions }
)(Payers);
