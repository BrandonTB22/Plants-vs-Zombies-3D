import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Ensure you have the correct import for the loader

export function Snowpea(scene, position) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            '/Plants/snowpea/scene.gltf', 
            (gltf) => {
                const snowpea = gltf.scene;
                snowpea.scale.set(1, 1, 1);
                snowpea.position.set(0, 0, 0);
                snowpea.rotation.set(0, Math.PI / 2, 0);
                scene.add(snowpea);
                console.log("Snowpea model added to the scene");
                resolve(snowpea); // Resolve with the model
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error occurred while loading the Snowpea model:', error);
                reject(error);
            }
        );
        
    });
}
