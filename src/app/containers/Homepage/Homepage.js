import React from 'react';
import debug from 'debug';

import { LinkHelper } from '../../routes';
import { copy } from './homepage-copy';

const log = debug('footy:Homepage.js'); //eslint-disable-line

const Help = () => (
  <section>
    When the footy week ends, view the week points by :
    <ol>
      <li>
        View <LinkHelper to="playersByPosition" /> and ensure all players have a saved position
      </li>
      <li>
        View <LinkHelper to="playerStats" /> and click `Save Stats-Snapshot`
      </li>
      <li>
        View <LinkHelper to="statsSnapshots" /> and choose which Stats-Snapshot to tag as `week end`
      </li>
      <li>
        View <LinkHelper to="weeklyPoints" />
      </li>
    </ol>
  </section>
);

export default class Homepage extends React.Component {

  render() {
    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>
        <Help />
      </div>
    );
  }
}
