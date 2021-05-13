import { assertExecutedCommands, closeWithSuccess, newSimpleFossil } from './__fixtures__';
import { SimpleFossil } from '../../typings';
import { parseMoveResult } from '../../src/lib/parsers/parse-move';

const renaming = (from: string, to: string) => `Renaming ${ from } to ${ to }`;

describe('mv', () => {
   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   describe('parsing', () => {
      it('parses a single file moving', () => {
         const result = parseMoveResult(`
${ renaming('s/abc', 'd/abc') }
`);

         expect(result.moves).toEqual([
            {from: 's/abc', to: 'd/abc'}
         ]);
      });

      it('parses multiple files moving', () => {
         const result = parseMoveResult(`
${ renaming('s/abc', 'd/abc') }
${ renaming('name with spaces.foo', 'less-spaces') }
`);

         expect(result.moves).toEqual([
            {from: 's/abc', to: 'd/abc'},
            {from: 'name with spaces.foo', to: 'less-spaces'}
         ]);
      });
   });

   describe('usage', () => {
      let promise;

      it('moves a single file - with callback', async () => {
         promise = fossil.mv('a', 'b', callback);
         await closeWithSuccess(renaming('a', 'b'));

         expect(callback).toHaveBeenCalledWith(null, await promise);
         assertExecutedCommands('mv', '-v', 'a', 'b');
      });

      it('moves multiple files to a single directory - with callback', async () => {
         promise = fossil.mv(['a', 'b', 'c'], 'd', callback);
         await closeWithSuccess(`
Renaming a to d/a
Renaming b to d/b
Renaming c to d/c
         `);

         const result = await promise;
         expect(callback).toHaveBeenCalledWith(null, result);
         expect(result.moves).toHaveLength(3);
         assertExecutedCommands('mv', '-v', 'a', 'b', 'c', 'd');
      });
   });
})
