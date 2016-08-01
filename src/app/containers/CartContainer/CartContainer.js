import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { checkout } from '../../actions';
import { getTotal, getCartProducts } from '../../reducers';
import Cart from '../../components/Cart/Cart';

class CartContainer extends Component {
  static propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired
    })).isRequired,
    total: PropTypes.string,
    checkout: PropTypes.func.isRequired
  };

  render() {
    const { products, total } = this.props;

    return (
      <Cart
        products={products}
        total={total}
        onCheckoutClicked={() => this.props.checkout()} />
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getCartProducts(state),
    total: getTotal(state)
  };
}

export default connect(
  mapStateToProps,
  { checkout }
)(CartContainer);
