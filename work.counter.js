/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('work.counter');
 * mod.thing == 'a thing'; // true
 */

module.exports.run = function(debug = false) {
    var _cpu = Game.cpu.getUsed();
    var bigSpawner = require('spawn.big');
    var midSpawner = require('spawn.mid');
    var smallSpawner = require('spawn.small');
    var minerSpawner = require('spawn.miner');
    var extractorSpawner = require('spawn.extractor');
    bigSpawner.count();
    midSpawner.count();
    smallSpawner.count();
    minerSpawner.count();
    extractorSpawner.count();

    // Loop through the rooms
    for(var name in Game.rooms) {
        var theRoom = Game.rooms[name];
        // Are there any hostiles?
        var hostiles = theRoom.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0 && !theRoom.memory.guard) {
            Game.notify(Game.time + ' Room put into guard mode spawning guards');
            theRoom.memory.guard = true;
        }
        if (hostiles.length == 0 && theRoom.memory.guard) {
            Game.notify(Game.time + ' Room no longer in guard mode');
            theRoom.memory.guard = false;
            delete theRoom.memory.guard;
        }
        if (theRoom.memory.guard) {
            var guardSpawner = require('spawn.guard');
            guardSpawner.count();
            console.log('We are still in guard mode');
        }
        var list = _.filter(Game.creeps, (creep) => !creep.memory.dying);
        if (list.length == 0 && !theRoom.memory.emergency){
            Game.notify(Game.time + ' Room '+ name + ' In Emergency Mode!!');
            console.log('Emergency Activated');
            theRoom.memory.emergency = true;
            delete theRoom.memory.assignedSources;
            var miner = require('spawn.miner');
            miner.setup();

        }
        if (list.length >= 15 && theRoom.memory.emergency) {
            Game.notify(Game.time + ' Room ' + name + ' No Longer in Emergency Mode');
            console.log('Emergency Deactivated');
            theRoom.memory.emergency = false;
            delete theRoom.memory.emergency;
        }
        if (theRoom.memory.emergency) {
            console.log('We have ' + list.length + ' total creeps still in emergency mode');
        }
        // If the room sources need resetting
        if (theRoom.memory.sourceReset) {
            Game.notify(Game.time + ' Room ' + name + ' Resetting mining sources');
            console.log('Resetting Room Sources');
            var miner = require('spawn.miner');
            miner.setup();
            Game.notify(Game.time + ' Room ' + name + ' Sources reset successfully.');
            console.log('Room sources reset successfully');
            delete theRoom.memory.sourceReset;
        }

        console.log(name + ':' + Game.rooms[name].energyAvailable);
    }
    console.log('Counter used ' + (Game.cpu.getUsed() - _cpu).toFixed(3) + ' CPU');
}
