import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {copy} from './homepage-copy';
import ProductsContainer from '../ProductsContainer/ProductsContainer';
import CartContainer from '../CartContainer/CartContainer';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions'


class Homepage extends React.Component {

  static needs = [
    actions.getProducts
  ];

  render() {
    const { results, isLoading } = this.props.products;
    if (isLoading) {
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
          <ProductsContainer products={ results } addToCart={()=>{}} />
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Homepage);

