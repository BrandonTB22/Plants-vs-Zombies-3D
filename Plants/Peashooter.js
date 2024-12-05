import { Vector3 } from "three/src/Three.js";
import THREE from "../threejsModule";
import {Plant} from './Plant.js';

// Global variables
let peashooter;
let maxPeaCount = 3;
let activePeas = [];
let availablePeas = [];

class Peashooter extends Plant{
    constructor(name, modle){
        super(name);
        this.modle = modle;
        
    }
    
    generatePlant(){
        // Using a basic box for now
        let boxGeo = new THREE.BoxGeometry(3, 6, 3);
        let material = new THREE.MeshStandardMaterial({ color : 0x00ff00});
        peashooter = new THREE.Mesh(boxGeo, material);
        peashooter.position.set(0, 5, 0)

        return peashooter;
    }

    generateDetectionZone(){
        const material = new THREE.LineBasicMaterial({color : 0xffffff});
        const points = [new THREE.Vector3(peashooter.position.x, peashooter.position.y + 2, peashooter.position.z), new THREE.Vector3(this.lawnSizeX, peashooter.position.y + 2, peashooter.position.z)];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geo, material);

        return line;
    }

    generatePeas(){
      
        for (let i = 0; i < maxPeaCount; i++){
            let boxGeo = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshStandardMaterial({color : 0x00ff00});
            let pea = new THREE.Mesh(boxGeo, material);
            availablePeas.push(pea);
        }


    }

    shootPeas(){

    }


}

export {Peashooter}
