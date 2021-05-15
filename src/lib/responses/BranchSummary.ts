import { BranchSummary } from '../../../typings';

export class BranchSummaryResult implements BranchSummary {
   public all: string[] = [];
   public current: string = '';

   push(current: boolean, name: string) {
      if (current) {
         this.current = name;
      }

      this.all.push(name);
   }
}

