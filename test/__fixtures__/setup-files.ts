import { SimpleFossilTestContext } from './create-test-context';

export async function setUpFilesAdded(
   {fossil, files}: SimpleFossilTestContext,
   fileNames: string[],
   addSelector: string | string[] = '.',
   message = 'Create files'
) {
   await files(...fileNames);
   await fossil.add(addSelector);
   await fossil.commit(message);
}
