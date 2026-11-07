import * as THREE from 'three';

// Class to represent spawn locations of zombies
class SpawnLocation{
    constructor(){
        this.spawn;
        this.boxGeo;
        this.material = new THREE.MeshStandardMaterial({color : 0xb5b3ae});

    }

    // Generates the spawn location of a zombie
    generateSpawnLocation(){
        this.boxGeo = new THREE.BoxGeometry(40, 16, 70);
        this.spawn = new THREE.Mesh(this.boxGeo, this.material);
        this.spawn.position.set(88, -4, 30);
        
        return this.spawn;
    }
}

export {SpawnLocation};