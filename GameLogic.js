
import { BasicZombie } from "./Zombies/BasicZombie";
class GameLogic{
    constructor(scene, lawn){
        this.transfer =[];
        this.zombies = [];
        this.plants = [];
        this.scene =scene;
        this.lawn = lawn;
    }

    startGame(){
        let coolDown = 10000;

        console.log("Game has started!");

        // Begin with an initial zombie
        setTimeout(() => {
            let basicZombie = new BasicZombie('basic', 1000);
            this.transfer.push(basicZombie);
            this.zombies.push(basicZombie);
            
        }, 5000)

        
    }

    transferZombies(){
        return this.transfer;
    }

    endGame(){

    }

}

export {GameLogic}