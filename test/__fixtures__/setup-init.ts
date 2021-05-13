import { SimpleFossil } from '../../typings';
import { SimpleFossilTestContext } from './create-test-context';

export const GIT_USER_NAME = 'Simple Fossil Tests';
export const GIT_USER_EMAIL = 'tests@simple-fossil.dev';

export async function setUpInit ({fossil}: SimpleFossilTestContext, bare = false) {
   await fossil.init(bare);
   await configureFossilCommitter(fossil);
}

async function configureFossilCommitter (fossil: SimpleFossil, name = GIT_USER_NAME, email = GIT_USER_EMAIL) {
   await fossil.addConfig('user.name', name);
   await fossil.addConfig('user.email', email);
}
