
// Load models
import THREE from "./threejsModule";
import { BasicZombie } from "./Zombies/BasicZombie";
import { ConeHeadZombie } from "./Zombies/ConeHeadZombie";

// Main class to run game logic
class GameLogic{
    constructor(scene, lawn, camera){
        this.transfer =[];
        this.zombiesActive = [];
        this.availableZombies = [];
        this.plants = [];
        this.scene =scene;
        this.lawn = lawn;
        this.camera = camera;
        this.audioLoader = new THREE.AudioLoader();
        this.listener = new THREE.AudioListener();

    }

    // Starts the game
    startGame(){
 
        console.log("Game has started!"); // Log that game has started

        // Begin with an initial zombie
        setTimeout(() => {
            let basicZombie = new BasicZombie('basic', 1000, this.scene);
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

    // Spawn a zombie on the lawn
    spawnZombies(){
        
            if (this.availableZombies.length > 0){
                let temp = this.availableZombies.pop();
                this.zombiesActive.push(temp)
            } else {
                let basicZombie = new BasicZombie('basic', 1000, this.scene);

                setTimeout(() => {
                     //basicZombie.createBoundingBox(this.scene, basicZombie.model);
                }, 1000)
               
                
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

    // Ends game when condtion is met
    endGame(camera){
        console.log("GAME OVER!");

        camera.add(this.listener);

        this.audioLoader.load("./SoundFiles/loseMusic.mp3", (buffer) => {
            const loseSound = new THREE.Audio(this.listener);
            loseSound.setBuffer(buffer);
            loseSound.setLoop(false);
            loseSound.setVolume(1.0);
            loseSound.play();
        });

        
    }

}

export {GameLogic}