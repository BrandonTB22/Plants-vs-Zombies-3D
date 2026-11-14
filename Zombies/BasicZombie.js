import { Zombie } from './Zombie.js';

// Basic Zombie
class BasicZombie extends Zombie {
    constructor(type, health, scene){
        super(type, health)
        this.model;
        this.spawns = [0, 8, 16, 24, 32]
        this.scene = scene;
        this.isAlive = true;
        this.boxHelper = null;
        this.hitbox = null;

        this.rand = Math.floor(Math.random() * this.spawns.length)
        this.lane = this.spawns[this.rand];

    }


getType(){
    return this.type;
}

// Position zombie to spawn point
setToSpawnPosition(x, y, z){
    this.model.position.set(x, y, z);
}




}

export {BasicZombie}


