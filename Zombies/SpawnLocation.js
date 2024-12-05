import * as THREE from 'three';
class SpawnLocation{
    constructor(){
        this.spawn;
        this.boxGeo;
        this.material = new THREE.MeshStandardMaterial({color : 0xb5b3ae});

    }

    generateSpawnLocation(){
        this.boxGeo = new THREE.BoxGeometry(40, 16, 70);
        this.spawn = new THREE.Mesh(this.boxGeo, this.material);
        this.spawn.position.set(88, -4, 30);
        
        return this.spawn;
    }
}

export {SpawnLocation};