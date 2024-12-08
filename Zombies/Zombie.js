import THREE from "../threejsModule";

let boundingBox;
class Zombie{
    constructor(name, health){
        this.name = name;
        this.health = health;
    }

    playWalkAnimation(){

    }

    playDeathAnimation(){

    }

    setHealth(){

    }

    createBoundingBox(obj){
        boundingBox = new THREE.Box3().setFromObject(obj);
    
        return boundingBox;
    }

    detectIntersection(){
    
    }

    getHealth(){

    }

    eatPlant(){

    }
}

export {Zombie}