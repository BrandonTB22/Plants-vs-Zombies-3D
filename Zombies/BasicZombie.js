import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, QuaternionKeyframeTrack, AnimationClip, Vector3, Quaternion } from 'three';
import THREE from '../threejsModule';
import { GameLogic } from '../GameLogic';

class BasicZombie {
    constructor(type, health, scene){
        this.type = type;
        this.health = 500;
        this.model;
        this.spawns = [0, 8, 16, 24, 32]
        this.scene = scene;
        this.isAlive = true;

        this.rand = Math.floor(Math.random() * this.spawns.length)
        this.lane = this.spawns[this.rand];

    }

getType(){
    return this.type;
}

eatPlant(plant){
    if (this.model.getObjectById('hitbox').position.x < Math.abs(plant.position.x + 3)){
        console.log("Eating plant");
    }
}

getHealth(){
    return this.health;
}

updateZombiePosition(){
    if (this.model != null){
        this.model.position.x -= 0.03;
    }
}

setToSpawnPosition(x, y, z){
    this.model.position.set(x, y, z);
}

reduceHealth(ammount){
    this.health -= ammount;
    console.log(this.health);

    if (this.health <= 0){
        
        this.scene.remove(this.model);
        this.scene.remove(this.model.getObjectById('hitbox'));
        this.isAlive = false;
        this.model.position.set(0, -100, 0);
    }
}

loadZombie(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            '/Zombies/zombie/scene.gltf', // Path to the model
            (gltf) => {
                const zombie = gltf.scene; // Get the 3D model
                console.log(this.lane);
                zombie.position.set(90, 5, this.lane); // Position in the center of the scene
                zombie.scale.set(40, 40, 40); // Adjust scale if needed
                const direction = new Vector3();
                zombie.getWorldDirection(direction); // Get the zombie's current direction
                direction.y = 0; // Keep the zombie facing horizontally, prevent flipping
                direction.normalize(); // Normalize the direction vector
                
                // Update the zombie's rotation to face the camera
                const rotation = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 2), direction);
                zombie.quaternion.copy(rotation); // Apply the rotation to the zombie
                
                const geo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
                const material = new THREE.MeshBasicMaterial({color : 0xffffff});
                const hitBox = new THREE.Mesh(geo, material);
                hitBox.rotation.y = 1.5;
                
                hitBox.name = "hitbox";
                hitBox.visible = false;
                zombie.add(hitBox);
                
                this.model = zombie;
                scene.add(zombie);
        
                // Extract nodes by their names
                const nodes = {};
                zombie.traverse((child) => {
                    if (child.name) nodes[child.name] = child;
                });

                // Ensure the required nodes are found
                const lThigh = nodes['l_thigh_025'];
                const rThigh = nodes['r_thigh_029'];
                const head = nodes['head_013']; // Head node for nodding
                const lShoulder = nodes['l_shoulder_05']; // Left shoulder for swinging
                const rShoulder = nodes['r_shoulder_016']; // Right Shoulder
                if (!lThigh || !rThigh || !head || !lShoulder || !rShoulder) {
                    console.error('Required nodes not found in the model!');
                    reject('Nodes not found');
                    return;
                }

                // Set up animation
                const mixer = new AnimationMixer(zombie);
                const walkingClip = createWalkingAnimation(lThigh, rThigh, head, lShoulder, rShoulder);
                const action = mixer.clipAction(walkingClip);
                action.play();

                // Add animation update function to the zombie's userData
                zombie.userData.updateAnimation = (delta) => mixer.update(delta);

