import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'; // Assuming you are using Three.js
import {Plant} from './Plant.js';

class Sunflower extends Plant {
    constructor(name, model, health, cost) {
        super(name);
        this.model = model;
        this.health = health;
        this.cost = cost;
    }

    // Updated method to load the sunflower model
    generatePlant(scene) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();

            loader.load(
                'Plants/sunflower/scene.gltf', // Path to the sunflower model
                (gltf) => {
                    const sunflower = gltf.scene; // Get the 3D model

                    // Adjust the model's position and scale if necessary
                    sunflower.scale.set(5, 5, 5); // Set scale for the model
                    sunflower.position.set(0, 0, 0); // Set position (adjust as needed)

                    // Add the sunflower model to the scene
                    scene.add(sunflower);

                    // Resolve with the sunflower model
                    resolve(sunflower);
                },
                undefined,
                (error) => {
                    console.error('Error loading the sunflower model:', error);
                    reject(error); // Reject if there’s an error
                }
            );
        });
    }
}

// Default export
export default Sunflower;
