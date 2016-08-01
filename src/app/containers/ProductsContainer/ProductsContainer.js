import React, { Component, PropTypes } from 'react';
// import { addToCart } from '../../actions';
import ProductItem from '../../components/ProductItem/ProductItem';
import ProductsList from '../../components/ProductList/ProductsList';

class ProductsContainer extends Component {

  static propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      inventory: PropTypes.number.isRequired
    })).isRequired,
    addToCart: PropTypes.func.isRequired
  };

  render() {
    const { products } = this.props;
    return (
      <ProductsList title="Products">
        {products.map(product =>
          <ProductItem
            key={product.id}
            product={product}
            onAddToCartClicked={() => this.props.addToCart(product.id)} />
        )}
      </ProductsList>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     products: getVisibleProducts(state.products)
//   }
// }
//
// export default connect(
//   mapStateToProps,
//   { addToCart }
// )(ProductsContainer)

export default ProductsContainer;
