
# Legacy Node Versions

From `v3.x`, `simple-fossil` will drop support for `node.js` version 10 or below.

To use in lower versions of node, ensure you are also including the necessary polyfills from `core-js`:

## Example - JavaScript

```javascript
require('core-js/stable/array/flat-map');
require('core-js/stable/object/from-entries');
require('core-js/stable/object/from-entries');

const simpleFossil = require('simple-fossil');
```   

## Example - TypeScript

```typescript
import 'core-js/stable/array/flat-map';
import 'core-js/stable/object/from-entries';
import 'core-js/stable/object/from-entries';

import simpleFossil, { SimpleFossil } from 'simple-fossil';

const git: SimpleFossil = simpleFossil();
```   
