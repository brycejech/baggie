'use strict';

import Baggie from './Baggie';

let baggie;

describe('Instance should handle events', () => {
    baggie = new Baggie();

    const event = 'my-event';
    function fn(data){ console.log(data) }

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
