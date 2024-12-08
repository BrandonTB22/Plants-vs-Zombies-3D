import THREE from "../threejsModule";
import {Zombie} from './Zombie.js';

let zombie;
class BasicZombie extends Zombie{

    constructor(name, model){
        super(name);
        this.model = model;
    }

    generateZombie(){
        // A basic box for now
        let geo = new THREE.BoxGeometry(2, 5, 2);
        let material = new THREE.MeshStandardMaterial({color: 0xffffff});
        zombie = new THREE.Mesh(geo, material);
        zombie.position.set(10, 5, 0);

        return zombie;
    }

    createBoundingBox(){
        let boundingBox = new THREE.Box3().setFromObject(zombie);

        return boundingBox;
    
    }

    
}

export {BasicZombie}