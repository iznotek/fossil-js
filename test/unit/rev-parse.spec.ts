import { assertExecutedCommands, closeWithSuccess, newSimpleFossil, newSimpleFossilP } from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('revParse', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      callback = jest.fn();
   });

   describe('simple-fossil/promise', () => {
      beforeEach(() => fossil = newSimpleFossilP());

      it('returns rev-parse data to a promise', async () => {
         const queue = fossil.revparse(['--show-toplevel']);
         closeWithSuccess('  /var/tmp/some-root   ');

         expect(await queue).toBe('/var/tmp/some-root');
         assertExecutedCommands('rev-parse', '--show-toplevel');
      });
   });


   describe('simple-fossil', () => {
      beforeEach(() => fossil = newSimpleFossil());

      it('called with a string', async () => {
         fossil.revparse('some string');
         await closeWithSuccess();
         assertExecutedCommands('rev-parse', 'some string');
      });

      it('called with an array of strings', async () => {
         fossil.revparse(['another', 'string']);
         await closeWithSuccess();
         assertExecutedCommands('rev-parse', 'another', 'string');
      });

      it('called with all arguments', async () => {
         const queue = fossil.revparse('foo', {bar: null}, callback);
         await closeWithSuccess(' some data ');
         expect(await queue).toBe('some data');
         expect(callback).toHaveBeenCalledWith(null, 'some data');
         assertExecutedCommands('rev-parse', 'foo', 'bar');
      })
   });

});
