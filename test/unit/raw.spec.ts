import { promiseError } from '@kwsites/promise-result';
import {
   assertExecutedCommands,
   assertFossilError,
   assertNoExecutedTasks,
   closeWithSuccess,
   newSimpleFossil,
   wait
} from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('raw', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;
   const response = 'passed through raw response';

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('accepts an array of arguments plus callback', async () => {
      const task = fossil.raw(['abc', 'def'], callback);
      closeWithSuccess(response);

      expect(await task).toBe(response);
      expect(callback).toBeCalledWith(null, response);
   });

   it('treats empty options as an error - empty array present', async () => {
      const task = fossil.raw([], callback);
      const error = await promiseError(task);

      expect(callback).toHaveBeenCalledWith(error);
      assertFossilError(error, 'Raw: must supply one or more command to execute');
      assertNoExecutedTasks();
   });

   it('treats empty options as an error - none present with callback', async () => {
      const task = fossil.raw(callback as any);
      const error = await promiseError(task);

      expect(callback).toHaveBeenCalledWith(error);
      assertFossilError(error, 'must supply one or more command');
      assertNoExecutedTasks();
   });

   it('treats empty options as an error - none present', async () => {
      const task = fossil.raw();
      const error = await promiseError(task);

      assertFossilError(error, 'must supply one or more command');
      assertNoExecutedTasks();
   });

   it('accepts an options object', async () => {
      fossil.raw({'abc': 'def'}, callback);
      await closeWithSuccess();

      assertExecutedCommands('abc=def')
   });

   it('does not require a callback in success - var args commands', async () => {
      const task = fossil.raw('a', 'b');
      await closeWithSuccess(response);

      assertExecutedCommands('a', 'b');
      expect(await task).toBe(response);
   });

   it('does not require a callback in success - array commands', async () => {
      const task = fossil.raw(['a', 'b']);
      await closeWithSuccess(response);

      assertExecutedCommands('a', 'b');
      expect(await task).toBe(response);
   });

   it('accepts rest-args: no callback', async () => {
      fossil.raw('a', 'b');
      await closeWithSuccess(response);
      assertExecutedCommands('a', 'b');
   });

   it('accepts (some) rest-args: options object', async () => {
      fossil.raw('some', 'thing', {'--opt': 'value'});
      await closeWithSuccess();
      assertExecutedCommands('some', 'thing', '--opt=value');
   });

   it('accepts rest-args: callback', async () => {
      fossil.raw('some', 'thing', callback);
      await wait();
      assertExecutedCommands('some', 'thing');
   });

})
