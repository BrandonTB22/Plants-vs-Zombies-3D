// A class to represent the house in Plants vs Zombies

import * as THREE from 'three';

let house, window, door, roof;
 
class House{
  
    constructor(size, color, position){
        this.sizeX = size[0];
        this.sizeY = size[1];
        this.sizeZ = size[2];
        this.color = color;
        this.position = position;

        this.group = new THREE.Group();
    }

    generateMain(){
        let boxGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);
        let material = new THREE.MeshStandardMaterial({color : this.color});
        house = new THREE.Mesh(boxGeo, material);

        this.group.add(house);
    }

    generateWindows(){
        let boxGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ);
        let material = new THREE.MeshStandardMaterial({color : 0xadfe6}); // A light blue color
        let window = new THREE.Mesh(boxGeo, material);

        this.group.add(window);   
    }

    generateRoof(){

    }

    generateDoor(){

    }

    generateHouse(){
        this.generateWindows();
    }


}