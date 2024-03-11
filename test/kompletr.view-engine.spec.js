import { JSDOM } from 'jsdom';
import { ViewEngine } from '../src/js/kompletr.view-engine.js';

describe('ViewEngine class and methods', () => {
    beforeEach(() => {
      const dom = new JSDOM();
      global.document = dom.window.document;
    });

    describe('::focus', () => {
      test('focus method should add or remove focus', () => {
        const dom = {
          result: document.createElement('div'),
          focused: null,
        };
  
        const child1 = document.createElement('div');
        const child2 = document.createElement('div');
  
        dom.result.appendChild(child1);
        dom.result.appendChild(child2);
  
        const viewEngine = new ViewEngine(dom);
  
        viewEngine.focus(0, 'add');
        expect(dom.focused).toBe(child1);
        expect(child1.className).toContain('focus');
  
        viewEngine.focus(0, 'remove');
        expect(dom.focused).toBe(null);
        expect(child1.className).toBe('item--result');
      });
    });

    describe('::showResults', () => {
      test('showResults method should display results', done => {
        const dom = {
          result: document.createElement('div'),
        };
  
        const viewEngine = new ViewEngine(dom);
  
        const data = [
          { idx: 0, data: 'test1' },
          { idx: 1, data: { field1: 'test2', field2: 'test3' } },
        ];
  
        const options = {
          fieldsToDisplay: ['field1'],
        };
  
        viewEngine.showResults(data, options, () => {
          expect(dom.result.innerHTML).toContain('test1');
          expect(dom.result.innerHTML).toContain('test2');
          expect(dom.result.innerHTML).not.toContain('test3');
          done();
        });
      });
    });
});