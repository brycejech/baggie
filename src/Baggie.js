'use strict';

function _setup(ctx){
    ctx._events  = {};
    ctx._globals = [];
    ctx._history = [];

    // Get most recent items first
    Object.defineProperty(ctx, 'history', {
        get: function history(){ return ctx._history.reverse() }
    });

    return ctx;
}

function Baggie(){
    _setup(this);

    return this;
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

    return this;
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

    return this;
}

Baggie.prototype.onGlobal = function onGlobal(cb){
    const globals = this._globals;

    if(globals.indexOf(cb) === -1) globals.push(cb);

    return this;
}

Baggie.prototype.offGlobal = function offGlobal(cb){

    // If no callback provided, empty all events
    if(!cb){
        this._globals = [];
        return this;
    }

    const globals = this._globals,
          idx     = globals.indexOf(cb);

    if(idx >= 0) globals.splice(idx, 1);

    return this;
}

Baggie.prototype.emit = function emit(evt, data){
    this._history.push(evt);

    // Call global handlers first
    this._globals.forEach(fn =>  fn(evt, data));

    const fns = this._events[evt];

    if(!fns) return this;

    fns.forEach( fn => fn(data) );

    return this;
}

Baggie.prototype.getHistory = function history(){ return this._history.reverse() }

Baggie.prototype.empty = Baggie.prototype.reset = function empty(){
    _setup(this);

    return this;
}

module.exports = Baggie;
