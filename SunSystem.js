import * as THREE from 'three';

// Class to deal with the sun spheres and values
export class SunSystem{
    constructor(scene, sunCounterElement) {
        this.scene = scene; // Reference to the scene
        this.sunCounterElement = sunCounterElement; // Reference to the sun energy display in the GUI
        this.suns = []; // Pool of sun spheres
        this.activeSuns = []; // Track active suns
        this.sunValue = 25; // Amount of energy per sphere

        // Create the pool of two sun spheres
        for (let i = 0; i < 2; i++) {
            const sunGeometry = new THREE.SphereGeometry(5/3, 16, 16);
            const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
            const sun = new THREE.Mesh(sunGeometry, sunMaterial);
            sun.visible = false; // Initially hide the suns
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
        const sun = this.suns.find((sun) => !sun.visible); // Get an available sun
        if (sun) {
            const x = Math.random() * 100 - 50; // Random X position
            const z = Math.random() * 100 - 50; // Random Z position
            const y = 50; // Initial Y position (above the screen)
            sun.position.set(x, y, z);
            sun.visible = true; // Show the sun
            this.activeSuns.push(sun); // Track active sun
        }
    }

    // Update sun positions and remove if clicked
    update(delta) {
        // Move active suns downward
        this.activeSuns.forEach((sun) => {
            sun.position.y -= 10 * delta; // Fall speed
            if (sun.position.y < -5) {
                // If sun falls below the ground then reset it
                sun.visible = false;
                this.activeSuns = this.activeSuns.filter((activeSun) => activeSun !== sun);
            }
        });
    }

    // Handle clicks on the suns
    handleClick(event) {
        // Normalize mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, camera);

        // Check for intersections with suns
        const intersects = this.raycaster.intersectObjects(this.activeSuns);
        if (intersects.length > 0) {
            const clickedSun = intersects[0].object;
            clickedSun.visible = false; // Hide the clicked sun
            this.activeSuns = this.activeSuns.filter((sun) => sun !== clickedSun); // Remove from active list

            // Add sun value to the GUI
            const currentSunCount = parseInt(this.sunCounterElement.textContent, 10) || 0;
            this.sunCounterElement.textContent = currentSunCount + this.sunValue;
        }
    }
}