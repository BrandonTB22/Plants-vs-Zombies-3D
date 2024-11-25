import * as THREE from 'three';
class Lawn{

    constructor(texture1, texture2, sizeX, sizeY, sizeZ){
        this.texture1 = texture1;
        this.texture2 = texture2;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;

        this.lawnTile;
        this.material;
        this.tiles = [];
    }

    generateLawn(){
        
        for (let i = 0; i < 5; i++){ // Each row
            for (let j = 0; j < 9; j++){ // Each column
                let boxGeo = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeY);

                // Some tiles will be light green, others dark
                if (i % 2 == 0 && j % 2 == 0){
                    this.material = new THREE.MeshStandardMaterial({map : this.texture1});
                } else if (i % 2 != 0 && j % 2 == 0){
                    this.material = new THREE.MeshStandardMaterial({map : this.texture2});
                } else if (i % 2 == 0 && j % 2 != 0){
                    this.material = new THREE.MeshStandardMaterial({map : this.texture2});
                } else if (i % 2 != 0 && j % 2 != 0){
                    this.material = new THREE.MeshStandardMaterial({map : this.texture1});
                }
           
                this.lawnTile = new THREE.Mesh(boxGeo, this.material);
                this.lawnTile.position.set(this.sizeX * j, 0, this.sizeX * i);

                this.tiles.push(this.lawnTile);
            }
        }
        return this.tiles;
    }

    getLawnTileAtPosition(){

    }
}

export {Lawn}