                // Resolve the promise with the update function for animations
                resolve(zombie.userData.updateAnimation);
            },
            undefined,
            (error) => {
                console.error('An error occurred loading the zombie model:', error);
                reject(error); // Reject the promise if there's an error
            }
        );
    });

    function createWalkingAnimation(lThigh, rThigh, head, lShoulder, rShoulder) {
        const times = [0, 1, 3]; // Time points for the walking cycle
        

        // Hip rotations
        const hipRotation = new Quaternion(-0.5000000596046448, -0.49999991059303284, -0.5, 0.5); // Existing hip rotation
        const hipRotationDownward = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
        hipRotation.multiply(hipRotationDownward);

        const lThighRotations = [
            hipRotation.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 5), -Math.PI / 4)), // Rotate left leg downward
            hipRotation.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 4)), // Rotate back to neutral position
            hipRotation.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -5), Math.PI / 4)), // Reset to downward
        ];
        
        const rThighRotations = [
            hipRotation.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 5), Math.PI / 4)), // Rotate right leg downward
            hipRotation.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 4)), // Rotate back to neutral position
            hipRotation.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -5), -Math.PI / 4)), // Reset to downward
        ];

        const headRotations = [
            new Quaternion().setFromAxisAngle(new Vector3(0, 0, 2), Math.PI / 8), // Head nods downward
            new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 8), // Head nods downward
            new Quaternion().setFromAxisAngle(new Vector3(0, 0, -2), -Math.PI / 8), // Head nods upward
        ];
        const shoulderRotationsl = [
            new Quaternion()
                .setFromAxisAngle(new Vector3(-2, 2, 0), Math.PI / 2) // Arm forward (default position)
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI)) // Rotate 180 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 4)) // Rotate 45 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -0.5), Math.PI / 6)) // Lower arm by rotating downward on Y-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 18)), // Slight upward swing
            new Quaternion()
                .setFromAxisAngle(new Vector3(-2, 2, 0), Math.PI / 2) // Neutral forward position
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI)) // Rotate 180 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 4)) // Rotate 45 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -0.5), Math.PI / 6)), // Lower arm by rotating downward on Y-axis
            new Quaternion()
                .setFromAxisAngle(new Vector3(-2, 2, 0), Math.PI / 2) // Arm forward (default position)
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI)) // Rotate 180 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 4)) // Rotate 45 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -0.5), Math.PI / 6)) // Lower arm by rotating downward on Y-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -1), -Math.PI / 18)), // Slight downward swing
        ];
         

        const shoulderRotationsr = [
            new Quaternion()
                .setFromAxisAngle(new Vector3(-3, 2, 0), Math.PI / 2) // Arm forward (default position)
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-6, 0, 0), Math.PI)) // Rotate 180 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 4)) // Rotate 45 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 10), Math.PI / 6)) // Lower arm by rotating downward on Y-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 18)), // Slight upward swing
            new Quaternion()
                .setFromAxisAngle(new Vector3(-3, 2, 0), Math.PI / 2) // Neutral forward position
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-6, 0, 0), Math.PI)) // Rotate 180 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 4)) // Rotate 45 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 20), Math.PI / 6)), // Lower arm by rotating downward on Y-axis
            new Quaternion()
                .setFromAxisAngle(new Vector3(-3, 2, 0), Math.PI / 2) // Arm forward (default position)
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-6, 0, 0), Math.PI)) // Rotate 180 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 4)) // Rotate 45 degrees around X-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 10), Math.PI / 6)) // Lower arm by rotating downward on Y-axis
                .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, -1), -Math.PI / 18)), // Slight downward swing
        ];
        

        const lThighTrack = new QuaternionKeyframeTrack(
            `${lThigh.uuid}.quaternion`,
            times,
            lThighRotations.flatMap(q => [q.x, q.y, q.z, q.w])
        );

        const rThighTrack = new QuaternionKeyframeTrack(
            `${rThigh.uuid}.quaternion`,
            times,
            rThighRotations.flatMap(q => [q.x, q.y, q.z, q.w])
        );

        const headTrack = new QuaternionKeyframeTrack(
            `${head.uuid}.quaternion`,
            times,
            headRotations.flatMap(q => [q.x, q.y, q.z, q.w])
        );

        const shoulderTrackl = new QuaternionKeyframeTrack(
            `${lShoulder.uuid}.quaternion`,
            times,
            shoulderRotationsl.flatMap(q => [q.x, q.y, q.z, q.w])
        );

        const shoulderTrackr = new QuaternionKeyframeTrack(
            `${rShoulder.uuid}.quaternion`,
            times,
            shoulderRotationsr.flatMap(q => [q.x, q.y, q.z, q.w])
        );


        return new AnimationClip('Walking', -1, [lThighTrack, rThighTrack, headTrack, shoulderTrackl, shoulderTrackr]);
    }
}
}

export {BasicZombie}


