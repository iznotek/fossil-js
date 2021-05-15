import { forEachLineWithContent } from '../utils';

export interface RemoteWithoutRefs {
   name: string;
}

export interface RemoteWithRefs extends RemoteWithoutRefs {
   refs: {
      fetch: string;
      push: string;
   };
}

export function parseGetRemotes (text: string): RemoteWithoutRefs[] {
   const remotes: {[name: string]: RemoteWithoutRefs} = {};

   forEach(text, ([name]) => remotes[name] = { name });

   return Object.values(remotes);
}

function forEach(text: string, handler: (line: string[]) => void) {
   forEachLineWithContent(text, (line) => handler(line.split(/\s+/)));
}
