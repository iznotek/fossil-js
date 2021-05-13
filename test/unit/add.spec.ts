import { SimpleFossil } from '../../typings';
import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';

describe('add', () => {

   let fossil: SimpleFossil;

   beforeEach(() => fossil = newSimpleFossil());

   it('adds a single file', async () => {
      const queue = fossil.add('file.ext');
      await closeWithSuccess('raw response');

      expect(await queue).toBe('raw response');
      assertExecutedCommands('add', 'file.ext');
   });

   it('adds multiple files', async () => {
      const queue = fossil.add(['file.one', 'file.two']);
      await closeWithSuccess('raw response');

      expect(await queue).toBe('raw response');
      assertExecutedCommands('add', 'file.one', 'file.two');
   });

   it('adds files with trailing callback', async () => {
      const callback = jest.fn();
      const queue = fossil.add(['file.one', 'file.two'], callback);
      await closeWithSuccess('raw response');

      expect(await queue).toBe('raw response');
      expect(callback).toHaveBeenCalledWith(null, 'raw response');
   });
});
