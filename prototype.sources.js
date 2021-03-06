// This is called during global reset to set up source memory,
// because it doesn't need to be called often.
if(!Memory.sources) {
    console.log('[Memory] Initializing source memory');
    Memory.sources = {};
}

// Adds source memory to Source things.
// Easier to reason about garbage collection in this implementation.
Object.defineProperty(Source.prototype, "memory", {
    get: function () {
        if(!Memory.rooms[this.room.name].sources)
            Memory.rooms[this.room.name].sources = {}
        if(!Memory.rooms[this.room.name].sources[this.id])
            Memory.rooms[this.room.name].sources[this.id] = {};
        return Memory.rooms[this.room.name].sources[this.id];
    },
    set: function(v) {
        return _.set(Memory, 'sources.' + this.room.name + '.sources.' + this.id, v);
    },
    configurable: true,
    enumerable: false
});

// Call this periodically to garbage collect source memory
// (I find once every 10k ticks is fine)
global.GCSourceMemory = function() {
   for (var id in Memory.sources )
            if(!Game.sources[this.room.name][id]) {
                console.log("Garbage collecting source " + id + ', ' + JSON.stringify(Memory.sources[id]));
                delete Memory.sources[id];
            }
}
