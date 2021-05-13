import { folderExists } from '../utils';
import { SimpleFossilExecutor } from '../types';
import { adhocExecTask } from './task';

export function changeWorkingDirectoryTask (directory: string, root?: SimpleFossilExecutor) {
   return adhocExecTask((instance: SimpleFossilExecutor) => {
      if (!folderExists(directory)) {
         throw new Error(`Fossil.cwd: cannot change to non-directory "${ directory }"`);
      }

      return ((root || instance).cwd = directory);
   });
}
