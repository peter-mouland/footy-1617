import React from 'react';
import { connect } from 'react-redux';
import debug from 'debug';

import { fetchArchives } from '../../actions';

const log = debug('footy:Homepage.js'); //eslint-disable-line

class Archives extends React.Component {

  static needs = [fetchArchives];

  componentDidMount() {
    if (this.props.archives.data) return;
    this.props.fetchArchives().catch((err) => {
      throw new Error(err);
    });
  }

  render() {
    const { data, status, error } = this.props.archives;

    if (!data || status.isLoading) {
      return <h3>Loading Archives...</h3>;
    } else if (status.isError) {
      return <div>
        <h3>ERROR Loading Archives...</h3>
        <p>{error.message}</p>
      </div>;
    }

    if (!data) {
      return (<strong>No data. yet...</strong>);
    } else if (!data.archives || !data.archives.length) {
      return (<strong>No Archives!</strong>);
    }

    return (
      <div>
        <h2>archives</h2>
          {
            data.archives.map(archive => (
              <div key={archive.id}>{archive.title}  >  view | set as week end</div>
            ))
          }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    archives: state.archives
  };
}

export default connect(
  mapStateToProps,
  { fetchArchives }
)(Archives);

