import { promiseError } from '@kwsites/promise-result';
import {
   assertChildProcessEnvironmentVariables,
   assertFossilError,
   closeWithError,
   closeWithSuccess,
   newSimpleFossil
} from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('child-process', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('handles child process errors', async () => {
      const queue = fossil.init(callback);
      await closeWithError('SOME ERROR');

      const error = await promiseError(queue);
      expect(callback).toHaveBeenCalledWith(error);
      assertFossilError(error, 'SOME ERROR');
   });

   it('passes empty set of environment variables by default', async () => {
      fossil.init(callback);
      await closeWithSuccess();
      assertChildProcessEnvironmentVariables(undefined);
   });

   it('supports passing individual environment variables to the underlying child process', async () => {
      fossil.env('foo', 'bar').env('baz', 'bat').init();
      await closeWithSuccess();
      assertChildProcessEnvironmentVariables({foo: 'bar', baz: 'bat'});
   });

   it('supports passing environment variables to the underlying child process', async () => {
      fossil.env({foo: 'bar'}).init();
      await closeWithSuccess();
      assertChildProcessEnvironmentVariables({foo: 'bar'});
   });

});
