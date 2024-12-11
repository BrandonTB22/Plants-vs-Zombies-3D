import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "../threejsModule";
import { Vector3 } from "three/src/Three.js";
import {Plant} from './Plant.js';
import { mod } from 'three/webgpu';

// Name: peashooter; Cost: 100 sun
class Peashooter extends Plant {
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ); // Pass all parameters to the Plant constructor
          // Additional properties for Peashooter
        this.raycaster = new THREE.Raycaster();
        this.peagenerated = false;
        this.intersects;
        this.count = 0;
        this.availablePeas = [];
        this.peal

    }

    getCost(){
        return this.cost;
    }
    getHealth(){
        return this.health;
    }

    generatePeas(){
        let maxPeaCount = 2; // Total number of peas that one peashooter can shoot
        
        for (let i = 0; i < maxPeaCount; i++){
            let boxGeo = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshStandardMaterial({color : 0x00ff00});
            let pea = new THREE.Mesh(boxGeo, material);
            // pea.position.set(this.peashooter.position.x, this.peashooter.position.y + 2, this.peashooter.position.z);
            this.availablePeas.push(pea);
          
        }

        return this.availablePeas;
    }


    generateDetectionZone(){
        const geo = new THREE.BoxGeometry(70 - this.model.position.x, 5, 5);
        const material = new THREE.MeshBasicMaterial({color : 0xffffff});
        const box = new THREE.Mesh(geo, material);
        box.position.set(this.model.position.x + box.geometry.parameters.width / 2, this.model.position.y, this.model.position.z);

        return box;
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    shootPea(){
        const speed = 0.1;
        
        if (this.availablePeas.length <  1){
            const geo = new THREE.BoxGeometry(3, 3, 3);
            const material = new THREE.MeshBasicMaterial({color : 0xffffff});
            this.pea = new THREE.Mesh(geo, material);
    
            this.availablePeas.push(this.pea);
          
            
        } else {
            
            console.log(this.pea.position.x);
            this.pea.position.x += 0.1;
        }
        
       
        // pea.position.add(direction.clone().multiplyScalar(speed));

        /*
            if (target.position != undefined){
                let direction = new THREE.Vector3().subVectors(target.position, this.peashooter.position).normalize();
            
            if (pea.position.distanceTo(target.position) < 0.5){
                pea.visible= false;
            } else {
                // Move the pea
                pea.position.add(direction.clone().multiplyScalar(speed));
            }
        }
            */
    }
      
    detectZombie(zombie){
        
        const forward = new THREE.Vector3(1.5, 0, 0);
        
        if (this.model != null){
            const origin = this.model.position;

            this.raycaster.set(origin, forward);

            this.intersects = this.raycaster.intersectObjects(zombie);
            
            this.shootPea(zombie);
        }
    
        if (this.intersects.length > 0){
            console.log("zombie detected");

            this.shootPea(this.intersects[0].object);
        }
    
      
    }
            

    }

    
        


export {Peashooter}
