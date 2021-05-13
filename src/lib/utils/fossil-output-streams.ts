import { TaskResponseFormat } from '../types';

export class FossilOutputStreams<T extends TaskResponseFormat = Buffer> {

   constructor(public readonly stdOut: T, public readonly stdErr: T) {
   }

   asStrings(): FossilOutputStreams<string> {
      return new FossilOutputStreams(this.stdOut.toString('utf8'), this.stdErr.toString('utf8'));
   }
}
