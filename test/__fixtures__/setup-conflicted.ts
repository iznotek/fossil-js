import { SimpleFossilTestContext } from './create-test-context';

export const FIRST_BRANCH = 'first';
export const SECOND_BRANCH = 'second';

export async function setUpConflicted ({fossil, file}: SimpleFossilTestContext) {
   await fossil.raw('checkout', '-b', FIRST_BRANCH);

   await file('aaa.txt', 'Some\nFile content\nhere');
   await file('bbb.txt', Array(20).join('bbb\n'));

   await fossil.add(`*.txt`);
   await fossil.commit('first commit');
   await fossil.raw('checkout', '-b', SECOND_BRANCH, FIRST_BRANCH);

   await file('aaa.txt', 'Different\nFile content\nhere');
   await file('ccc.txt', 'Another file');

   await fossil.add(`*.txt`);
   await fossil.commit('second commit');
}

export async function createSingleConflict ({fossil, file}: SimpleFossilTestContext) {
   await fossil.checkout(FIRST_BRANCH);
   await file('aaa.txt', 'Conflicting\nFile content\nhere');

   await fossil.add(`aaa.txt`);
   await fossil.commit('move first ahead of second');

   return SECOND_BRANCH;
}
