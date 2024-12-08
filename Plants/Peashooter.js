import { Vector3 } from "three/src/Three.js";
import THREE from "../threejsModule";
import {Plant} from './Plant.js';

// Global variables
let peashooter;
let maxPeaCount = 3;
let activePeas = [];
let availablePeas = [];
let line;

class Peashooter extends Plant{
    constructor(name, modle, health, cost){
        super(name);
        this.health = health;
        this.cost = cost;
        this.modle = modle;   
    }

    getCost(){
        return this.cost;
    }
    getHealth(){
        return this.health;
    }

    generatePlant(){
        // Using a basic box for now
        let boxGeo = new THREE.BoxGeometry(3, 6, 3);
        let material = new THREE.MeshStandardMaterial({ color : 0x00ff00});
        peashooter = new THREE.Mesh(boxGeo, material);

        return peashooter;
    }

    setPosition(x, y, z){
        peashooter.position.set(x, y, z);
    }

    generateDetectionZone(){
        const start = new THREE.Vector3(peashooter.position.x, peashooter.position.y + 2, peashooter.position.z);
        const end = new THREE.Vector3(this.lawnSizeX, peashooter.position.y + 2, peashooter.position.z);
        line = new THREE.Line3(start, end);

        return line;
    }

    generatePeas(){

        let maxPeaCount = 3; // Total number of peas that one peashooter can shoot

        for (let i = 0; i < maxPeaCount; i++){
            let boxGeo = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshStandardMaterial({color : 0x00ff00});
            let pea = new THREE.Mesh(boxGeo, material);
            pea.position.set(peashooter.position.x, peashooter.position.y + 2, peashooter.position.z)
            availablePeas.push(pea);
        }

        return availablePeas;
    }

    createBoundingBox(){

    }

    detectIntersection(box){
        if (box.intersectsLine(line)){
            console.log("collision");
        }
    }

    shootPea(){
        let timeStep = 0.1; // How fast the peas move
        let coolDown = 1000; // Time betweens peas shots (miliseconds)
        let maxDistance = 200; // When the pea will be returned to the pool
        
        if (availablePeas.length > 0){
       
            availablePeas[0].visible = true;
            availablePeas[0].position.set(availablePeas[0].position.x + timeStep, peashooter.position.y + 2, peashooter.position.z);
            
        }
    }
}

export {Peashooter}
