import { timerDelta } from "three/webgpu";
import THREE from "../threejsModule";

class SUnflower extends Plant {

    constructor (name, model, health, cost){
        super (name);
        this.model = model;
        this.health = health;
        this.cost = cost;
    }

    generatePlant(){
        let boxGeo = new THREE.BoxGeometry(5, 5, 5,);
        let material = new THREE.MeshBasicMaterial({color: 0x00ffff});
        let flower = new THREE.Mesh(boxGeo, material);

        return flower;
    }
}