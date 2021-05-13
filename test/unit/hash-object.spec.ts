import { SimpleFossil } from 'typings';
import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';

describe('hash-object', () => {
   let fossil: SimpleFossil;

   beforeEach(() => fossil = newSimpleFossil());

   it('trims the output', async () => {
     const task = fossil.hashObject('index.js');
     await closeWithSuccess(`
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
     `);

     assertExecutedCommands('hash-object', 'index.js');
     expect(await task).toEqual('3b18e512dba79e4c8300dd08aeb37f8e728b8dad');
   });

   it('optionally writes the result', async () => {
     fossil.hashObject('index.js', true);
     await closeWithSuccess();
     assertExecutedCommands('hash-object', 'index.js', '-w');
   });
});
