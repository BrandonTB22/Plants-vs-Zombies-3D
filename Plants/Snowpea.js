import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "../threejsModule";
import { Vector3 } from "three/src/Three.js";
import { Plant } from './Plant.js';

// Name: Snowpea; Cost: 150 sun
class Snowpea extends Plant {
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ); // Pass all parameters to the Plant constructor
        this.raycaster = new THREE.Raycaster();
        this.peagenerated = false;
        this.shootCooldown = 1500; // Slower cooldown for Snowpea
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

    setMinDistance(distance) {
        this.minDistance = distance;
    }

    getMinDistance() {
        return this.minDistance;
    }

    setClosestZombie(zombie) {
        this.closestZombie = zombie;
    }

    getClosestZombie() {
        return this.closestZombie;
    }

    setDistanceTo(distanceTo) {
        this.distanceTo = distanceTo;
    }

    getDistanceTo() {
        return this.distanceTo;
    }

    getCost() {
        return this.cost;
    }

    setHealth() {
        this.health = 100;
    }

    getHealth() {
        return this.health;
    }

    generatePeas() {
        let maxPeaCount = 2; // Total number of peas that one Snowpea can shoot

        for (let i = 0; i < maxPeaCount; i++) {
            let boxGeo = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshStandardMaterial({ color: 0x00ccff }); // Light blue for snow peas
            let pea = new THREE.Mesh(boxGeo, material);
            this.availablePeas.push(pea);
        }

        return this.availablePeas;
    }

    generateDetectionZone() {
        const geo = new THREE.BoxGeometry(70 - this.model.position.x, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: 0x99ccff }); // Lighter color for detection zone
        const box = new THREE.Mesh(geo, material);
        box.position.set(this.model.position.x + box.geometry.parameters.width / 2, this.model.position.y, this.model.position.z);

        return box;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    playSoundEffect() {
        const listener = new THREE.AudioListener();
        const audioloader = new THREE.AudioLoader();
        const frostSound = new THREE.Audio(listener);

        audioloader.load('./SoundFiles/frost.mp3', (buffer) => {
            frostSound.setBuffer(buffer);
            frostSound.setLoop(false);
            frostSound.setVolume(1);
        });

        return frostSound.play();
    }

    reduceZombieHealth(zombie) {
        // Reduce health and apply slowing effect
        zombie.reduceHealth(50);
        zombie.applySlowEffect(2); // Custom method to slow zombie (needs to be implemented in Zombie class)
    }

    canShoot() {
        return Date.now() - this.lastTimeShot >= this.shootCooldown;
    }

    detectIntersection(target) {
        let tar = target.model.getObjectByName('hitbox');
        const origin = this.model.position;
        const forward = new THREE.Vector3(1, 0, 0);

        this.raycaster.set(origin, forward);
        this.intersects = this.raycaster.intersectObject(tar);

        return this.intersects.length > 0;
    }

    shootPea(target, scene, delay) {
        let time = Date.now();
        let velocity = 0.25; // Slower velocity for Snowpea
        let zombie = target;
        let tar = target.model.getObjectByName('hitbox');

        const speed = 0.25;
        const maxPos = 90;
        const coolDown = 2000;
        const startPos = this.model.position.x;

        if (this.availablePeas.length < 1) {
            const geo = new THREE.SphereGeometry(1, 10, 10);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ccff });
            this.pea = new THREE.Mesh(geo, material);
            this.pea.position.set(this.model.position.x + 5, this.model.position.y + 1.8, this.model.position.z);
            this.pea.visible = false;
            scene.add(this.pea);
            this.availablePeas.push(this.pea);
        }

        if (zombie.getHealth() <= 0) {
            return false;
        }

        this.pea.visible = true;

        if (this.pea.position.x >= tar.parent.position.x) {
            this.pea.position.x = startPos;
            this.reduceZombieHealth(zombie);
            console.log(zombie.getHealth());
            return false;
        } else if (this.pea.position.x < maxPos) {
            this.pea.position.x += 0.25;
        } else if (this.pea.position.x > maxPos) {
            return false;
        }
    }
}

export { Snowpea };
