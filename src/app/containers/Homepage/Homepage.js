import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import debug from 'debug';
import { copy } from './homepage-copy';
import ProductsContainer from '../ProductsContainer/ProductsContainer';
import CartContainer from '../CartContainer/CartContainer';
import { getAllProducts } from '../../actions'

debug('lego:Homepage.jsx');

export default class Homepage extends React.Component {

  static requestData(params, domain = '') {
    this.props.getAllProducts();
  }

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

function mapStateToProps(state) {
  return {
    products: getVisibleProducts(state.products)
  }
}

export default connect(
  mapStateToProps,
  { getAllProducts }
)(Homepage)

