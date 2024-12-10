import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, QuaternionKeyframeTrack, AnimationClip, Vector3, Quaternion } from 'three';
import {Plant} from './Plant.js';
import THREE from '../threejsModule.js';

class Repeater extends Plant{
    constructor(name, cost, health){
        super(name, cost, health);
    }
    
    async generatePlant(x, y, z) {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.load(
                'Plants/repeater/scene.gltf',
                resolve,
                undefined,
                reject
            );
        });
    
        const model = gltf.scene;
    
        if (model instanceof THREE.Object3D) {
            model.scale.set(3, 3, 3);
            model.rotation.set(0, 3, 0);
            model.position.set(x, y, z);
       
            return model;
          
        } else {
            throw new Error('Loaded model is not an instance of THREE.Object3D');
        }
    }
}

export {Repeater}



