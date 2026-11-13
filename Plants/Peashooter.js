import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "../threejsModule";
import { Vector3 } from "three/src/Three.js";
import { Plant } from './Plant.js';
import { Zombie } from '../Zombies/Zombie.js'

// Name: peashooter; Cost: 100 sun
class Peashooter extends Plant {
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ); // Pass all parameters to the Plant constructor
          // Additional properties for Peashooter
        this.raycaster = new THREE.Raycaster();
        this.peagenerated = false;
        this.shootCooldown = 2000;
        this.lastTimeShot = 0;
        this.isShooting = false;
        this.health;
        this.availablePeas = [];
        this.pea;
        this.peaBox;
        this.distanceTo;
        this.minDistance = Infinity;
        this.closestZombie;
        this.intersects;
        this.delay = 0;
        this.detectionZone = null;
        this.detectionZoneHelper = null;
        this.boundingBox = null;
        this.audioListener = new THREE.AudioListener();
        this.splatSoundBuffer = null;
        this.pendingSplatHits = 0;
        this.splatSoundLoadFailed = false;
        this.zombiesInRange = [];

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('./SoundFiles/splat.mp3', (buffer) => {
            this.splatSoundBuffer = buffer;
            const pendingSplatHits = this.pendingSplatHits;
            this.pendingSplatHits = 0;
            for (let i = 0; i < pendingSplatHits; i++) {
                this.playSoundEffect();
            }
        }, undefined, (error) => {
            this.splatSoundLoadFailed = true;
            this.pendingSplatHits = 0;
            console.error('Failed to load splat sound:', error);
        });
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
            this.availablePeas.push(pea);
          
        }

        return this.availablePeas;
    }

    getBoundingBox() {
        return this.boundingBox;
    }

    // Generate the detection zone for the peashooter
    generateDetectionZone(scene, pos){

        const geo = new THREE.BoxGeometry(70 - pos.x, 5, 5);
        const material = new THREE.MeshBasicMaterial({color : 0xffffff});
        const box = new THREE.Mesh(geo, material);
        this.boundingBox = new THREE.Box3();

        box.position.set(pos.x + box.geometry.parameters.width / 2, pos.y, pos.z);
        box.visible = false;

        if (globalThis.DEBUG){
            scene.add(box);
               
            const boxHelper = new THREE.BoxHelper(box, 0xffff00);
            scene.add(boxHelper);
            boxHelper.update();

            this.detectionZoneHelper = boxHelper;
        }
     

        this.boundingBox.setFromObject(box);

        this.detectionZone = box;
    

    }

    // Remove the detection zone for the peashooter
    removeDetectionZone(scene){
        if (!this.detectionZone) {
            return;
        }

        scene.remove(this.detectionZone);

        this.detectionZone.geometry.dispose();
        this.detectionZone.material.dispose();

        if (globalThis.DEBUG) {
            scene.remove(this.detectionZoneHelper);
            this.detectionZoneHelper.geometry.dispose();
            this.detectionZoneHelper.material.dispose();
            this.detectionZoneHelper = null;
        }
     
        this.detectionZone = null;
     

    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    playSoundEffect(){
        if (this.splatSoundLoadFailed) {
            return;
        }

        if (!this.splatSoundBuffer) {
            this.pendingSplatHits++;
            return;
        }

        const splatSound = new THREE.Audio(this.audioListener);
        splatSound.setBuffer(this.splatSoundBuffer);
        splatSound.setLoop(false);
        splatSound.setVolume(1);
        splatSound.play();
    }

    // Reduce a zombies health
    reduceZombieHealth(zombie){
        zombie.reduceHealth(100);
        console.log("Zombie Health: " + zombie.getHealth());

      
    }

    canShoot(){
        return Date.now() - this.lastTimeShot >= this.shootCooldown;
    }

    // Detect an intersection between the raycasting an zombie
    detectZombie(target){

        if (target instanceof Zombie){
              let tar = target.model.getObjectByName('hitbox');

              this.shootPea();
        } else {
            return;
        }
      
        
     

    }

    getPosition(){
        return this.model.position;
    }

    setDelay(delay){
        this.delay = delay;
    }

    getDelay(){
        return this.delay;
    }

    // Move pea forward at a constant speed
    movePea(){
      
        // Return pea back to start if it goes out of bounds
        if (this.pea.position.x >= 90) {
            this.pea.position.set(this.model.position.x, this.model.position.y + 1.8, this.model.position.z);
            this.isShooting = false;
        } else{

             // If pea intersects zombie, reduce zombie health
            this.zombiesInRange.forEach((zombie) => {

                // Reduce zombie health if pea hits zombie
                if (zombie.hitbox != null && this.peaBox.intersectsBox(zombie.hitbox)) {
                    this.reduceZombieHealth(zombie);
                    this.playSoundEffect();
                    this.pea.position.set(this.model.position.x, this.model.position.y + 1.8, this.model.position.z);
                    this.isShooting = false;

                    this.pea.updateMatrixWorld(true, false);
                    this.peaBox.setFromObject(this.pea);
                }

                // Remove zombie from array if they are defeated
                if (zombie.getHealth() <= 0) {
                    this.zombiesInRange.pop();
                    console.log(this.zombiesInRange.length);
                    return;
                }
                });

                

            this.pea.position.x += 0.3; // Move pea forward

            this.pea.updateMatrixWorld(true, false);
            this.peaBox.setFromObject(this.pea);
        }
    }

    // Generate pea to be shot
    generatePea(scene){
        if (this.availablePeas.length < 1){
            const geo = new THREE.SphereGeometry(1, 10, 10);
            const material = new THREE.MeshBasicMaterial({color: '#0cc44f'});
            this.pea = new THREE.Mesh(geo, material);
            this.peaBox = new THREE.Box3();
            this.peaBox.setFromObject(this.pea);

            scene.add(this.pea);

            if (globalThis.DEBUG){
                const boxHelper = new THREE.Box3Helper(this.peaBox, {color: '#cbd269'} );
                scene.add(boxHelper);
            }
          
            

            this.pea.position.set(this.model.position.x, this.model.position.y + 1.8, this.model.position.z);
            this.pea.visible = false;
            
            this.availablePeas.push(this.pea);
        } 
    }

    // Adds a zombie to be in range
    addInRangeZombie(zombie) {
        this.zombiesInRange.push(zombie);
    }

    // Get zombies in range
    getZombiesInRange(){
        return this.zombiesInRange;
    }

    
    // Shoot a pea if a zombie is detected
    shootPea(scene){

        // Generate the pea if not already
        this.generatePea(scene);
        
        // Shoot pea and set last time shot, otherwise finish shooting
        if (this.zombiesInRange.length > 0 && this.canShoot()) {
            this.isShooting = true;
            this.pea.visible = true;
            this.movePea();
            this.lastTimeShot = Date.now(); // Set last shot for cooldown
        } else if (this.isShooting) {
            this.pea.visible = true;
            this.movePea();
        } else {
            this.isShooting = false;
        }
    }
}

export {Peashooter}
