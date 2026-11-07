import THREE from "../threejsModule";

let boundingBox;

// Represents all zombie properties
class Zombie{
    constructor(type, name, health){
        this.type = type;
        this.name = name;
        this.health = health;
    }

    // Plays zombie's walk animation
    playWalkAnimation(){

    }

    // Plays zombie's death animation
    playDeathAnimation(){

    }

    // Set zombie's inital house
    setHealth(){
        this.health = health;
    }

    // Create bounding box instance
    createBoundingBox(obj){
        boundingBox = new THREE.Box3().setFromObject(obj);
    
        return boundingBox;
    }

    detectIntersection(){
    
    }

    // Return current health
    getHealth(){

    }

    // Eat plant when close
    eatPlant(){

    }
}

export {Zombie}