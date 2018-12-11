'use strict';

import Baggie from './Baggie';

let baggie;

describe('Instance should handle events', () => {
    baggie = new Baggie();

    const event = 'my-event';
    function fn(data){ return data }

    test('Should register an event', () => {
        baggie.on(event, fn);

        expect(baggie._events[event][0]).toBe(fn);
    });

    test('Should trigger an event', () => {
        baggie.emit(event, 'abc');

        expect(baggie.getHistory()[0]).toBe(event);
    });

    test('Should unregister an event', () => {
        baggie.off(event, fn);

        expect(baggie._events[event].indexOf(fn)).toBe(-1);
    });

    test('Should unregister all events', () => {
        baggie.on(event, () => {});
        baggie.on(event, () => {});
        baggie.on(event, () => {});

        baggie.off(event);

        expect(baggie._events[event].length).toBe(0);
    });
});

describe('Instance should handle global events', () => {
    baggie = new Baggie();

    let dataEmitted;

    function fn(evt, data){ dataEmitted = data }

    test('Should register a global event', () => {
        baggie.onGlobal(fn);

        expect(baggie._globals[0]).toBe(fn);
    });

    test('Should trigger a global event', () => {
        const data = { foo: 'bar' }
        baggie.emit('abc', data);

        expect(dataEmitted).toBe(data);
    });

    test('Should remove a global event', () => {
        baggie.offGlobal(fn);

        expect(baggie._globals.length).toBe(0);
    });

    test('Should remove all global events', () => {
        baggie.onGlobal(() => {});
        baggie.onGlobal(() => {});
        baggie.onGlobal(() => {});

        baggie.offGlobal();

        expect(baggie._globals.length).toBe(0);
    });
});

describe('Instance should reset on .empty', () => {
    beforeEach(() => {
        baggie = new Baggie();

        baggie.on('evt', function(){});
        baggie.onGlobal(function(){});
        baggie.emit('evt');

        baggie.empty();
    });

    test('_events should be empty', () => {
        expect(Object.keys(baggie._events).length).toBe(0);
    });

    test('_global should be empty', () => {
        expect(baggie._globals.length).toBe(0);
    });

    test('_history should be empty', () => {
        expect(baggie._history.length).toBe(0);
    });
});

describe('Instance methods should support chaining', () => {
    test('Chained methods work', () => {
        baggie = new Baggie();

        let emittedData,
            emittedEvent;

        const event = 'foo',
              data  = 'bar';

        baggie
            .on(event, (data) => emittedData = data)
            .onGlobal((evt, data) => emittedEvent = event)
            .emit(event, data)
            .off(event)
            .offGlobal();

        expect(baggie.history[0]).toBe('foo');
        expect(emittedEvent).toBe(event);
        expect(emittedData).toBe(data);
        expect(baggie._events[event].length).toBe(0);
        expect(baggie._globals.length).toBe(0);
    });
});

describe('History getter should return event history', () => {
    test('Should show most recent events first', () => {
        baggie = new Baggie();

        const events = ['foo', 'bar', 'baz'];

        events.forEach(evt => baggie.emit(evt));

        expect(baggie.history).toEqual(events.reverse());
    });
});

describe('baggie.on should throw errors', () => {
    baggie = new Baggie();

    test('When given an object as event name', () => {
        expect(() => baggie.on({}, () => {})).toThrow();
    });

    test('When given an array as event name', () => {
        expect(() => baggie.on([], () => {})).toThrow();
    });

    test('When given undefined as event name', () => {
        expect(() => baggie.on(undefined, () => {})).toThrow();
    });

    test('When not given a callback', () => {
        expect(() => baggie.on('evt')).toThrow();
    });
});
