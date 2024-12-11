import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, QuaternionKeyframeTrack, AnimationClip, Vector3, Quaternion } from 'three';
import {Plant} from './Plant.js';

class Potatomine extends Plant{
    constructor(name, cost, health){
        super(name, cost, health);
    }


    generatePlant(scene) {
      
        new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('Plants/potato_mine/scene.gltf', function (gltf){
                const model = gltf.scene;
                
                model.scale.set(3, 3, 3); // Scale the model to fit in the scene
                model.rotation.set(0, 3, 0);
                resolve(model); // Resolve the promise with the model
                scene.add(model);
              
            }, undefined, function (error){
                console.error('Error loading Potatomine model', error);
                reject(error); // Reject the promise if there’s an error
            });
        });
     
    
    }

    
}

export {Potatomine}



