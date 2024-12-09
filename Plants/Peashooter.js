import { Vector3 } from "three/src/Three.js";
import THREE from "../threejsModule";
import {Plant} from './Plant.js';

let line;

// Name: peashooter; Health; cost: 100 sun
class Peashooter extends Plant{
    constructor(name, modle, health, cost){
        super(name);
        this.health = health;
        this.cost = cost;
        this.modle = modle;   
        this.peashooter;
        this.pea;
        this.count = 0;
        this.finsihedPeas = [];
        this.availablePeas = [];
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
        let maxPeaCount = 3; // Total number of peas that one peashooter can shoot

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

    async shootPea(){
        let timeStep = 0.2; // How fast the peas move
        let coolDown = 3000; // Time betweens peas shots (miliseconds)
        let maxDistance = 70; // When the pea will be returned to the pool
        
        if (this.availablePeas.length == 0){
            this.finsihedPeas.forEach(pea => {
                this.availablePeas.push(pea);
            })
        }

        for (let i = 0; i < this.availablePeas.length; i ++){
          
            this.availablePeas[i].position.set(this.availablePeas[i].position.x += timeStep, this.peashooter.position.y + 2, this.peashooter.position.z);
            
            if (this.availablePeas[i].position.x > maxDistance){
                this.finsihedPeas.push(this.availablePeas[i]);
                this.availablePeas.splice(this.availablePeas.indexOf(this.availablePeas[i]), 1);
                
            }

            await this.sleep(coolDown);
        }
    }
}

export {Peashooter}
