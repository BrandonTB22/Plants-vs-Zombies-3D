import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "../threejsModule";
class Plant {
    constructor(plantName, cost, health, modelPath, Xadj, Yadj, Zadj, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
        this.lawnSizeX = 68; // You can use this default or allow it to be passed in the constructor
        this.name = plantName;
        this.cost = cost;  // Store the cost
        this.health = health;  // Initialize health properly
        this.modelPath = modelPath;

        // Used to adjust the position on the tile
        this.Xadj = Xadj;
        this.Yadj = Yadj;
        this.Zadj = Zadj;

        // Used to rotate the plant if needed
        this.rotX = rotX;
        this.rotY = rotY;
        this.rotZ = rotZ;

        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
    }

    // Function that loads each model
    async generatePlant(x, y, z){
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.load(
                this.modelPath,
                resolve,
                undefined,
                reject
            );
        });
    
        const model = gltf.scene;
       
    
        if (model instanceof THREE.Object3D) {
            model.scale.set(this.scaleX, this.scaleY, this.scaleZ);
            model.rotation.set(this.rotX, this.rotY, this.rotZ);
            model.position.set(x + this.Xadj, y + this.Yadj, z + this.Zadj);
            this.peashooter = model;
            
            return model;
          
        } else {
            throw new Error('Loaded model is not an instance of THREE.Object3D');
        }
    }

    reduceHealth(currHealth) {
        // Placeholder for reducing health logic
        this.health -= currHealth;
    }

    removePlant() {
        // Placeholder for removing the plant
    }

    getName(){
        return this.name;
    }
    detectIntersection() {
        // Placeholder for detecting intersection logic
    }

    setHealth() {
        // Placeholder for setting health logic
    }
}

export { Plant }
