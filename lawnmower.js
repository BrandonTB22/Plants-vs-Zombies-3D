import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { Lawn } from './Lawn'; // Ensure this path is correct based on your project structure

let modelPath = '/lawn_mower/scene.gltf';

class Lawnmower {
    constructor(scene, lawn, size = { x: 1, y: 1, z: 1 }) {
        this.scene = scene;  // The scene where the model will be added
        this.lawn = lawn;    // The lawn object to get the edge position
        this.model = null;   // To store the lawnmower model
        this.size = size;    // The size of the lawnmower (default is { x: 1, y: 1, z: 1 })

        this.loadModel();    // Start loading the model when an instance is created
    }

    // Load the lawnmower model and position it at the edge of the lawn
    loadModel() {
        const loader = new GLTFLoader();

        loader.load(modelPath, (gltf) => {
            // Extract the model from the glTF scene
            this.model = gltf.scene;

            // Apply the scaling based on the size property
            this.model.scale.set(this.size.x, this.size.y, this.size.z);

            // Position the lawnmower at the edge of the lawn
            this.positionAtEdge();

            // Add the lawnmower to the scene
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error("An error happened while loading the model: ", error);
        });
    }
}

export { Lawnmower };
