import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "../threejsModule";
import { Vector3 } from "three/src/Three.js";
import { Plant } from './Plant.js';

// Name: peashooter; Cost: 100 sun
class Peashooter extends Plant {
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ); // Pass all parameters to the Plant constructor
          // Additional properties for Peashooter
        this.raycaster = new THREE.Raycaster();
        this.peagenerated = false;
        this.shootCooldown = 2000;
        this.lastTimeShot = 0;
        this.zombie;
        this.health;
        this.availablePeas = [];
        this.pea;
        this.distanceTo;
        this.minDistance = Infinity;
        this.closestZombie;
        this.intersects;
        this.delay = 0;
    }

    setMinDistance(distance){
        this.minDistance = distance;
    }

    getMinDistance(){
        return this.minDistance;
    }
    setClosestZombie(zombie){
        this.closestZombie = zombie;
    }

    getClosestZombie(){
        return this.closestZombie;
    }

    setDistanceTo(distanceTo){
        this.distanceTo = distanceTo;
    }

    getDistanceTo(){
        return this.distanceTo;
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
        
    }

    canShoot(){
        return Date.now() - this.lastTimeShot >= this.shootCooldown;
    }

    // Detect an intersection between the raycasting an zombie
    detectIntersection(target){
        let tar = target.model.getObjectByName('hitbox');
        const origin = this.model.position;
        const forward = new THREE.Vector3(1, 0, 0);

        this.raycaster.set(origin, forward);
        this.intersects = this.raycaster.intersectObject(tar);

        if (this.intersects.length > 0){
            return true;
        } else {
            return false;
        }
    }

    getZPosition(){
        return this.model.position.z;
    }

    setDelay(delay){
        this.delay = delay;
    }

    getDelay(){
        return this.delay;
    }


    
    // Shoot a pea if a zombie is detected
    shootPea(target, scene, delay){
        let zombie = target;
        let tar = target.model.getObjectByName('hitbox');

        const maxPos = 90;
        const startPos = this.model.position.x;

        // Generate the pea if not already
        if (this.availablePeas.length < 1){
            const geo = new THREE.SphereGeometry(1, 10, 10);
            const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
            this.pea = new THREE.Mesh(geo, material);
            this.pea.position.set(this.model.position.x + 5, this.model.position.y + 1.8, this.model.position.z);
            this.pea.visible = false;
            scene.add(this.pea);
            this.availablePeas.push(this.pea);
        } 
        
        if (zombie.getHealth() <= 0){
            this.pea.visible = false;
            return false;
        }

        if (!this.pea.visible) {
            if (!this.canShoot()) {
                return false;
            }

            this.pea.position.set(
                this.model.position.x + 5,
                this.model.position.y + 1.8,
                this.model.position.z,
            );
            this.pea.visible = true;
            this.lastTimeShot = Date.now();
        }
            
        // If the pea goes beyond the max distance, set it back to the original position
        if (this.pea.position.x >= tar.parent.position.x){
            this.pea.position.x = startPos;
            this.pea.visible = false;
            zombie.reduceHealth(100);
            return false;
            
        } else if (this.pea.position.x < maxPos){
            this.pea.position.x += 0.3;
        
        } else {
            this.pea.position.x = startPos;
            this.pea.visible = false;
            return false;
        }
    }
}

export {Peashooter}
