import { FossilError } from '../../src/lib/errors/fossil-error';
import { FossilResponseError } from '../../src/lib/errors/fossil-response-error';

/**
 * Convenience for asserting the type and message of a `FossilError`
 *
 * ```javascript
 const promise = doSomethingAsyncThatRejects();
 const {threw, error} = await promiseError(fossil.init());

 expect(threw).toBe(true);
 assertFossilError(error, 'some message');
 ```
 */
export function assertFossilError(errorInstance: Error | unknown, message: string | RegExp, errorConstructor?: any) {
   if (!errorConstructor) {
      errorConstructor = FossilError;
   }

   expect(errorInstance).toBeInstanceOf(errorConstructor);
   expect(errorInstance).toHaveProperty('message', expect.stringMatching(message));
}

export function assertFossilResponseError(errorInstance: Error | unknown, fossil: any, equality?: any) {
   expect(errorInstance).toBeInstanceOf(FossilResponseError);
   fossil && expect((errorInstance as any).fossil).toBeInstanceOf(fossil);
   equality && expect((errorInstance as any).fossil).toEqual(equality);
}
