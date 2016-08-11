import React from 'react';
import { connect } from 'react-redux';
import bemHelper from 'react-bem-helper';

import { savePlayerPositions, fetchPlayers } from '../../actions';
import { PositionLinks, PositionButtons } from '../../components/Positions/Positions';
import './players.scss';

const bem = bemHelper({ name: 'unknown-players' });

class Payers extends React.Component {

  static needs = [fetchPlayers];

  constructor(props) {
    super(props);
    this.SavePlayerPositions = this.SavePlayerPositions.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.changePos = this.changePos.bind(this);
    this.state = {
      isSaving: false,
      playersToUpdate: {},
      playersUpdated: {},
      position: ''
    };
  }

  componentDidMount() {
    if (this.props.stats.data) { return; }
    this.props.fetchPlayers().then((response) => {
      if (!response.data) {
        this.setState({ oops: true });
      } else {
        this.setState(response.data);
      }
    }).catch((err) => {
      throw new Error(err);
    });
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

  render() {
    const { data, status, error } = this.props.stats;
    const { isSaving, position, oops } = this.state;

    if (oops) {
      return <h3>can't get data in single page apps. please refresh!</h3>;
    } else if (!data || status.isLoading) {
      return <h3>Loading Player Positions...</h3>;
    } else if (status.isError) {
      return <div>
        <h3>ERROR Loading Player Positions...</h3>
        <p>{error.message}</p>
      </div>;
    }

    const Save = (isSaving)
      ? <em>Saving Players Positions...</em>
      : <button onClick={this.SavePlayerPositions} >Save Players Positions</button>;

    if (!data) {
      return (<strong>No data. yet...</strong>);
    } else if (!data.players || !data.players.length) {
      return (<strong>No Players!</strong>);
    }

    const filteredPlayers = data.players.filter(player => player.pos === position);
    return (
      <div { ...bem() }>
        <h2>Players by position</h2>
        <div>
          <strong>View:</strong>
          <PositionLinks onClick={ this.changePos } selectedPos={ position } />
        </div>
        {filteredPlayers.length ? Save : null}
        <ul { ...bem('list') }>
        {filteredPlayers
          .map(player => {
            const update = this.state.playersToUpdate[player.fullName];
            const selectedPos = (!update && player.pos) || (update && update.pos);
            return (
              <li { ...bem('item') } id={player.code} key={player.code} >
                {player.fullName}, {player.club}
                {
                  (player.pos === 'unknown') ?
                    <PositionButtons selectedPos={ selectedPos }
                                 onClick={ (e, pos) => this.updatePosition(player, pos) } />
                    : null
                }
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
  { savePlayerPositions, fetchPlayers }
)(Payers);
