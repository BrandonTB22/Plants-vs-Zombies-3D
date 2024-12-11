import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "../threejsModule";
import { Vector3 } from "three/src/Three.js";
import {Plant} from './Plant.js';
import { max } from 'three/webgpu';


// Name: peashooter; Cost: 100 sun
class Peashooter extends Plant {
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ); // Pass all parameters to the Plant constructor
          // Additional properties for Peashooter
        this.raycaster = new THREE.Raycaster();
        this.peagenerated = false;
        this.shootCooldown = 1000;
        this.lastTimeShot = 0;
        this.zombie;
        this.health;
        this.availablePeas = [];
        this.pea

    }

    getCost(){
        return this.cost;
    }

    setHealth(){
        this.health = 100;
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

    playSoundEffect(){
        const listener = new THREE.AudioListener();
        const audioloader = new THREE.AudioLoader();
        const splatSound = new THREE.Audio(listener);

        audioloader.load('./SoundFiles/splat.mp3', (buffer) => {
            splatSound.setBuffer(buffer);
            splatSound.setLoop(false);
            splatSound.setVolume(1);
        });

        return splatSound.play();
    }

    reduceZombieHealth(zombie){
        console.log(zombie.getHealth());
    }

    canShoot(){
        return Date.now() - this.lastTimeShot >= this.shootCooldown;
    }

    shootPea(target){
        let zombie = target;
        let tar = target.model.getObjectByName('hitbox');
        let zombieHit;
       
        const speed = 0.3;
        const maxPos = 74;
        const coolDown = 2000;
        const origin = this.model.position;
        const forward = new THREE.Vector3(1, 0, 0);

        this.raycaster.set(origin, forward);
        let intersects = this.raycaster.intersectObject(tar);

        // Generate the pea if not already
        if (this.availablePeas.length < 1){
            const geo = new THREE.SphereGeometry(1, 10, 10);
            const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
            this.pea = new THREE.Mesh(geo, material);
            this.pea.position.set(this.model.position.x + 5, this.model.position.y + 1.8, this.model.position.z);
            this.pea.visible = false;
            this.availablePeas.push(this.pea);
        } 
        
        if (intersects.length > 0 && zombie.getHealth() > 0){
            this.pea.visible = true;
            console.log("zombie was detected");


            
            if (zombie.getHealth() <= 0) {
                intersects.splice(intersects[0], 1);
                
                
            }
                
                if (this.pea.position.x > maxPos){
                    //this.pea.visible = false;
                    this.pea.position.x = this.model.position.x;
                    setTimeout(() => {
                        
                        this.pea.position.x = this.model.position.x;
                        this.pea.visible = false;
                    }, coolDown)
                
                    
                } else if (intersects[0].point.x <= this.pea.position.x){
               
                        this.pea.visible = false;
                        this.pea.position.x = this.model.position.x;
                            setTimeout(() => {
                                
                                this.pea.visible = false;
                                 
                            },coolDown);

                                // Make sure the function only runs once
                                for (let i = 0; i < 1; i++){
                                    zombie.reduceHealth(100);
                                    console.log("reduced health");
                                    console.log(zombie.getHealth());
                                }
                          

                            return;
                }
                else {
                   
                    this.pea.position.x += speed;
                }
            } 
        
        
        
        return this.pea;
       
      
    }
      
}



    
        


export {Peashooter}
