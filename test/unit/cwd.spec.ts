import { SimpleFossil } from 'typings';
import { assertNoExecutedTasks, newSimpleFossil, wait } from './__fixtures__';

describe('cwd', () => {

   let fossil: SimpleFossil;

   const {$fails: isInvalidDirectory, $reset: isValidDirectory} = require('@kwsites/file-exists');

   beforeEach(() => {
      fossil = newSimpleFossil()
   });

   it('to a known directory', async () => {
      isValidDirectory();

      const callback = jest.fn();
      fossil.cwd('./', callback);

      await wait();
      expect(callback).toHaveBeenCalledWith(null, './');
      assertNoExecutedTasks();
   });

   it('to an invalid directory', async () => {
      isInvalidDirectory();

      const callback = jest.fn((err) => expect(err.message).toMatch('invalid_path'));
      fossil.cwd('./invalid_path', callback);

      await wait();
      expect(callback).toHaveBeenCalledWith(expect.any(Error),);
      assertNoExecutedTasks();
   });

});
