import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {copy} from './homepage-copy';
import ProductsContainer from '../ProductsContainer/ProductsContainer';
import CartContainer from '../CartContainer/CartContainer';
import { getProducts } from '../../actions'
import debug from 'debug';

const log = debug('lego:Homepage.js'); //eslint-disable-line

class Homepage extends React.Component {

  static needs = [ getProducts ];

  componentDidMount(){
    const { products } = this.props;
    if (products.isTimeout){
      this.props.getProducts()
    }
  }

  render() {
    const { data, isLoading, isTimeout } = this.props.products;
    if (isLoading || isTimeout) {
      return <h3>Loading products...</h3>;
    }
    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>

        <div>
          <h2>Shopping Cart Example</h2>
          <hr/>
          <ProductsContainer products={ data.results } addToCart={()=>{}} />
          <hr/>
          {/*<CartContainer />*/}
        </div>

        <Link to='/search'>search</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.products
  };
}

export default connect(
  mapStateToProps,
  { getProducts }
)(Homepage);

