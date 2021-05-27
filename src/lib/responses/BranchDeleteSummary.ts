import {
   BranchSingleDeleteFailure,
   BranchSingleDeleteResult,
   BranchSingleDeleteSuccess
} from '../../../typings';


export function branchDeletionSuccess (branch: string, hash: string): BranchSingleDeleteSuccess {
   return {
      branch, hash, success: true,
   };
}

export function branchDeletionFailure (branch: string): BranchSingleDeleteFailure {
   return {
      branch, hash: null, success: false,
   };
}

export function isSingleBranchDeleteFailure (test: BranchSingleDeleteResult): test is BranchSingleDeleteSuccess {
   return test.success;
}
