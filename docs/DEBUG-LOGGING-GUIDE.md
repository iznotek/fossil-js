
# Debug Logging

This library uses [debug](https://www.npmjs.com/package/debug) to handle logging,
to enable logging, use either the environment variable:

```
"DEBUG=simple-fossil" node ./your-app.js 
``` 

Or explicitly enable logging using the `debug` library itself:

```javascript
const debug = require('debug');
const simpleFossil = require('simple-fossil');

debug.enable('simple-fossil,simple-fossil:*');
simpleFossil().init().then(() => console.log('DONE'));
``` 


```typescript
import debug from 'debug';
import simpleFossil from 'simple-fossil';

debug.enable('simple-fossil,simple-fossil:*');
simpleFossil().init().then(() => console.log('DONE'));
``` 

## Verbose Logging Options

If the regular logs aren't sufficient to find the source of your issue, enable one or more of the
following for a more complete look at what the library is doing:

- `DEBUG=simple-fossil` the least verbose logging, used as a high-level overview of what the library is doing
- `DEBUG=simple-fossil:task:*` adds debug output for each task being run through the library
- `DEBUG=simple-fossil:task:add:*` adds debug output for specific git commands, just replace the `add` with
  the command you need to investigate. To output multiple just add them both to the environment
  variable eg: `DEBUG=simple-fossil:task:add:*,simple-fossil:task:commit:*`
- `DEBUG=simple-fossil:output:*` logs the raw data received from the git process on both `stdOut` and `stdErr`
- `DEBUG=simple-fossil,simple-fossil:*` logs _everything_ 

## Problems enabling logs programmatically 

The programmatic method of enabling / disabling logs through the `debug` library should 'just work',
but you may have issues when there are multiple versions of `debug` available in the dependency tree.
The simplest way to resolve that is to use a `resolutions` override in the `package.json`.

For example this `package.json` depends on an old version of `simple-fossil` but instead of allowing
`simple-fossil` to use its own old version of `debug`, `npm` would use version `4.3.1` throughout.

```json
{
   "name": "my-app",
   "dependencies": {
      "simple-fossil": "^2.21.0",
      "debug": "^4.3.1"
   },
   "resolutions": {
      "debug": "^4.3.1"
   }
}
```
