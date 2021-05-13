import { promiseError } from '@kwsites/promise-result';
import {
   assertExecutedCommands,
   assertFossilError,
   assertNoExecutedTasks,
   closeWithSuccess,
   newSimpleFossil
} from './__fixtures__';
import { SimpleFossil } from '../../typings';

import { TaskConfigurationError } from '../..';

describe('revert', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('reverts', async () => {
      fossil.revert('HEAD~3', callback);
      await closeWithSuccess();
      assertExecutedCommands('revert', 'HEAD~3');
   });

   it('reverts a range', async () => {
      fossil.revert('master~5..master~2', {'-n': null}, callback);
      await closeWithSuccess();
      assertExecutedCommands('revert', '-n', 'master~5..master~2');
   });

   it('requires a string', async () => {
      const err = await promiseError(fossil.revert(callback as any));
      assertFossilError(err, 'Commit must be a string', TaskConfigurationError);
      assertNoExecutedTasks();
   });

});
