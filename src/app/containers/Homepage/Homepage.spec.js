import {expect, shallow, React} from '../../../../tests/support/test.helper';
import { WrappedComponent as Homepage }  from './Homepage';
import {copy} from './homepage-copy';

const baseProps = {
  stats: {
    data: {},
    status: {}
  }
};

describe('Settings Container', () => {
  it('should have an id of homepage', () => {
    const wrapper = shallow(<Homepage { ...baseProps } />);
    expect(wrapper.at(0)).to.have.prop('id', 'homepage');
  });
  //  unit testing goes here
});
