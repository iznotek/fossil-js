import { promiseError } from '@kwsites/promise-result';
import { assertFossilError, closeWithError, closeWithSuccess, newSimpleFossil } from './__fixtures__';

import { FossilError } from '../..';

describe('errorDetectionPlugin', () => {

   it('can throw with custom content', async () => {
      const errors = jest.fn().mockReturnValue(Buffer.from('foo'));
      const fossil = newSimpleFossil({errors}).init();
      await closeWithError('err');

      assertFossilError(await promiseError(fossil), 'foo');
   });

   it('can throw error when otherwise deemed ok', async () => {
      const errors = jest.fn().mockReturnValue(new Error('FAIL'));
      const fossil = newSimpleFossil({errors}).init();
      await closeWithSuccess('OK');

      expect(errors).toHaveBeenCalledWith(undefined, {
         exitCode: 0,
         stdErr: [],
         stdOut: [expect.any(Buffer)],
      });
      assertFossilError(await promiseError(fossil), 'FAIL');
   });

   it('can ignore errors that would otherwise throw', async () => {
      const errors = jest.fn();

      const fossil = newSimpleFossil({errors}).raw('foo');
      await closeWithError('OUT', 100);

      expect(errors).toHaveBeenCalledWith(expect.any(FossilError), {
         exitCode: 100,
         stdOut: [],
         stdErr: [expect.any(Buffer)],
      });
      expect(await promiseError(fossil)).toBeUndefined();
   });

});
