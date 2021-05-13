import { SimpleFossil } from '../../typings';
import { assertExecutedCommands, closeWithSuccess, like, newSimpleFossil } from './__fixtures__';
import { COMMIT_BOUNDARY, SPLITTER, START_BOUNDARY } from '../../src/lib/parsers/parse-list-log-summary';

describe('stashList', () => {

   let fossil: SimpleFossil;
   let callback: jest.Mock;

   beforeEach(() => {
      fossil = newSimpleFossil();
      callback = jest.fn();
   });

   it('with no stash', async () => {
      const expected = like({
         total: 0,
         all: [],
      });
      const queue = fossil.stashList(callback);
      closeWithSuccess();

      expect(await queue).toEqual(expected);
      expect(callback).toHaveBeenCalledWith(null, expected);
   });

   it('commands - default', async () => {
      fossil.stashList();
      await closeWithSuccess();

      assertExecutedCommands(
         'stash',
         'list',
         `--pretty=format:${START_BOUNDARY}%H${SPLITTER}%aI${SPLITTER}%s${SPLITTER}%D${SPLITTER}%b${SPLITTER}%aN${SPLITTER}%ae${COMMIT_BOUNDARY}`
      );
   });

   it('commands - custom splitter', async () => {
      const splitter = ';;';

      fossil.stashList({splitter});
      await closeWithSuccess();

      assertExecutedCommands(
         'stash',
         'list',
         `--pretty=format:${START_BOUNDARY}%H${splitter}%aI${splitter}%s${splitter}%D${splitter}%b${splitter}%aN${splitter}%ae${COMMIT_BOUNDARY}`
      );
   });

});
