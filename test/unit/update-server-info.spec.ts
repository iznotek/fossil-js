import { promiseError } from '@kwsites/promise-result';
import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('updateServerInfo', () => {
   let fossil: SimpleFossil;

   beforeEach(() => fossil = newSimpleFossil());

   it('update server info', async () => {
      const queue = fossil.updateServerInfo();
      closeWithSuccess();

      expect(await promiseError(queue)).toBeUndefined();
      assertExecutedCommands('update-server-info');
   });

});
