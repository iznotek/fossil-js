import { createTestContext, newSimpleFossil, setUpInit, SimpleFossilTestContext } from '../__fixtures__';
import { SimpleFossil } from '../../typings';

describe('config', () => {
   let context: SimpleFossilTestContext;
   let fossil: SimpleFossil;

   beforeEach(async () => {
      context = await createTestContext();
      await setUpInit(context);
   });
   beforeEach(() => fossil = newSimpleFossil(context.root));

   async function configurationLinesMatching(test: string) {
      const config = await context.fossil.raw('config', '--list', '--show-origin');
      return config.split('\n').filter(line => line.includes(test));
   }

   it('adds a configuration setting', async () => {
      await fossil.addConfig('user.name', 'FOO BAR');

      expect(await configurationLinesMatching('FOO BAR')).toHaveLength(1);
   });

   it('replaces a configuration setting', async () => {
      await fossil.addConfig('user.name', 'FOO BAR');
      await fossil.addConfig('user.name', 'BAZ BAT');

      expect(await configurationLinesMatching('FOO BAR')).toHaveLength(0);
      expect(await configurationLinesMatching('BAZ BAT')).toHaveLength(1);
   });

   it('appends a configuration setting', async () => {
      await fossil.addConfig('user.name', 'FOO BAR', true);
      await fossil.addConfig('user.name', 'BAZ BAT', true);

      expect(await configurationLinesMatching('FOO BAR')).toHaveLength(1);
      expect(await configurationLinesMatching('BAZ BAT')).toHaveLength(1);
   });

   it('lists current configuration - single values in local scope', async () => {
      await fossil.addConfig('user.name', 'HELLO');
      expect((await fossil.listConfig()).all['user.name']).toBe('HELLO');

      await fossil.addConfig('user.name', 'GOOD BYE');
      expect((await fossil.listConfig()).all['user.name']).toBe('GOOD BYE');
   });

   it('lists current configuration - array of values in local scope', async () => {
      await fossil.addConfig('user.name', 'Abc');
      await fossil.addConfig('user.name', 'Def', true);

      expect((await fossil.listConfig()).all['user.name']).toEqual(
         ['Abc', 'Def']
      );
   });


});
