import { SimpleFossilOptions } from '../types';

const defaultOptions: Omit<SimpleFossilOptions, 'baseDir'> = {
   binary: 'git',
   maxConcurrentProcesses: 5,
   config: [],
};

export function createInstanceConfig(...options: Array<Partial<SimpleFossilOptions> | undefined>): SimpleFossilOptions {
   const baseDir = process.cwd();
   const config: SimpleFossilOptions = Object.assign({baseDir, ...defaultOptions},
      ...(options.filter(o => typeof o === 'object' && o))
   );

   config.baseDir = config.baseDir || baseDir;

   return config;
}
