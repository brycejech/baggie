'use strict';

function Baggie(){
    this._events  = {};
    this._history = [];
}

Baggie.prototype.on = function on(evt, cb){
    if(!(typeof evt === 'string')){
        throw new Error('Event name must be a string');
    }
    if(!(typeof cb === 'function')){
        throw new Error('Callback must be a function');
    }

    // Create array for event name if needed, keep a ref
    const events = this._events[evt] = this._events[evt] || [];

    // Don't duplicate callbacks
    if(events.indexOf(cb) === -1) events.push(cb);
}

Baggie.prototype.off = function off(evt, cb){
    if(typeof evt !== 'string'){
        throw new Error('Event name must be a string');
    }

    const events = this._events[evt];

    if(!events) return;

    // If no callback provided, empty all events
    if(!cb) this._events[evt] = [];

    const idx = events.indexOf(cb);
    if(idx >= 0) events.splice(idx, 1);
}

Baggie.prototype.emit = function emit(evt, data){
    const fns = this._events[evt];

    if(!fns) return;

    fns.forEach( fn => fn(data) );

    this._history.push(evt);
}

Baggie.prototype.getHistory = function history(){ return this._history.reverse() }

module.exports = Baggie;
