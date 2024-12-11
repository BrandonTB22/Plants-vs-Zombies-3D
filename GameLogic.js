
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
            let basicZombie = new BasicZombie('basic', 200, this.scene);
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
                this.transfer.push(temp);
                this.zombiesActive.push(temp)
            } else {
                let basicZombie = new BasicZombie('basic', 200, this.scene);
                this.transfer.push(basicZombie);
                this.zombiesActive.push(basicZombie);
            }
      
       
    }

    endGame(){

    }

}

export {GameLogic}