import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'; // Assuming you are using Three.js
import {Plant} from './Plant.js';

class Sunflower extends Plant {
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ);
      
        this.sunTime = 5000; // 24 seconds it gives sun
        this.sun;
        this.currentSun;
        this.activeSuns = [];
        this.sunValue = 25;
        this.camera;
        this.counter;
        
         // Initialize raycaster for click detection
         this.raycaster = new THREE.Raycaster();
         this.mouse = new THREE.Vector2();
 
         // Bind click event
         window.addEventListener('click', (event) => this.handleClick(event));
    }

    setCamera(camera){
        this.camera = camera;
    }
    generateSunPool(){
        // Create sun sphere
        
        const sunGeometry = new THREE.SphereGeometry(5/3, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.visible = false; // Initially hide the suns
        this.sun = sun;
        this.activeSuns.push(sun);
        
    }

    getCost(){
        return this.cost;
    }

    handleClick(event) {
        // Update mouse position for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


        // Perform raycasting to detect suns
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.activeSuns);

        if (intersects.length > 0) {
            
            const clickedSun = intersects[0].object;
            clickedSun.visible = false;

            this.updateSunCount(this.counter);
        }
    }

    setCounter(element){
        this.counter = element;
    }


    
    giveSun(){
       
            this.sun.position.set(this.model.position.x, this.model.position.y + 3, this.model.position.z + 2);
            this.sun.visible = true;
            console.log("giving sun");
    
            return this.sun;

    }

    getSunValue(){
        return this.sunValue;
    }

    updateSunCount(element){
        const currentEnergy = parseInt(element.textContent, 10);
        element.textContent = currentEnergy + this.sunValue;
    }

    
    

}

// Default export
export {Sunflower}
