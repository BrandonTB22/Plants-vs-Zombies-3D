
import { BasicZombie } from "./Zombies/BasicZombie";
class GameLogic{
    constructor(scene, lawn){
        this.transfer =[];
        this.zombiesActive = [];
        this.availableZombies = [];
        this.plants = [];
        this.scene = scene;
        this.lawn = lawn;
    }

    startGame(){
        let coolDown = 10000;

        console.log("Game has started!");

        // Begin with an initial zombie
        setTimeout(() => {
            let basicZombie = new BasicZombie('basic', 200);
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

    endGame(){

    }

}

export {GameLogic}