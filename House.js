// A class to represent the house in Plants vs Zombies

import * as THREE from 'three';

let house, window, door, roof, base;

class House{
  
    constructor(size, color, position){
        this.sizeX = size[0];
        this.sizeY = size[1];
        this.sizeZ = size[2];
        this.color = color;
        this.position = position;

        this.group = new THREE.Group();
    }
    // The actual house generation
    generateBase(){
        let boxGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);
        let material = new THREE.MeshStandardMaterial({color : 0xb5b3ae}); // A light gray color
        base = new THREE.Mesh(boxGeo, material);
        base.position.set(this.position[0], this.position[1], this.position[2]);

        this.group.add(base);

    }

    generateMain(){
        let boxGeo = new THREE.BoxGeometry(this.sizeX / 1.5, 50, this.sizeZ/ 1.3);
        let material = new THREE.MeshStandardMaterial({color : this.color});
        house = new THREE.Mesh(boxGeo, material);
        house.position.set(this.position[0], this.position[1], this.position[2]);

        this.group.add(house);
    }

    generateWindows(){
        let boxGeo = new THREE.BoxGeometry(this.sizeX / 5, this.sizeX / 5, this.sizeX / 5);
        let material = new THREE.MeshStandardMaterial({color : 0xadfe6}); // A light blue color
        let window = new THREE.Mesh(boxGeo, material);
        window.position.set(house.position.x + 5, this.sizeY / 2, this.sizeZ);

        this.group.add(window);   
    }

    generateRoof(){

    }

    generateDoor(){

    }

    generateHouse(){
        this.generateBase();
        this.generateMain();
        // this.generateWindows();

        return this.group;
    }
}

export {House}