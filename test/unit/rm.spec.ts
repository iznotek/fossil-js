import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';

describe('rm', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('remove single file', async () => {
      fossil.rm('string', callback);
      await closeWithSuccess();
      assertExecutedCommands('rm', '-f', 'string');
   });

   it('remove multiple files', async () => {
      fossil.rm(['foo', 'bar'], callback);
      await closeWithSuccess();
      assertExecutedCommands('rm', '-f', 'foo', 'bar');
   });
});
