import { SimpleFossil, SimpleFossilOptions } from '../../typings';

export function newSimpleFossil (...args: [] | [string] | [Partial<SimpleFossilOptions>]): SimpleFossil {
   const simpleFossil = require('../..');
   return simpleFossil(...args);
}

export function newSimpleFossilP (baseDir: unknown | string = '/tmp/example-repo') {
   if (typeof baseDir !== 'string') {
      throw new Error('Bad arguments to newSimpleFossilP');
   }
   return require('../../promise')(baseDir);
}
