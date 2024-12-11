
import { BasicZombie } from "./Zombies/BasicZombie";
class GameLogic{
    constructor(scene){
        this.transfer =[];
        this.zombies = [];
        this.plants = [];
        this.scene =scene;
        this.updateAnimation;

    }

    startGame(){
        let coolDown = 10000;

        console.log("Game has started!");

        setTimeout(() => {
            let basicZombie = new BasicZombie('basic', 1000);

            this.transfer.push(basicZombie);
            this.zombies.push(basicZombie);
            
        }, 5000);
        
        
        setTimeout(() => {
            let basicZombie = new BasicZombie('basic', 1000);

            this.transfer.push(basicZombie);
            this.zombies.push(basicZombie);
            
        }, 10000)

        
    }

    transferZombies(){
        return this.transfer;
    }

    endGame(){

    }

}

export {GameLogic}