import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';

import { findRoute } from '../utils';
import { routes, NavLink } from '../routes';

import './mainLayout.scss';

export default class MainLayout extends Component {
  static propTypes = {
    location: PropTypes.object
  };

  render() {
    const { children, location } = this.props;
    const cfg = findRoute(location.pathname);
    const route = cfg || routes.homepage;
    const navLinkProps = {
      className: 'layout__nav-link',
      activeClassName : 'layout__nav-link--selected'
    };

    return (
      <div className="layout layout--main">
        <DocumentMeta title={ route.title } />
        <nav className="layout__nav">
          <strong>View:</strong>
          <span>
            <NavLink to='homepage' { ...navLinkProps } />
            <NavLink to="playersByPosition" { ...navLinkProps } />
            <NavLink to="playerStats" { ...navLinkProps }  />
            <NavLink to="statsSnapshots" { ...navLinkProps }  />
            <NavLink to="weeklyPoints" { ...navLinkProps } />
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
