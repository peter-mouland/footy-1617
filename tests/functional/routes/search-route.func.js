import { mount, expect } from '../../support/test.helper';
import { history, router } from '../../../src/client-entry';
import { copy } from '../../../src/app/containers/Search/search-copy';
import { routes } from '../../../src/app/routes';

describe('SendToGoogle Route', function () {

  before(() => {
    this.wrapper = mount(router);
    history.push('/search');
  });

  after(() => {
    this.wrapper.unmount();
  });

  describe(`should contain  markup`, () => {
    it(`should contain the Search container`, () => {
      expect(this.wrapper.find('#search')).to.be.present();
    });

    it(`should contain the 'main' layout`, () => {
      expect(this.wrapper.find('.layout.layout--main')).to.be.present();
      expect(this.wrapper.find('.layout__nav')).to.be.present();
      expect(this.wrapper.find('.layout__content')).to.be.present();
      expect(this.wrapper.find('.layout__footer')).to.be.present();
    });

    it('Should contain a title', () => {
      expect(document.title).to.equal(routes.search.title);
    });

    it('should have a nav', () => {
      expect(this.wrapper.find('nav')).to.be.present();
    });

    it('should have a footer', () => {
      expect(this.wrapper.find('footer')).to.be.present();
    });

  });

  describe('should contain text', () => {
    it('should have a heading ', () => {
      const heading = this.wrapper.find('h1');
      expect(heading).to.have.text(copy.title);
    });
    it('should have a blurb', () => {
      const blurb = this.wrapper.find('p');
      expect(blurb).to.have.text(copy.blurb);
    });
  });
});
