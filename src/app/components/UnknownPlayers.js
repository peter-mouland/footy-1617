import React from 'react';
import { connect } from 'react-redux';

import { updatePlayerPositions } from '../actions';

export default class UnknownPayers  extends React.Component {

  constructor(props){
    super(props);
    this.updatePlayerPositions = this.updatePlayerPositions.bind(this);
    this.state = {
      isUpdating: false,
      updatedOn: null
    }
  }

  updatePlayerPositions() {
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

  render() {
    const { players } = this.props;
    const { isUpdating, updatedOn } = this.state;
    const Update = (isUpdating)
      ? <strong>Retrieving Players Positions...</strong>
      : <button onClick={this.updatePlayerPositions} >Update Players Positions from Google</button>;

    return (
      <div>
        <h2>Unknown Players ({players.length}) <small>last updated: {String(updatedOn)}</small></h2>
        {Update}
        <ul>
        {players.map(u => (
          <li key={u}>{u}</li>
        ))}
        </ul>
      </div>
    );
  }
};

export default connect(
  null,
  {  updatePlayerPositions }
)(UnknownPayers);
