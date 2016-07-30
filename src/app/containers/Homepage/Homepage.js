import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import debug from 'debug';
import {copy} from './homepage-copy';
import ProductsContainer from '../ProductsContainer/ProductsContainer';
import CartContainer from '../CartContainer/CartContainer';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions'

const log = debug('lego:Homepage.js');

class Homepage extends React.Component {

  static needs = [
    actions.getProducts
  ];

  render() {
    const {results, isLoading} = this.props.products;
    if (isLoading) {
      return <h3>Loading planets...</h3>;
    }
    log(`this.state : ${this.state}`);
    // log(`this.props : ${Object.keys(this.state)}`);
    log(`this.props : ${Object.keys(this.props.products)}`);
    log(`isLoading : ${isLoading}`);
    log(`items : ${results}`);
    return (
      <div id="homepage">
        <banner className="header">
          <h1>{copy.title}</h1>
          <p>{copy.blurb}</p>
        </banner>

        <div>
          <h2>Shopping Cart Example</h2>
          <hr/>
          {[].concat(results).map((item = {}) => {
            log(item)
            const id = item.id;
            return (
              <Link to={`/product/${id}`} key={id} style={{display: 'block'}}>
                {item.title}
              </Link>
            );
          })}
          <hr/>
          {/*<CartContainer />*/}
        </div>

        <Link to='/search'>search</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  log('mapState', state)
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

