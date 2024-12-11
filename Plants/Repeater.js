import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, QuaternionKeyframeTrack, AnimationClip, Vector3, Quaternion } from 'three';
import {Plant} from './Plant.js';
import THREE from '../threejsModule.js';



let modelPath = 'Plants/repeater/scene.gltf';

class Repeater extends Plant{
    constructor(name, health, cost, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ){
        super(name, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ);

    }
}
export {Repeater}



