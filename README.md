# Baggie

Baggie is a lightweight event emitter and storage mechanism used for building modern event-driven applications. Baggie is compatible in both browser and server environments.

## Installation

Baggie can be installed with your favorite package manager (npm, yarn, etc) or simply included on your page with a `<script></script>` tag.

#### Install with NPM

```
npm i -s baggie
```

```js
// CommonJS
const Baggie = require('baggie');

// ES6 Module syntax also supported
import { Baggie } from 'baggie';
```

#### Or via script tag

```html
<script src="/path/to/Baggie.min.js"></script>
```

# Usage

Basic event handling and storage examples.

## Events

```js
'use strict';

// Instantiate a new Baggie instance
const baggie = new Baggie();

// Listen for an event
baggie.on('my-event', function handler(data){
    console.log(data);
});

// Emit an event
baggie.emit('my-event', 'Hello World!');
```

## Storage

```js
'use strict';

const baggie = new Baggie();

// Add a value to storage with key 'foo'
baggie.add('foo', 'bar');

// Retrieve the value of key 'foo'
baggie.get('key'); // 'bar';

// Unset the value of key 'foo'
baggie.remove('foo'); // 'bar';
baggie.get('foo'); // undefined

// Storage keys can be used to create a nested structure
baggie.add('a.b.c', 'foo');
baggie.get('a');     // { b: { c: 'foo' } }
baggie.get('a.b.c'); // 'foo'
```

# Storage Methods

## baggie.add(key, value[, options]) `Chainable`

*Alias*: `baggie.set`

Adds a `value` to storage that can be retrieved with `key`.

`key` argument must be a string or array of strings, `value` can be anything.

If `key` argument contains a `.` character (or some other character specified with `options.delimiter`), baggie will create a nested structure.

#### Example

```js
// Store the value 'bar' with key 'foo'
baggie.add('foo', 'bar');

// Create a nested structure
baggie.add('a.b.c', 'baz');

// Equivalent to above
baggie.add('a', {b:{c:'baz'}});

// Add method can be chained
baggie
    .add('foo', 'bar')
    .add('spam', 'eggs')
    .add('stuff', 'things');
```

**Note:** By default, `baggie.add` will not overwrite primitive values. To override this behavior set `options.force` to `true`;

`baggie.set` returns the baggie instance.

## baggie.get(key[, options])

Gets a value from storage. If `key` is a string delimited by a `.` then baggie will attempt to get a nested value. `options.delimiter` will override the default delimiter of `.`.

```js
// Add a value to storage
baggie.add('foo', 'bar');

// Retrieve the value
baggie.get('foo'); // bar

// Add a nested value
baggie.add('a.b', 'baz');

// Retrieve a nested value
baggie.get('a.b'); // 'baz'
```

`baggie.get` returns the value if found, otherwise `undefined`

## baggie.remove(key)

*Alias*: `baggie.unset`

Sets the value found at `key` to `undefined` and returns the value that was unset.

#### Example

```js
// Set a value
baggie.add('foo', 'bar');

// Unset and retrieve the value
baggie.unset('foo'); // 'bar'

baggie.get('foo'); // undefined
```

# Event Methods

## baggie.on(event, handler) `Chainable`

Register a `handler` function to be called when `event` is emitted. Handlers are called in the order in which they are registered. Global handlers are called before event handlers.

Handler function should accept a single argument that will be populated with any data attached to the event being emitted.

#### Example

```js
baggie.on('my-event', function(data){
    // Do something with the event data
    console.log(data);
});
```

`baggie.on` returns the baggie instance.

## baggie.off(event, handler) `Chainable`

Unregister a `handler` function. If no handler is provided, all handlers for `event` are cleared.

#### Example

```js
function handler(data){
    console.log(data);
}

// Listen for 'my-event'
baggie.on('my-event', handler);

// Unregister a handler
baggie.off('my-event', handler);

// Unregister all handlers for 'my-event'
baggie.off('my-event');
```

`baggie.off` returns the baggie instance.

## baggie.emit(event[, data]) `Chainable`

Emit an event with optional data.

This will fire all handlers in the order in which they were registered (global handlers first). Handlers for the specific event being fired are passed the `data` argument. Global handlers are passed the `event` and `data` arguments respectively.

`baggie.emit` returns the baggie instance.

#### Example

```js
baggie.emit('my-event', { foo: 'bar' });
```

## baggie.onGlobal(handler) `Chainable`

Register a handler for all events (global handler). Global handlers are called before other event-specific handlers. Global handlers are also called in the order in which they are registered.

Handler should accept 2 arguments, the first argument is the event name and the second is the event data.

#### Example

```js
baggie.onGlobal(function handler(event, data){
    console.log(`Handling event "${ event }"`);
    console.log(data);
});
```

`baggie.onGlobal` returns the baggie instance.

## baggie.offGlobal(handler) `Chainable`

Unregister a global handler. If no handler is provided, all global handlers are cleared.

#### Example

```js
function handler(event, data){
    console.log(`Handling event "${ event }"`);
    console.log(data);
}

// Register a global handler
baggie.onGlobal(handler);

// Unregister global handler
baggie.offGlobal(handler);

// Unregister all global handlers
baggie.offGlobal();
```

`baggie.offGlobal` returns the baggie instance.

## baggie.history

Returns an array of the events that have been fired, most recent first.

## baggie.empty() `Chainable`

*Alias*: `baggie.reset`

Resets the baggie instance to it's default state. Clears all handlers, data, and history.

`baggie.empty` returns the baggie instance.
