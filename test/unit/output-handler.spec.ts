import { closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('outputHandler', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('passes name of command to callback', async () => {
      const queue = fossil.outputHandler(callback).init();

      closeWithSuccess();
      await queue;

      expect(callback).toHaveBeenCalledWith(
         'git', expect.any(Object), expect.any(Object), ['init']
      );
   });

   it('passes name of command to callback - custom binary', async () => {
      const queue = fossil.outputHandler(callback).customBinary('something').init();

      closeWithSuccess();
      await queue;

      expect(callback).toHaveBeenCalledWith(
         'something', expect.any(Object), expect.any(Object), ['init']
      );
   });

})
