import React from 'react';
import { Link } from 'react-router';
import debug from 'debug';
import { copy } from './homepage-copy';
import ProductsContainer from '../ProductsContainer/ProductsContainer';
import CartContainer from '../CartContainer/CartContainer';

debug('lego:Homepage.jsx');

export default class Homepage extends React.Component {

  render() {
    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>

        <div>
          <h2>Shopping Cart Example</h2>
          <hr/>
          <ProductsContainer />
          <hr/>
          <CartContainer />
        </div>
        
        <Link to='/search'>search</Link>
      </div>
    );
  }
}
