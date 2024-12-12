import * as THREE from 'three';

// Class to deal with the sun spheres and values
export class SunSystem{
    constructor(scene, sunCounterElement, lawnBounds, camera) {
        this.scene = scene; // Reference to the scene
        this.sunCounterElement = sunCounterElement; // Reference to the sun energy display in the GUI
        this.suns = []; // Pool of sun spheres
        this.activeSuns = []; // Track active suns
        this.sunValue = 25; // Amount of energy per sphere
        this.lawnBounds = lawnBounds; // { xMin, xMax, zMin, zMax } to define the spawning area
        this.camera = camera; // Needed for raycasting

        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        this.audioLoader = new THREE.AudioLoader();
        this.soundEffect = new THREE.Audio(this.listener);

        this.audioLoader.load('./SoundFiles/sunPickup.mp3', (buffer) => {
            this.soundEffect.setBuffer(buffer);
            this.soundEffect.setLoop(false);
            this.soundEffect.setVolume(1.0);
        })

        // Create the pool of two sun spheres
        for (let i = 0; i < 2; i++) {
            const sunGeometry = new THREE.SphereGeometry(5/3, 16, 16);
            const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
            const sun = new THREE.Mesh(sunGeometry, sunMaterial);
            sun.visible = false; // Initially hide the suns
            sun.castShadow = true;
            sun.receiveShadow = true;
            this.scene.add(sun);
            this.suns.push(sun);
        }

        // Initialize raycaster for click detection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Bind click event
        window.addEventListener('click', (event) => this.handleClick(event));
    }

    // Spawn a sun at a random position in the grass bounds
    spawnSun() {
    // Find an available sun from the pool
    const sun = this.suns.find((s) => !s.visible);

    if (sun) {
         // Randomize the position within lawn bounds
         const x = THREE.MathUtils.randFloat(this.lawnBounds.xMin, this.lawnBounds.xMax);
         const z = THREE.MathUtils.randFloat(this.lawnBounds.zMin, this.lawnBounds.zMax);
         const startY = 50; // Spawn height above the lawn
         const endY = 7; // Lawn level

         sun.position.set(x, startY, z);
         sun.visible = true;
         this.activeSuns.push(sun);

         // Animate the falling motion
         this.animateFall(sun, endY);
        }
    }

    animateFall(sun, endY) {
        const fallSpeed = 0.5; // Speed of falling
        const fallAnimation = () => {
            if (sun.position.y > endY) {
                sun.position.y -= fallSpeed; // Move sun down
                requestAnimationFrame(fallAnimation); // Continue animation
            } else {
                // Sun has reached the lawn level, start despawn timer
                sun.position.y = endY; // Ensure it stops exactly on the lawn
                setTimeout(() => {
                    if (sun.visible) {
                        this.despawnSun(sun);
                    }
                }, 5000); // 5 second timer
            }
        };

        fallAnimation();
    }

    despawnSun(sun) {
        // Hide the sun and remove it from active suns
        sun.visible = false;

        const index = this.activeSuns.indexOf(sun);
        if (index !== -1) {
            this.activeSuns.splice(index, 1);
        }
    }

    handleClick(event) {
        // Update mouse position for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Perform raycasting to detect suns
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.activeSuns);

        if (intersects.length > 0) {
            this.soundEffect.play();
            const clickedSun = intersects[0].object;
            this.despawnSun(clickedSun); // Despawn the clicked sun
            this.updateSunEnergy(); // Add energy
          
            
        }
    }

    getSunCount(){
        return this.sunCount;
    }


    updateSunEnergy() {
        // Update the GUI sun counter
        const currentEnergy = parseInt(this.sunCounterElement.textContent, 10);
        this.sunCounterElement.textContent = currentEnergy + this.sunValue;
    }
}