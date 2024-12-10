class Plant {
    constructor(plantName, cost, health, Xblock, Yblock, lawn) {
        this.lawnSizeX = 68; // You can use this default or allow it to be passed in the constructor
        this.name = plantName;
        this.cost = cost;  // Store the cost
        this.health = health;  // Initialize health properly
        this.Xblock = Xblock;  // Block position on the X axis (optional)
        this.Yblock = Yblock;  // Block position on the Y axis (optional)
        this.lawn = lawn;  // Any reference to the lawn if needed
    }


    setPosition(x, y, z) {
        this.position.set(x, y, z);  // Set position using THREE.Vector3's set method
    }

    generatePlant() {
        // Return a 3D mesh or object representing the plant
        const plantMesh = new THREE.Mesh( /* your mesh or geometry here */ );
        plantMesh.position.set(this.position.x, this.position.y, this.position.z);
        return plantMesh;
    }

    reduceHealth(currHealth) {
        // Placeholder for reducing health logic
        this.health -= currHealth;
    }

    removePlant() {
        // Placeholder for removing the plant
    }

    detectIntersection() {
        // Placeholder for detecting intersection logic
    }

    setHealth() {
        // Placeholder for setting health logic
    }
}

export { Plant }
