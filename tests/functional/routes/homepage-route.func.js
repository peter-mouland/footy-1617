import { mount, expect } from '../../support/test.helper';
import Root, { history } from '../../../src/app/Root';
import { routes } from '../../../src/app/routes';
import { copy } from '../../../src/app/containers/Homepage/homepage-copy';

describe('Homepage Route', function () {

  before(() => {
    this.wrapper = mount(Root);
    history.push('/');
  });

  after(() => {
    this.wrapper.unmount();
  });

  describe(`should contain  markup`, () => {
    it(`should contain the Homepage container`, () => {
      expect(this.wrapper.find('#homepage')).to.be.present();
    });

    it(`should contain the 'main' layout`, () => {
      expect(this.wrapper.find('.layout.layout--main')).to.be.present();
      expect(this.wrapper.find('.layout__content')).to.be.present();
    });

    it('Should contain a title', () => {
      expect(document.title).to.equal(routes.homepage.title);
    });

    it('should have a nav', () => {
      expect(this.wrapper.find('nav')).to.be.present();
    });

    it.skip('should have a footer', () => {
      expect(this.wrapper.find('footer')).to.be.present();
    });

  });

  describe('should contain text', () => {
    it('should have a heading', () => {
      const heading = this.wrapper.find('h1');
      expect(heading).to.have.text(copy.title);
    });
    it('should have a blurb', () => {
      const blurb = this.wrapper.find('p');
      expect(blurb.first()).to.have.text(copy.blurb);
    });
  });

});
