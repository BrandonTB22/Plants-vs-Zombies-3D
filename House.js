import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let house, base, upperHalf, fenceGroup;

class House {
    constructor(size, color, position) {
        this.sizeX = size[0];
        this.sizeY = size[1];
        this.sizeZ = size[2];
        this.color = color;
        this.position = position;

        this.group = new THREE.Group();
        this.textureLoader = new THREE.TextureLoader();
        this.loader = new GLTFLoader(); // Initialize the GLTFLoader
    }

    generateBase() {
        const boxGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);

        // Load the tiles texture for the top side
        const topTexture = this.textureLoader.load('./Textures/tiles.png'); // Replace with correct path
        topTexture.wrapS = THREE.RepeatWrapping;
        topTexture.wrapT = THREE.RepeatWrapping;
        topTexture.repeat.set(16, 12); // Set the repeat size of the texture, adjust if necessary

        // Create the materials for each face of the base
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // gray color for the base
        const topMaterial = new THREE.MeshStandardMaterial({ map: topTexture }); // Material with texture for the top

        // Materials for the base, using the texture for the top side only
        const baseMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Front
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Back
            topMaterial, // Top with texture
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Bottom
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Left
            new THREE.MeshStandardMaterial({ color: 0x888888 })  // Right
        ];

        // Create mesh for the base with custom materials
        base = new THREE.Mesh(boxGeo, baseMaterials);
        base.position.set(this.position[0], this.position[1] - this.sizeY / 25, this.position[2]); // Position below upper half

        this.group.add(base);
    }

    generateUpperHalf() {
        // Geometry for the upper half of the house
        const upperHalfHeight = this.sizeY / 0.25; // Half the height for the upper portion
        const boxGeo = new THREE.BoxGeometry(this.sizeX / 1.5, this.sizeY / 0.25, this.sizeZ / 1.3);
        
        // Load the texture and apply it to the front face
        const frontTexture = this.textureLoader.load('./Textures/House2.jpg'); // Replace with correct path
        frontTexture.wrapS = THREE.RepeatWrapping;
        frontTexture.wrapT = THREE.RepeatWrapping;
        frontTexture.repeat.set(1, 1); // Set the repeating of the texture (adjust as necessary)

        // Material for the upper half with texture
        const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });

        // Apply different materials for other sides if needed
        const upperMaterials = [
            frontMaterial, // Front face material with texture
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Back
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Top
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Bottom
            new THREE.MeshStandardMaterial({ color: 0x888888 }), // Left
            new THREE.MeshStandardMaterial({ color: 0x888888 })  // Right
        ];

        // Create mesh for the upper half of the house
        upperHalf = new THREE.Mesh(boxGeo, upperMaterials);
        upperHalf.position.set(this.position[0], this.position[1] + upperHalfHeight / 2, this.position[2]); // Position on top of the base

        this.group.add(upperHalf);
    }

    // Load the fence model and add it to the scene
    loadFence() {
        this.loader.load('./fence/scene.gltf', (gltf) => {
            fenceGroup = gltf.scene;
            fenceGroup.scale.set(100, 100, 100); // Adjust scale as necessary
            fenceGroup.position.set(this.position[1] - 1, this.position[1], this.position[2]); // Position it next to the house

            this.group.add(fenceGroup); // Add the fence to the house group
        }, undefined, (error) => {
            console.error('Error loading fence model:', error);
        });
    }

    generateHouse() {
        this.generateBase();
        this.generateUpperHalf();
        this.loadFence(); 
        return this.group;
    }
}

export { House };
