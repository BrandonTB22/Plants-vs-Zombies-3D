
import THREE from "./threejsModule";
import { BasicZombie } from "./Zombies/BasicZombie";
import { ConeHeadZombie } from "./Zombies/ConeHeadZombie";
class GameLogic{
    constructor(scene, lawn, camera){
        this.transfer =[];
        this.zombiesActive = [];
        this.availableZombies = [];
        this.plants = [];
        this.scene =scene;
        this.lawn = lawn;
        this.camera = camera;

    }

    startGame(){
        let coolDown = 10000;

        console.log("Game has started!");

        // Begin with an initial zombie
        setTimeout(() => {
            let basicZombie = new BasicZombie('basic', 200, this.camera, this.scene);
            this.transfer.push(basicZombie);
            this.zombiesActive.push(basicZombie);
        }, 5000)

        
    }

    transferZombies(){
        return this.transfer;
    }

    returnZombie(zombie){
        this.availableZombies.push(zombie);
    }

    spawnZombies(){
        
            if (this.availableZombies.length > 0){
                let temp = this.availableZombies.pop();
                //this.transfer.push(temp);
                this.zombiesActive.push(temp)
            } else {
                let basicZombie = new BasicZombie('basic', 500, this.camera, this.scene);
                this.transfer.push(basicZombie);
                this.zombiesActive.push(basicZombie);
            }
      
       
    }


    spawnConeHeads(){
        let condehead = this.availableZombies.find(zombie => zombie.getType() == 'conehead');
            
        if (condehead == undefined){
            let conehead = new ConeHeadZombie('conehead', 1000, this.camera, this.scene);
            this.transfer.push(conehead);
            this.zombiesActive.push(conehead)
        }
    }

}

export {GameLogic}