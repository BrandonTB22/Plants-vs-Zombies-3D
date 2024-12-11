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
        this.tiles = [[], [], [], [], []]; // Create a 2d array to keep track of tile position
        this.occupiedTiles = []; // Tiles that have plants on them
    }

    // Create the lawn
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

                this.tiles[i].push(this.lawnTile);
            }
        }
        return this.tiles;
    }

    occupyTile(tile){
        this.occupiedTiles.push(tile);
    }

    emptyTile(tile){
        this.occupiedTiles.splice(this.occupiedTiles.indexOf(tile), 1);
    }

    getTileStatus(tile){
        if (this.occupiedTiles.includes(tile)){
            console.log("Tile occupied");
            return true;
        
        } else {
            console.log("Tile not occupied");
            return false;
        }
    }

    // Get the lawn's x and z bounds for sun spawning
    getLawnBounds() {
        const minX = 0; // First column starts at x = 0
        const maxX = this.sizeX * (this.tiles[0].length - 1); // Last column's x position

        const minZ = 0; // First row starts at z = 0
        const maxZ = this.sizeZ * (this.tiles.length - 1); // Last row's z position

        return { minX, maxX, minZ, maxZ };
    }
}

export {Lawn}