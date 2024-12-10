
import THREE from "../threejsModule";
import { Vector3 } from "three/src/Three.js";
import {Plant} from './Plant.js';

let line;


// Name: peashooter; Health; cost: 100 sun
class Peashooter extends Plant {
    constructor(name, model, health, cost, Xblock, Yblock, lawn) {
        super(name, cost, health, Xblock, Yblock, lawn); // Pass all parameters to the Plant constructor
        this.model = model;  // Additional properties for Peashooter
        this.peashooter;
        this.pea;
        this.count = 0;
        this.availablePeas = [];
        this.finishedPeas = [];
    }

    getCost(){
        return this.cost;
    }
    getHealth(){
        return this.health;
    }

    getName(){
        return this.name;
    }

    generatePlant(){
        // Using a basic box for now
        let boxGeo = new THREE.BoxGeometry(3, 6, 3);
        let material = new THREE.MeshStandardMaterial({ color : 0x00ff00});
        this.peashooter = new THREE.Mesh(boxGeo, material);
     
        return this.peashooter;
    }

    generatePeas(){
        let maxPeaCount = 2; // Total number of peas that one peashooter can shoot

        for (let i = 0; i < maxPeaCount; i++){
            let boxGeo = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshStandardMaterial({color : 0x00ff00});
            let pea = new THREE.Mesh(boxGeo, material);
            pea.position.set(this.peashooter.position.x, this.peashooter.position.y + 2, this.peashooter.position.z);
            this.availablePeas.push(pea);
        }

        return this.availablePeas;
    }

    setPosition(x, y, z){
        this.peashooter.position.set(x, y, z);
    }

    generateDetectionZone(){
        const start = new THREE.Vector3(this.peashooter.position.x, this.peashooter.position.y + 2, this.peashooter.position.z);
        const end = new THREE.Vector3(this.lawnSizeX, this.peashooter.position.y + 2, this.peashooter.position.z);
        line = new THREE.Line3(start, end);

        return line;
    }


    detectIntersection(box){
        if (box.intersectsLine(line)){
            console.log("collision");
        }
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    shootPea(){
        let timeStep = 0.4; // How fast the peas move
        let coolDown = 1000; // Time betweens peas shots (miliseconds)
        let maxDistance = 70; // When the pea will be returned to the pool
        let pea1 = this.availablePeas[0];
        
        let startPos = this.peashooter.position.x;
        
        if (pea1.position.x <= maxDistance){
            pea1.visible = true;
            pea1.position.x += timeStep;
        } else if (pea1.position.x > maxDistance){
            pea1.visible = false;
            setTimeout(() => {
               
                pea1.position.x = startPos;
            }, coolDown);
           
        }

    }
}
    
        


export {Peashooter}
