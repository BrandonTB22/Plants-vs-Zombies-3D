import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer, QuaternionKeyframeTrack, AnimationClip, Vector3, Quaternion } from 'three';

export function loadBasicZombie(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            '/Zombies/zombie/scene.gltf', // Path to the model
            (gltf) => {
                const zombie = gltf.scene; // Get the 3D model
                zombie.position.set(55, 20, 30); // Position in the center of the scene
                zombie.scale.set(20, 20, 20); // Adjust scale if needed
                const direction = new Vector3();
                zombie.getWorldDirection(direction); // Get the zombie's current direction
                direction.y = 0; // Keep the zombie facing horizontally, prevent flipping
                direction.normalize(); // Normalize the direction vector
                
                // Update the zombie's rotation to face the camera
                const rotation = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 2), direction);
                zombie.quaternion.copy(rotation); // Apply the rotation to the zombie
                scene.add(zombie);

                // Extract nodes by their names
                const nodes = {};
                zombie.traverse((child) => {
                    if (child.name) nodes[child.name] = child;
                });

                // Ensure the required nodes are found
                const lThigh = nodes['l_thigh_025'];
                const rThigh = nodes['r_thigh_029'];
                if (!lThigh || !rThigh) {
                    console.error('Required nodes not found in the model!');
                    reject('Nodes not found');
                    return;
                }

                // Set up animation
                const mixer = new AnimationMixer(zombie);
                const walkingClip = createWalkingAnimation(lThigh, rThigh);
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

    function createWalkingAnimation(lThigh, rThigh) {
        const times = [0, 1, 3]; // Time points for the walking cycle
        const hipRotation = new Quaternion(-0.5000000596046448, -0.49999991059303284, -0.5, 0.5); // Existing hip rotation

        // Apply an additional 90-degree rotation to the hip (around X-axis)
        const hipRotationDownward = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
        hipRotation.multiply(hipRotationDownward); // Combine rotations
        
        // Update the thigh rotations
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

        return new AnimationClip('Walking', -1, [lThighTrack, rThighTrack]);
    }
}