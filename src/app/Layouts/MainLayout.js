import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';

import { findRoute } from '../utils';
import { routes } from '../routes';

import './mainLayout.scss';

const NavLink = ({ route }) => (
  <Link to={ route.path } className="layout__nav-link" activeClassName="layout__nav-link--selected">
    { route.label }
  </Link>
);

export default class MainLayout extends Component {
  static propTypes = {
    location: PropTypes.object
  };

  render() {
    const { children, location } = this.props;
    const cfg = findRoute(location.pathname);
    const route = cfg || routes.homepage;

    return (
      <div className="layout layout--main">
        <DocumentMeta title={ route.title } />
        <nav className="layout__nav">
          <strong>View:</strong>
          <span>
            <NavLink route={ routes.homepage } />
            <NavLink route={ routes.playersByPosition } />
            <NavLink route={ routes.playerStats } />
            <NavLink route={ routes.weeklyPoints } />
            <NavLink route={ routes.statsSnapshots } />
          </span>
        </nav>
        <div className="layout__content">
          {children}
        </div>
        {/* <footer className="layout__footer">*/}
          {/* footer*/}
        {/* </footer>*/}
      </div>
    );
  }
}
