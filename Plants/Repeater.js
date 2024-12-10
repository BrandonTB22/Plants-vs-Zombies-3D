import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, QuaternionKeyframeTrack, AnimationClip, Vector3, Quaternion } from 'three';

export function Repeater(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('Plants/repeater/scene.gltf', function (gltf) {
            const model = gltf.scene;
            model.scale.set(3, 3, 3); // Scale the model to fit in the scene
            scene.add(model); // Add the model to the scene
          

            // Optionally, you can add animations to the model if it has any
            // const mixer = new THREE.AnimationMixer(model);
            // gltf.animations.forEach((clip) => mixer.clipAction(clip).play());

            resolve(model); // Resolve the promise with the model
        }, undefined, function (error) {
            console.error('Error loading Repeater model', error);
            reject(error); // Reject the promise if there’s an error
        });
    });
}
