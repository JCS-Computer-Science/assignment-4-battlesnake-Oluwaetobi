/**Ejò yii, ti mo ti da ni oye atọwọda, o je ajafafa, ati o le segun oriṣiriṣi ejò. Sùgbon, ejò mi nilo lati da, ko da ju ati
 * mo ro pé ejò yii to mo ti da o ti dé ni ipele ti o poju fun ejò yii nikan. Mo ro pé, mo nilo lati da ejo yii miiran pelu
 * ete yato nitori pé, pelu ete yii, ko le da sugbon ti ma yipada ete mi pelu ejò yii miiran, mo le da e. Sugbon, mi o ma parun
 * ejò yii, ma da ejò miiran.
 */

export default function move(gameState){
    let gameBoardProperties = {
        "height" : gameState.board.height,
        "width" : gameState.board.width
    }
    // Don't change the order of this or else it will mess us the procedures and the AI guesses and picking
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
 
    // Same punishment helps me keep track of my variables

    let theSamePunishment = 3;
    let hazards = gameState.board.hazards;
    let food = gameState.board.food;

    /* Iamthelongest variable is still useful, even though I have added a next generation level of smartiness to my snake
    It is now no longer completely dependent on this variable but can check individually whether it is bigger than a particular
    snake */
    let IamTheLongest = false;
    // Kill Reward has to be less than AI
    let AIbadMovePunishmentSpecial = (theSamePunishment + 1);
    // KillReward has to be 1 less than AIbadMovePUnishmentSpecial, or else I will end up trying to kill others and then
    // quickly killing myself, I have tested it, SO DON'T CHANGE IT!!!
    let killReward = (AIbadMovePunishmentSpecial -1);

    // The cutting off snake reward has to be greater than the dead end punishment or else it will only cut off snakes
    // sometimes when given the oppurtunity it has to be all the time not sometimes
    let cuttingOffSnakeReward = (theSamePunishment + 1);
 
    let moveUpPoints = 0;
    let moveDownPoints = 0;
    let moveLeftPoints = 0;
    let moveRightPoints = 0;
 
 
    let UpPointsHigher = false;
    let DownPointsHigher = false;
    let LeftPointsHigher = false;
    let RightPointsHigher = false;
 
 
    let snakes = gameState.board.snakes;
 
    // I don't know why this variable has a light color which means it is not being used, even though I am actually using
    // this variable three times throughout my entire code
    let superDuperReallyHungry = false;
    // I am making nextmove and safemoves a global varaible since I am calling it more than once
    let safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    let nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  
    // We've included code to prevent your Battlesnake from moving backwards
    let myHead = gameState.you.body[0];
    let myNeck = gameState.you.body[1];
  
    // DON'T CHANGE THIS, 30 is the sweet spot!!
    let superDuperHungry = 30;
    // Changing this means nothing, please go to lines 62-66
    let hungry = 75;
 
 
    let eatAggressivelyUntilIamThisLong = 30;
 
    // helps me to know where dead ends are
    const allOfSnakesPositionsExceptMyOwn = [];
    const allOfSnakesPositionsIncludingMyOwn = [];

    // pushes all of the snakes' positions into an array except for my own position
    for(let i = 0; i < snakes.length; i ++) {
        if (snakes[i].id == gameState.you.id) {
            // do nothing
        } else {
            allOfSnakesPositionsExceptMyOwn.push(JSON.stringify(snakes[i].body));
        }
    }
    console.log("allOfSnakesPositionsExceptMyOwn: " + allOfSnakesPositionsExceptMyOwn);
    // pushes all of the snakes' positions including my own
    for(let i = 0; i < snakes.length; i ++) {
            allOfSnakesPositionsIncludingMyOwn.push(JSON.stringify(snakes[i].body));
        }
        console.log("allOfSnakesPositionsIncludingMyOwn: " + allOfSnakesPositionsIncludingMyOwn);
    // checks to see if I am the longest
    /* Iamthelongest variable is still useful, even though I have added a next generation level of smartiness to my snake
    It is now no longer completely dependent on this variable but can check individually whether it is bigger than a particular
    snake */
    let amountOfSnakes1 = 0;
    let checkAmountOfSnakes1 = 0;
    for (let i = 0; i < snakes.length; i ++) {
        if (snakes[i].id == gameState.you.id) {
           
        } else {
            amountOfSnakes1 += 1
            if(gameState.you.length > snakes[i].length) {
                checkAmountOfSnakes1 +=1;
            }
        }
        if (i + 1 == snakes.length && amountOfSnakes1 == checkAmountOfSnakes1) {
            IamTheLongest = true;
        }
    }

   // 1st time: if I am the only snake in the game, sets I am the longest to true and reduces hungry to 50
   if (snakes.length == 1) {
    IamTheLongest == true;
    // if there are hazards I will get hungrier faster so I need the hungry to be higher
    if (hazards.length == 0) {
        // there are no hazards since it is equal to 0
        hungry = 50;
    } else {
        hungry = 70;
    }
}

    // checks if I am the longest in order to know how to go about eating in the game
    if (IamTheLongest == true) {
        if (gameState.you.length < eatAggressivelyUntilIamThisLong + 3) {
            hungry = 101;
        } else if (gameState.you.length < eatAggressivelyUntilIamThisLong+ 5) {
            hungry = 80;
        } else {
            hungry = 60;
        }
    } else {
        if (gameState.you.length < eatAggressivelyUntilIamThisLong + 5) {
            hungry = 101;
        } else {
            if (gameState.you.length < eatAggressivelyUntilIamThisLong + 7) {
                hungry = 80;
            } else{
                hungry = 60;
            }
        }
    }
 
 
    // 2nd time: if I am the only snake in the game, sets I am the longest to true and reduces hungry to 50
    if (snakes.length == 1) {
        IamTheLongest == true;
        // if there are hazards I will get hungrier faster so I need the hungry to be higher
        if (hazards.length == 0) {
            // there are no hazards since it is equal to 0
            hungry = 50;
        } else {
            hungry = 70;
        }
    }
    
    /* I am doing this because of all those snakes that keep trying to kill me, I although I will only eat food
    agressively until my length is higher than 7 because once your body gets longer that helps shield you
    from getting killed. Why thank you Coreyja, Waryferryman, and Wrenger, I'll beat you guys this time!! */
    if (gameState.you.body.length < eatAggressivelyUntilIamThisLong ) {
        hungry = 102;
    }
    if (gameState.you.health < superDuperHungry) {
        superDuperReallyHungry = true;
    }
    if (myNeck.x < myHead.x && myHead.y == myNeck.y) {        // Neck is left of head, don't move left
        moveSafety.left = false;
      
    } else if (myNeck.x > myHead.x && myHead.y == myNeck.y) { // Neck is right of head, don't move right
        moveSafety.right = false;
      
    } else if (myNeck.y < myHead.y &&  myHead.x == myNeck.x) { // Neck is below head, don't move down
        moveSafety.down = false;
      
    } else if (myNeck.y > myHead.y && myHead.x == myNeck.x) { // Neck is above head, don't move up
        moveSafety.up = false;
    }


    /**Helps me check whether I should avoid other snakes tails only if there is food 1 unit away from them */
    let avoidOtherSnakesTails = false;

    food = gameState.board.food;
        food.forEach((f) => {
            for (let i = 0; i < snakes.length; i++) {
                if (snakes[i].id == gameState.you.id) {
                    // ignores procedure if looking at my own battlesnake
                } else {
                    if (snakes[i].body[0].x == f.x -1 && snakes[i].body[0].y == f.y) {
                        avoidOtherSnakesTails = true;
                        break;
                    }
                    if (snakes[i].body[0].x == f.x +1 && snakes[i].body[0].y == f.y) {
                        avoidOtherSnakesTails = true;
                        break;
                    }
                    if (snakes[i].body[0].y == f.y -1 && snakes[i].body[0].x == f.x) {
                        avoidOtherSnakesTails = true;
                        break;
                    }
                    if (snakes[i].body[0].y == f.y +1 && snakes[i].body[0].x == f.x) {
                        avoidOtherSnakesTails = true;
                        break;
                    }
                }
            }
        })
  
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board
    if (myHead.x == 0) {
        moveSafety.left = false;
    }
    if (myHead.x == gameBoardProperties.width -1) {
        moveSafety.right = false;
    }
    if (myHead.y == 0) {
        moveSafety.down = false;
    }
    if (myHead.y == gameBoardProperties.height -1) {
        moveSafety.up = false;
    }
  
    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
 
 
 
 
    // this for loop makes sure that the snake doesn't collide with any of the segments of it's body
    if ( gameState.you.body.length > 4) {
        for (let i = 2; i < gameState.you.body.length; i++) {
            // ignores my tail
            if (i >= gameState.you.body.length -1) {
                break;
            }
            if ( gameState.you.body[i].x -1 == myHead.x && myHead.y == gameState.you.body[i].y) {
                moveSafety.right = false;
            }
            if ( gameState.you.body[i].x +1 == myHead.x && myHead.y == gameState.you.body[i].y) {
                moveSafety.left = false;
            }
            if ( gameState.you.body[i].y +1 == myHead.y && myHead.x == gameState.you.body[i].x) {
                moveSafety.down = false;
            }
            if ( gameState.you.body[i].y -1 == myHead.y && myHead.x == gameState.you.body[i].x) {
                moveSafety.up = false;
            }
        }
    }
  
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
  
    /* checks to see if I am the longest so I can no whether I have to avoid other snakes or not and it works now!! 
    I have also added a next generation level of smartiness to my snake, so now I can check whether I am shorter or
    longer than a specific snake even if there are more than 2 snakes in the arena!!*/
    snakes = gameState.board.snakes;
 
 
    amountOfSnakes1 = 0;
    checkAmountOfSnakes1 = 0;
    for (let i = 0; i < snakes.length; i ++) {
        if (snakes[i].id == gameState.you.id) {
           
        } else {
            amountOfSnakes1 += 1
            if(gameState.you.length > snakes[i].length) {
                checkAmountOfSnakes1 +=1;
            }
        }
        if (i + 1 == snakes.length && amountOfSnakes1 == checkAmountOfSnakes1) {
            IamTheLongest = true;
        }
        console.log("");
        console.log("snakes IDs: " + snakes[i].id);
        console.log("Am I the Longest? " + IamTheLongest);
        console.log("How many Snakes are there?: " + snakes.length);
        console.log("AmountOfSnakes: " + amountOfSnakes1);
        // console.log("i: " + i);
        console.log("Check Amount of Snakes: " + checkAmountOfSnakes1);
        console.log("");
 
 
    }
 
 
    snakes = gameState.board.snakes;
            for (let i = 0; i < snakes.length; i++) {
                if (snakes[i].id == gameState.you.id) {
                    // ignores it if looking at my snake
                } else {
                    for (let b = 0; b < snakes[i].length; b++) {
                        // breaks the for loop when looking at the snakes tail if I am not supposed to be avoid their tail
                        if (avoidOtherSnakesTails === false) {
                            if (b >= snakes[i].length -1) {
                                break;
                            }
                        }
                        // keeps my snake from colliding with other snakes and every part of their body as well
                        if (myHead.x == snakes[i].body[b].x -1 && myHead.y == snakes[i].body[b].y) {
                            moveSafety.right = false;
                        }
                        if (myHead.x == snakes[i].body[b].x +1 && myHead.y == snakes[i].body[b].y) {
                            moveSafety.left = false;
                        }
                        if (myHead.y == snakes[i].body[b].y -1 && myHead.x == snakes[i].body[b].x) {
                            moveSafety.up = false;
                        }
                        if (myHead.y == snakes[i].body[b].y +1 && myHead.x == snakes[i].body[b].x) {
                            moveSafety.down = false;
                        }
                    }

                }
            }
    
    let collisionPunishment = 6;


    // only avoids other snakes heads if I am not the longest and can also check if I am longer or shorter than a specific snake

    // don't remove this PART, Iamthelongest
    if (IamTheLongest == false) {
        // keeps my snake from colliding with others snake's heads that are 2 units away
        //  I am going to remove points instead of making moves false, because I don't know for sure
        // that the snake will move in that direction
        for (let i = 0; i < snakes.length; i ++) {
            if (snakes[i].id == gameState.you.id) {
               
            } else {
                // only avoids them if I am shorter than that particular snake
                if (gameState.you.length <= snakes[i].length) {
                    // right movement blocked
                    if (myHead.x == snakes[i].body[0].x -2 && myHead.y == snakes[i].body[0].y) {
                        moveRightPoints -= collisionPunishment;
                    }
                    if (myHead.x == snakes[i].body[0].x -2 && myHead.y == snakes[i].body[0].y + 1) {
                        moveRightPoints -= (collisionPunishment -1);
                    }
                    if (myHead.x == snakes[i].body[0].x -2 && myHead.y == snakes[i].body[0].y - 1) {
                        moveRightPoints -= (collisionPunishment -1);
                    }
                    if (myHead.x == snakes[i].body[0].x -2 && myHead.y == snakes[i].body[0].y + 2) {
                        moveRightPoints -= 2;
                    }
                    if (myHead.x == snakes[i].body[0].x -2 && myHead.y == snakes[i].body[0].y - 2) {
                        moveRightPoints -= 2;
                    }
                    // left movement blocked
                    if (myHead.x == snakes[i].body[0].x +2 && myHead.y == snakes[i].body[0].y) {
                        moveLeftPoints -= collisionPunishment;
                    }
                    if (myHead.x == snakes[i].body[0].x +2 && myHead.y == snakes[i].body[0].y + 1) {
                        moveLeftPoints -= (collisionPunishment -1);
                    }
                    if (myHead.x == snakes[i].body[0].x +2 && myHead.y == snakes[i].body[0].y - 1) {
                        moveLeftPoints -= (collisionPunishment -1);
                    }
                    if (myHead.x == snakes[i].body[0].x +2 && myHead.y == snakes[i].body[0].y + 2) {
                        moveLeftPoints -= 2;
                    }
                    if (myHead.x == snakes[i].body[0].x +2 && myHead.y == snakes[i].body[0].y - 2) {
                        moveLeftPoints -= 2;
                    }
                    // up movement blocked
                    if (myHead.y == snakes[i].body[0].y -2 && myHead.x == snakes[i].body[0].x) {
                        moveUpPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y -2 && myHead.x == snakes[i].body[0].x + 1) {
                        moveUpPoints -= (collisionPunishment -1);
                    }
                    if (myHead.y == snakes[i].body[0].y -2 && myHead.x == snakes[i].body[0].x - 1) {
                        moveUpPoints -= (collisionPunishment -1);
                    }
                    if (myHead.y == snakes[i].body[0].y -2 && myHead.x == snakes[i].body[0].x + 2) {
                        moveUpPoints -= 2;
                    }
                    if (myHead.y == snakes[i].body[0].y -2 && myHead.x == snakes[i].body[0].x - 2) {
                        moveUpPoints -= 2;
                    }
                    // down movement blocked
                    if (myHead.y == snakes[i].body[0].y +2 && myHead.x == snakes[i].body[0].x) {
                        moveDownPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y +2 && myHead.x == snakes[i].body[0].x + 1) {
                        moveDownPoints -= (collisionPunishment -1);
                    }
                    if (myHead.y == snakes[i].body[0].y +2 && myHead.x == snakes[i].body[0].x - 1) {
                        moveDownPoints -= (collisionPunishment -1);
                    }
                    if (myHead.y == snakes[i].body[0].y +2 && myHead.x == snakes[i].body[0].x + 2) {
                        moveDownPoints -= 2;
                    }
                    if (myHead.y == snakes[i].body[0].y +2 && myHead.x == snakes[i].body[0].x - 2) {
                        moveDownPoints -= 2;
                    }

                    /* keeps my snake from later colliding with other snakes heads that are 3 units away and 1 unit diagonal
                     and from not having anywhere to turn to, I won't minus a lot of point here because they are a bit far
                    away and they may take a u turn or something, also don't change this because they're heads get really
                    close really soon, also I only included it for ONE DIRECTION ON PURPOSE, because if my snake is at the bottom
                    and I set 2 directions and there snake is 1 unit above mine, then I won't be able to escape because
                    the top direction has been seen as bad, ONLY ONE DIRECTION HERE, DON'T EDIT THIS ONLY REVIEW IT!!*/
                    let threeUnitsAwayPunishmentPoint = 2;
                    if (myHead.x == snakes[i].body[0].x -3 && myHead.y == snakes[i].body[0].y+ 1) {
                        moveRightPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x -3 && myHead.y == snakes[i].body[0].y- 1) {
                        moveRightPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x + 3 && myHead.y == snakes[i].body[0].y- 1) {
                        moveLeftPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x + 3 && myHead.y == snakes[i].body[0].y+ 1) {
                        moveLeftPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x - 1 && myHead.y == snakes[i].body[0].y + 3) {
                        moveDownPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x + 1 && myHead.y == snakes[i].body[0].y + 3) {
                        moveDownPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x + 1 && myHead.y == snakes[i].body[0].y - 3) {
                        moveUpPoints -= threeUnitsAwayPunishmentPoint;
                    }
                    if (myHead.x == snakes[i].body[0].x - 1 && myHead.y == snakes[i].body[0].y - 3) {
                        moveUpPoints -= threeUnitsAwayPunishmentPoint;
                    }

                    // keeps my snake from colliding with other snake's heads by predicting their future moves
                    //  I am going to remove points instead of making moves false, because I don't know for sure
                    // that the snake will move in that direction
                    if (myHead.x == snakes[i].body[0].x -1 && myHead.y == snakes[i].body[0].y -1) {
                        moveUpPoints -= collisionPunishment;
                        moveRightPoints -= collisionPunishment;
                    }
                    if (myHead.x == snakes[i].body[0].x -1 && myHead.y == snakes[i].body[0].y + 1) {
                        moveRightPoints -= collisionPunishment;
                        moveDownPoints -= collisionPunishment;
                    }
                    if (myHead.x == snakes[i].body[0].x +1 && myHead.y == snakes[i].body[0].y - 1) {
                        moveUpPoints -= collisionPunishment;
                        moveLeftPoints -= collisionPunishment;
                    }
                    if (myHead.x == snakes[i].body[0].x +1 && myHead.y == snakes[i].body[0].y + 1) {
                        moveLeftPoints -= collisionPunishment;
                        moveDownPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y -1 && myHead.x == snakes[i].body[0].x -1) {
                        moveUpPoints -= collisionPunishment;
                        moveRightPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y -1 && myHead.x == snakes[i].body[0].x + 1) {
                        moveUpPoints -= collisionPunishment;
                        moveLeftPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y +1 && myHead.x == snakes[i].body[0].x -1) {
                        moveDownPoints -= collisionPunishment;
                        moveRightPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y +1 && myHead.x == snakes[i].body[0].x + 1) {
                        moveDownPoints -= collisionPunishment;
                        moveLeftPoints -= collisionPunishment;
                    }

                }
                
            }
        }


    }


    // helps me kill other snakes if I am longer than that particular snake
    // I have made it so high only when there are 2 snakes, myself and someone else in the arena, that way it just goes for the kill
    // since there is no that can kill me no longer how far I push, it will only be me and the snake I have cornered up
    //  my code is structured, bodies, dead ends, and other stuff could make me lost this oppurtunity
    let forcePushKillReward = 3;
    if (snakes.length == 2) {
        forcePushKillReward = 23;
    }
    for (let i = 0; i < snakes.length; i ++) {
        if (snakes[i].id == gameState.you.id) {
           
        } else {
            if (gameState.you.length > snakes[i].length) {
                if (myHead.x == snakes[i].body[0].x -1 && myHead.y == snakes[i].body[0].y + 1) {
                    moveRightPoints += killReward;
                    moveDownPoints += killReward;
                }
                if (myHead.x == snakes[i].body[0].x +1 && myHead.y == snakes[i].body[0].y + 1) {
                    moveLeftPoints += killReward;
                    moveDownPoints += killReward;
     
     
                }
                if (myHead.y == snakes[i].body[0].y - 1 && myHead.x == snakes[i].body[0].x + 1) {
                    moveUpPoints += killReward;
                    moveLeftPoints += killReward;
                }
                if (myHead.y == snakes[i].body[0].y - 1 && myHead.x == snakes[i].body[0].x - 1) {
                    moveUpPoints += killReward;
                    moveRightPoints += killReward
                }
            }
            /* I have to be shorter than the snake to do force push kill, if I was longer I would just kill them right away
            //  this keeps snakes along the edges of the walls
            // and forces them to go to the edge of the board which kills them and I only do this if I am not in hazard 
            // Also remember that this should be myHeads compared with the snakes head NOT ANY PART OF THEIR BODY!*/
            for (let b = 0; b < hazards.length; b ++) {
                if (myHead.x == hazards[b].x && myHead.y == hazards[b].y) {
                    // sets the forcePushKill Reward to zero if I am in a hazard
                    forcePushKillReward = 0;
                }
            }
           /* if I am at the very edges of the board, then there is no reason to continuing pushing them to the end 
           because we are already at the end*/
            if (myHead.x == 0 || myHead.x == gameBoardProperties.width -1 || myHead.y == 0 || myHead.y == gameBoardProperties.height - 1) {
                forcePushKillReward = 0;
            }

            if (gameState.you.length >= 3 && gameState.you.length <= snakes[i].length) {
                // right movement at the top sideof the board
                if (myHead.y == gameBoardProperties.height -2 && myHead.x == snakes[i].body[0].x + 1 && snakes[i].body[0].y == gameBoardProperties.height -1) {
                    moveRightPoints += forcePushKillReward;
                }
                // left movement at the top side of the board
                if (myHead.y == gameBoardProperties.height -2 && myHead.x == snakes[i].body[0].x - 1 && snakes[i].body[0].y == gameBoardProperties.height -1) {
                    moveLeftPoints += forcePushKillReward;
                }
                // right movement at the bottom side of the board
                if (myHead.y == 1 && myHead.x == snakes[i].body[0].x + 1 && snakes[i].body[0].y == 0) {
                    moveRightPoints += forcePushKillReward;
                }
                // left movement at the bottom side of the board
                if (myHead.y == 1 && myHead.x == snakes[i].body[0].x - 1 && snakes[i].body[0].y == 0) {
                    moveLeftPoints += forcePushKillReward;
                }
                // up movement at the left side of the board
                if (myHead.x == 1 && myHead.y == snakes[i].body[0].y + 1 && snakes[i].body[0].x == 0) {
                    moveUpPoints += forcePushKillReward;
                }
                // down movement at the left side of the board
                if (myHead.x == 1 && myHead.y == snakes[i].body[0].y - 1 && snakes[i].body[0].x == 0) {
                    moveDownPoints += forcePushKillReward;
                }
                // up movement at the right side of the board
                if (myHead.x == gameBoardProperties.width -2 && myHead.y == snakes[i].body[0].y + 1 && snakes[i].body[0].x == gameBoardProperties.width -1) {
                    moveUpPoints += forcePushKillReward;
                }
                // down movement at the right side of the board
                if (myHead.x == gameBoardProperties.width -2 && myHead.y == snakes[i].body[0].y - 1 && snakes[i].body[0].x == gameBoardProperties.width -1) {
                    moveDownPoints += forcePushKillReward;
                }
            }
        }
    }
 
    // avoid hazards
    hazards = gameState.board.hazards;
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
                hazards.forEach((h) => {
                    // hazards that are 1 unit away && cuts off people on the edges of the board as long as I am not in a hazard
                    // or else I might die trying to do it.
                    for (let i = 0; i < snakes.length; i ++) {
                        let cutOffSnakeReward = (cuttingOffSnakeReward + 3);
                        /**Helps snake move in the right direction after it has cut off and is declared before the 
                         * CutoffsnakeReward is changed to zero, NOTE THIS MUST BE ON TOP OF THE IF STATEMENTS THAT MAKE
                         * CUT OFF SNAKRE REWARD EQUAL TO 0!!
                         * ALSO DON"T CHANGE THE CUTOFFSNAKEREWARD OR THE CUTOFFSNAKEREWARDMOVEINTHERIGHTDIRECTION VARIABLE!!!
                         */
                        let cutOffSnakeRewardMoveInTheRightDirection = 4;
                        /* if my snake is in any of these positions or coordinates then cutting off a snake would be useless and could
                        actually kill my snake in the end, I ONLY INCLUDE ONE COORDINATE FOR A REASON, DON'T A SECOND ONE!!!*/
                        if (myHead.x == 0) {
                            cutOffSnakeReward = 0;
                        }
                        if (myHead.x == gameBoardProperties.width -1) {
                            cutOffSnakeReward = 0;
                        }
                        if (myHead.y == gameBoardProperties.height -1) {
                            cutOffSnakeReward = 0;
                        }
                        if (myHead.y == 0) {
                            cutOffSnakeReward = 0;
                        }

                        // cuts snakes off at the far side of the board game
                        if (snakes[i].id == gameState.you.id) {
                            // if checking the same snake as my own skip that
                        } else {
                            let areThereHazards = 0;

                            if (myHead.x == h.x -1 && myHead.y == h.y) {
                                areThereHazards += 1;
                            }
                            if (myHead.x == h.x +1 && myHead.y == h.y) {
                                areThereHazards += 1;
                            }
                            if (myHead.y == h.y -1 && myHead.x == h.x) {
                                areThereHazards += 1;
                            }
                            if (myHead.y == h.y +1 && myHead.x == h.x) {
                                areThereHazards += 1;
                            }
                            if (areThereHazards == 0) {
                                // cuts of a snake at the right side of the board game
                                if (myHead.x == gameBoardProperties.width - 2 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                    moveRightPoints += cutOffSnakeReward;
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.x == gameBoardProperties.width - 1 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                    moveUpPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                                // reverse direction
                                if (myHead.x == gameBoardProperties.width - 2 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                    moveRightPoints += cutOffSnakeReward;
                                
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.x == gameBoardProperties.width - 1 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                    moveDownPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                           
                                // cuts of a snake at the left side of the board game
                                if (myHead.x == 1 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                    moveLeftPoints += cutOffSnakeReward;
                                  
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.x == 0 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                
                                    moveUpPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                                // reverse direction
                                if (myHead.x == 1 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                    moveLeftPoints += cutOffSnakeReward;
                                  
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.x == 0 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                            
                                    moveDownPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                            
                                // cuts of a snake at the top side of the board game
                                if (myHead.y == gameBoardProperties.height -2  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                    moveUpPoints += cutOffSnakeReward;
                                   
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.y == gameBoardProperties.height -1  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                
                                    moveRightPoints += (cutOffSnakeRewardMoveInTheRightDirection -1 );
                                }
                                // reverse direction
                                if (myHead.y == gameBoardProperties.height -2  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                    moveUpPoints += cutOffSnakeReward;
                                    
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.y == gameBoardProperties.height -1  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                    moveLeftPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                            
                                // cuts of a snake at the bottom side of the board game
                                if (myHead.y == 1  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                    moveDownPoints += cutOffSnakeReward;
                                    
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.y == 0  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                    
                                    moveRightPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                                // reverse direction
                                if (myHead.y == 1  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                    moveDownPoints += cutOffSnakeReward;
                                    
                                }
                                // helps it move in the right direction after the kill
                                if (myHead.y == 0  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                    moveLeftPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                                }
                                
                                // console.log("Are There Hazards?: " + areThereHazards);
                                
                            }
                            
                        }
                    }
                    // for hazards that are 1 unit away
                        if (myHead.x == h.x -1 && myHead.y == h.y) {
                            moveRightPoints -= 3;
                        }
                        if (myHead.x == h.x +1 && myHead.y == h.y) {
                            moveLeftPoints -= 3;
                        }
                        if (myHead.y == h.y -1 && myHead.x == h.x) {
                            moveUpPoints -= 3;
                        }
                        if (myHead.y == h.y +1 && myHead.x == h.x) {
                            moveDownPoints -= 3;
                        }

                    // for hazards that are 2 units away
                    // for hazards 2 units away
                        if (myHead.x == h.x -2 && myHead.y == h.y) {
                            moveRightPoints -= 1;
                        }
                        if (myHead.x == h.x +2 && myHead.y == h.y) {
                            moveLeftPoints -= 1;
                        }
                        if (myHead.y == h.y -2 && myHead.x == h.x) {
                            moveUpPoints -= 1;
                        }
                        if (myHead.y == h.y +2 && myHead.x == h.x) {
                            moveDownPoints -= 1;
                        }

                        // it will only do this stuff if I am in a hazard
                        if (myHead.x == h.x && myHead.y ==h.y) {
                            // this might seem like it is wrong, but please don't change it
                            let firstBracket = 0;
                            let secondBracket = 0;
                            let thirdBracket = 0;
                            let fourthBracket = 0;
                            /** I don't want the reward to be to high or else it will decrease the quality of my AI snake */
                            let getOutOfHazardsReward = 1;
                            for (let i = 0; i < Math.round(gameBoardProperties.height/2); i++) {
                                if (firstBracket == 0) {
                                    // helps me get out of hazards diagonally, move down and then right
                                    if (myHead.y - i != h.y && myHead.x + i != h.x) {
                                        moveDownPoints += getOutOfHazardsReward;
                                        moveRightPoints += getOutOfHazardsReward;
                                        firstBracket += 1;
                                    }
                                }
                                if (secondBracket == 0) {
                                    // helps me get out of hazards diagonally, move down and then left
                                    if (myHead.y - i != h.y && myHead.x - i != h.x) {
                                        moveDownPoints += getOutOfHazardsReward;
                                        moveLeftPoints += getOutOfHazardsReward;
                                        secondBracket += 1;
                                    }
                                }
                                if (thirdBracket == 0) {
                                    // helps me get out of hazards diagonally, move up and then left
                                    if (myHead.y + i != h.y && myHead.x - i != h.x) {
                                        moveUpPoints += getOutOfHazardsReward;
                                        moveLeftPoints += getOutOfHazardsReward;
                                        thirdBracket += 1;
                                    }
                                }
                                if (fourthBracket == 0) {
                                    // helps me get out of hazards diagonally, move up and then right
                                    if (myHead.y + i != h.y && myHead.x + i != h.x) {
                                        moveUpPoints += getOutOfHazardsReward;
                                        moveRightPoints += getOutOfHazardsReward;
                                        fourthBracket += 1;
                                    }
                                }
                            }
                        }
                })

                // cuts off snakes at the far sides of the board
                if (hazards.length == 0) {
                    for (let i = 0; i < snakes.length; i ++) {
    
                        let cutOffSnakeReward = (cuttingOffSnakeReward + 3);
                        /**Helps snake move in the right direction after it has cut off and is declared before the 
                         * CutoffsnakeReward is changed to zero, NOTE THIS MUST BE ON TOP OF THE IF STATEMENTS THAT MAKE
                         * CUT OFF SNAKRE REWARD EQUAL TO 0!!
                         * ALSO DON"T CHANGE THE CUTOFFSNAKEREWARD OR THE CUTOFFSNAKEREWARDMOVEINTHERIGHTDIRECTION VARIABLE!!!
                         */
                        let cutOffSnakeRewardMoveInTheRightDirection = 4;
                        /* if my snake is in any of these positions or coordinates then cutting off a snake would be useless and could
                        actually kill my snake in the end, I ONLY INCLUDE ONE COORDINATE FOR A REASON, DON'T A SECOND ONE!!!*/
                        if (myHead.x == 0) {
                            cutOffSnakeReward = 0;
                        }
                        if (myHead.x == gameBoardProperties.width -1) {
                            cutOffSnakeReward = 0;
                        }
                        if (myHead.y == gameBoardProperties.height -1) {
                            cutOffSnakeReward = 0;
                        }
                        if (myHead.y == 0) {
                            cutOffSnakeReward = 0;
                        }
    
                        if (snakes[i].id == gameState.you.id) {
                            // if checking the same snake as my own skip that
                        } else {
                            // cuts of a snake at the right side of the board game
                            if (myHead.x == gameBoardProperties.width - 2 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                moveRightPoints += cutOffSnakeReward;
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.x == gameBoardProperties.width - 1 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                moveUpPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                            // reverse direction
                            if (myHead.x == gameBoardProperties.width - 2 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                moveRightPoints += cutOffSnakeReward;
                            
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.x == gameBoardProperties.width - 1 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                moveDownPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                       
                            // cuts of a snake at the left side of the board game
                            if (myHead.x == 1 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                moveLeftPoints += cutOffSnakeReward;
                              
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.x == 0 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                            
                                moveUpPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                            // reverse direction
                            if (myHead.x == 1 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                moveLeftPoints += cutOffSnakeReward;
                              
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.x == 0 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                        
                                moveDownPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                        
                            // cuts of a snake at the top side of the board game
                            if (myHead.y == gameBoardProperties.height -2  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                moveUpPoints += cutOffSnakeReward;
                               
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.y == gameBoardProperties.height -1  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
            
                                moveRightPoints += (cutOffSnakeRewardMoveInTheRightDirection -1 );
                            }
                            // reverse direction
                            if (myHead.y == gameBoardProperties.height -2  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                moveUpPoints += cutOffSnakeReward;
                                
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.y == gameBoardProperties.height -1  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                moveLeftPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                        
                            // cuts of a snake at the bottom side of the board game
                            if (myHead.y == 1  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                moveDownPoints += cutOffSnakeReward;
                                
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.y == 0  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                
                                moveRightPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                            // reverse direction
                            if (myHead.y == 1  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                moveDownPoints += cutOffSnakeReward;
                                
                            }
                            // helps it move in the right direction after the kill
                            if (myHead.y == 0  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                moveLeftPoints += (cutOffSnakeRewardMoveInTheRightDirection -1);
                            }
                            
                            // console.log("Are There Hazards?: " + areThereHazards);

                        }
                    }

                }
   
 
 
    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    // this avoids food when it's health is greater than 60
    if (gameState.you.health > hungry) {
        food = gameState.board.food;
        food.forEach((f) => {
            /* if my safe moves are less than 1 or equal to one then we don't need to try and avoid more stuff
             or else I will lose and accidentally kill myself, it will be too much       */
            if (safeMoves.length > 1) {
                if (myHead.x == f.x -1 && myHead.y == f.y) {
                    moveRightPoints -= 1;
                }
                if (myHead.x == f.x +1 && myHead.y == f.y) {
                    moveLeftPoints -= 1;
                }
                if (myHead.y == f.y -1 && myHead.x == f.x) {
                    moveUpPoints -= 1;
                }
                if (myHead.y == f.y +1 && myHead.x == f.x) {
                    moveDownPoints -= 1;
                }

            }
        })
       
       
    }

    /* Helps my snake follow my tail, instead of getting into dead ends and losing to other big snakes 
    I changed it to having to be greater than eatAggressivelyUntilIamThisLong and changed 
    the followTailReward to 0.9 at the start because my snake is being stupid and following my tail too much 
    at the start and then I keep losing to other big 
    snakes**/
    hazards = gameState.board.hazards;
    if ( gameState.you.body.length > eatAggressivelyUntilIamThisLong) {
        let myTail = gameState.you.body.length;
        /* 0.5 for the followTailReward is the sweet spot, if it is any higher it will spin even when it is hungry and will spin 
        too much!! */
        let followTailReward = 0.9;

        // the lower my health is the more I decentivize my snake from following it's tail
        if (gameState.you.health > 90) {
            followTailReward = 0.5;
        } else if (gameState.you.health > 50) {
            followTailReward = 0.3;
        } else if (gameState.you.health > 30) {
            followTailReward = 0.20;
        } else {
            followTailReward = 0.10;
        }
        // don't follow your tail if you are in a hazards or else you will spin in an hazard and die
        for (let i = 0; i < hazards.length; i++ ) {
            // if my head is in any hazard we will set the foloowTailReward to zero and break the for loop
            if (myHead.x == hazards[i].x && myHead.y == hazards[i].y) {
                followTailReward = 0;
                break;
            }
        }
            // from 1 unit away tail
            if ( gameState.you.body[myTail -1].x -1 == myHead.x && myHead.y == gameState.you.body[myTail -1].y) {
                moveRightPoints += followTailReward;
            }
            if ( gameState.you.body[myTail -1].x +1 == myHead.x && myHead.y == gameState.you.body[myTail -1].y) {
                moveLeftPoints +=followTailReward;
            }
            if ( gameState.you.body[myTail -1].y +1 == myHead.y && myHead.x == gameState.you.body[myTail -1].x) {
                moveDownPoints += followTailReward;
            }
            if ( gameState.you.body[myTail -1].y -1 == myHead.y && myHead.x == gameState.you.body[myTail -1].x) {
                moveUpPoints += followTailReward;
            }

            // 2 units away from tail
            if ( gameState.you.body[myTail -1].x -2 == myHead.x && myHead.y == gameState.you.body[myTail -1].y) {
                moveRightPoints += followTailReward;
            }
            if ( gameState.you.body[myTail -1].x +2 == myHead.x && myHead.y == gameState.you.body[myTail -1].y) {
                moveLeftPoints +=followTailReward;
            }
            if ( gameState.you.body[myTail -1].y +2 == myHead.y && myHead.x == gameState.you.body[myTail -1].x) {
                moveDownPoints += followTailReward;
            }
            if ( gameState.you.body[myTail -1].y -2 == myHead.y && myHead.x == gameState.you.body[myTail -1].x) {
                moveUpPoints += followTailReward;
            }
            // diagonally from tail
            if ( gameState.you.body[myTail -1].x -1 == myHead.x && myHead.y == gameState.you.body[myTail -1].y - 1) {
                moveUpPoints += followTailReward;
            }
            if ( gameState.you.body[myTail -1].x +1 == myHead.x && myHead.y == gameState.you.body[myTail -1].y - 1) {
                moveUpPoints +=followTailReward;
            }
            if ( gameState.you.body[myTail -1].x -1 == myHead.x && myHead.y == gameState.you.body[myTail -1].y + 1) {
                moveDownPoints += followTailReward;
            }
            if ( gameState.you.body[myTail -1].x +1 == myHead.x && myHead.y == gameState.you.body[myTail -1].y + 1) {
                moveDownPoints +=followTailReward;
            }
            
        // console.log("Follow Tail Reward: " + followTailReward);
    }

    // NEW SECTION:

    // Are there any safe moves left?
  
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
 
 
    if (safeMoves.length == 0) {
            // ONLY FOR OUR FAILED DECISIONS, RESETS PART OF OUR CODE!!
            console.log(`MOVE ${gameState.turn}: WARNING!!! No safe moves detected! CHECKING AGAIN!!`);
            moveSafety = {
                up: true,
                down: true,
                left: true,
                right: true
            };
            // We've included code to prevent your Battlesnake from moving backwards
  
    if (myNeck.x < myHead.x && myHead.y == myNeck.y) {        // Neck is left of head, don't move left
        moveSafety.left = false;
      
    } else if (myNeck.x > myHead.x && myHead.y == myNeck.y) { // Neck is right of head, don't move right
        moveSafety.right = false;
      
    } else if (myNeck.y < myHead.y &&  myHead.x == myNeck.x) { // Neck is below head, don't move down
        moveSafety.down = false;
      
    } else if (myNeck.y > myHead.y && myHead.x == myNeck.x) { // Neck is above head, don't move up
        moveSafety.up = false;
    }
  
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board
    if (myHead.x == 0) {
        moveSafety.left = false;
    }
    if (myHead.x == gameBoardProperties.width -1) {
        moveSafety.right = false;
    }
    if (myHead.y == 0) {
        moveSafety.down = false;
    }
    if (myHead.y == gameBoardProperties.height -1) {
        moveSafety.up = false;
    }
  
    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
 
 
 
 
    // this for loop makes sure that the snake doesn't collide with any of the segments of it's body, except my tail
    if ( gameState.you.body.length > 4) {
        for (let i = 2; i < gameState.you.body.length; i++) {
            if (i >= gameState.you.body.length -1) {
                break;
            }
            if ( gameState.you.body[i].x -1 == myHead.x && myHead.y == gameState.you.body[i].y) {
                moveSafety.right = false;
            }
            if ( gameState.you.body[i].x +1 == myHead.x && myHead.y == gameState.you.body[i].y) {
                moveSafety.left = false;
            }
            if ( gameState.you.body[i].y +1 == myHead.y && myHead.x == gameState.you.body[i].x) {
                moveSafety.down = false;
            }
            if ( gameState.you.body[i].y -1 == myHead.y && myHead.x == gameState.you.body[i].x) {
                moveSafety.up = false;
            }
        }
    }
  
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
  
    snakes = gameState.board.snakes;
 
    // this helps me TO NOT avoid other people's tails if there are no safe moves, hopefully they haven't just ate food
    // or else I will lose
    for (let i = 0; i < snakes.length; i ++) {
        if (snakes[i].id == gameState.you.id) { 

        } else {
            for (let a = 0; a < snakes[i].body.length; a++) {
                if (a >= snakes[i].body.length -1 ) {
                    break;
                }
                if (myHead.x == snakes[i].body[a].x -1 && myHead.y == snakes[i].body[a].y) {
                    moveSafety.right = false;
                }
                if (myHead.x == snakes[i].body[a].x +1 && myHead.y == snakes[i].body[a].y) {
                    moveSafety.left = false;
                }
                if (myHead.y == snakes[i].body[a].y -1 && myHead.x == snakes[i].body[a].x) {
                    moveSafety.up = false;
                }
                if (myHead.y == snakes[i].body[a].y +1 && myHead.x == snakes[i].body[a].x) {
                    moveSafety.down = false;
                } 

            }
        }
    }

 
    /**The Top Code works better but I am not going to erase this bottom one just in case I want to revert to it */

    // snakes.forEach((snake) => {
    //     const snakeBody = snake.body;
 
 
 
 
    //     snakeBody.forEach((b) => {
    //         if (snake.id == gameState.you.id){
    //             return;
    //         }
    //         // keeps my snake from colliding with other snakes and every part of their body as well
    //         // DON"T EDIT THIS!!!!!!!!!!!!!!!!!!
    //         if (myHead.x == b.x -1 && myHead.y == b.y) {
    //             moveSafety.right = false;
    //         }
    //         if (myHead.x == b.x +1 && myHead.y == b.y) {
    //             moveSafety.left = false;
    //         }
    //         if (myHead.y == b.y -1 && myHead.x == b.x) {
    //             moveSafety.up = false;
    //         }
    //         if (myHead.y == b.y +1 && myHead.x == b.x) {
    //             moveSafety.down = false;
    //         }
    //     })
    // })
 
 
    /* the punishments here for staying in the hazards will be less since I am in a dire situation and my safe moves.length == 0
     and don't have many moves I can make and sometimes I may need to stay in the hazards to eat food */
    hazards.forEach((h) => {
        // for hazards 1 unit away
        if (myHead.x == h.x -1 && myHead.y == h.y) {
            moveRightPoints -= 1;
        }
        if (myHead.x == h.x +1 && myHead.y == h.y) {
            moveLeftPoints -= 1;
        }
        if (myHead.y == h.y -1 && myHead.x == h.x) {
            moveUpPoints -= 1;
        }
        if (myHead.y == h.y +1 && myHead.x == h.x) {
            moveDownPoints -= 1;
        }

        // for hazards 2 units away
        if (myHead.x == h.x -2 && myHead.y == h.y) {
            moveRightPoints -= 1;
        }
        if (myHead.x == h.x +2 && myHead.y == h.y) {
            moveLeftPoints -= 1;
        }
        if (myHead.y == h.y -2 && myHead.x == h.x) {
            moveUpPoints -= 1;
        }
        if (myHead.y == h.y +2 && myHead.x == h.x) {
            moveDownPoints -= 1;
        }
    })
}
 
    // this marks the end of the dire situation and safemoves.length == 0

    // NEW SECTION:
        // filters safe moves before making a final move
        safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
 
 
        // makes smart moves using safe moves and direction points
        /* EDIT THIS */

        snakes = gameState.board.snakes

        for (let i = 0; i < snakes.length; i ++) {
            let oneUnitWideDeadEndPointsRemoved = 30
            let offSetSinceCheckingOtherSnakes = 1;

            /* I am changing this only for this specific section ONLY because this will help me stop getting stuck in dead ends in my body
                This kind of works like recursion, but I need to add more if statements here to make it smarter*/

            if (snakes[i].id == gameState.you.id) { 
                for (let a = 0; a < snakes[i].body.length; a++) {
                    // This is looking only at my snake


                   // GENERATIVE AI GUESSES

                   // this breaks the code if looking at my tail
                   if (a >= snakes[i].body.length -1 ) {
                    break;
                    }


                   if (moveSafety.up == true ) {
                       if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x) {
                           moveUpPoints -= AIbadMovePunishmentSpecial;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.y == snakes[i].body[a].y -3 && myHead.x == snakes[i].body[a].x) {
                           moveUpPoints -=AIbadMovePunishmentSpecial;
                       }
                   
                   }
                   if (moveSafety.down == true ) {
                       if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x) {
                           moveDownPoints -= AIbadMovePunishmentSpecial;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.y == snakes[i].body[a].y +3 && myHead.x == snakes[i].body[a].x) {
                           moveDownPoints -= AIbadMovePunishmentSpecial;
                       }
                   
                   }
                   if (moveSafety.left == true ) {
                       if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y) {
                           moveLeftPoints -= AIbadMovePunishmentSpecial;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.x == snakes[i].body[a].x +3 && myHead.y == snakes[i].body[a].y) {
                           moveLeftPoints -= AIbadMovePunishmentSpecial;
                       }
                   
                   }
                   if (moveSafety.right == true ) {
                       if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y) {
                           moveRightPoints -= AIbadMovePunishmentSpecial;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.x == snakes[i].body[a].x -3 && myHead.y == snakes[i].body[a].y) {
                           moveRightPoints -= AIbadMovePunishmentSpecial;
                       }
                   }

                }

                // stops my snake from going into 1 and a tiny bit more unit wide vertical and horizontal dead ends in my body
                // LEFT MOVEMENT
                let threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                let thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                let lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x < myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveLeftPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Left: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x < myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveLeftPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Left: ThreeQualifications: " + threeQualifications);

                // RIGHT MOVEMENT
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x > myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveRightPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Right: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x > myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveRightPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Right: ThreeQualifications: " + threeQualifications);
                // DOWN MOVEMENT
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y < myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveDownPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Down: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y < myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveDownPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Down: ThreeQualifications: " + threeQualifications);
                // UP MOVEMENT
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y > myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveUpPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Up: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3; count < (snakes[i].body.length - (6)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y > myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveUpPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Up: ThreeQualifications: " + threeQualifications);

            } else {
                /* This is comparing my snake against other snakes, it does not include my snake in it's calculations
                I have 2 of these for a reason, because I want to use both codes when I am the longest and when I am not
                although I am actually only use a small chunk for this part, because it kind of protects me from 
                colliding with other snakes although this a temporary solution, this may seem in correct but I have carefully
                thought it through, SO DO NOT CHANGE IT!!!! */

                // stops my snake from going into 1 and a tiny bit more unit wide vertical and horizontal dead ends in other snake's
                // body
                // LEFT MOVEMENT
                let threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                let thirdOffSet = 0;
                for (let count = 3 - offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                let lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4 - offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x < myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveLeftPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                console.log("");
                // console.log("Checking Against Other Snakes Left: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3 - offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x < myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveLeftPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Left: ThreeQualifications: " + threeQualifications);

                // RIGHT MOVEMENT
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3- offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x > myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveRightPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Right: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3- offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].x > myHead.x) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveRightPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Right: ThreeQualifications: " + threeQualifications);
                // DOWN MOVEMENT
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3- offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y < myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveDownPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Down: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3- offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y + 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y + 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y < myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveDownPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Down: ThreeQualifications: " + threeQualifications);
                // UP MOVEMENT
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3- offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x + 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x - 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y > myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveUpPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Up: ThreeQualifications: " + threeQualifications);
                // reverse
                threeQualifications = 0;
                // helps me keep track of the last part we are checking for in the dead end in our snakes body
                thirdOffSet = 0;
                for (let count = 3- offSetSinceCheckingOtherSnakes; count < (snakes[i].body.length - (6- offSetSinceCheckingOtherSnakes)); count++) {
                    // count = 3 since it cannot be the head, or neck
                    if (myHead.y == snakes[i].body[count-1].y - 1 && myHead.x == snakes[i].body[count-1].x - 1) {
                        threeQualifications += 1;
                        break;
                    }
                }
                // gameBoardProperties times 2 plus 3, because the trap could be as long as the gameBoard
                // plus 4 because the trap has to take up at least 4 units from after 3 units, plus 3 because it 
                // cannot start from the head or neck
                lengthToCheck = ((gameBoardProperties.height*2) +3);
                // I am changing it to this because the upper one is causing some problems for my code although
                // this is a temporary solution.
                lengthToCheck = snakes[i].body.length;
                // sometimes the lengthToCheck will be greater than the snakes body, it that case it will be undefined
                // and I will have to set is to the snake's body length minus 2
                if (lengthToCheck > snakes[i].body.length) {
                    lengthToCheck = snakes[i].body.length;
                }
                for (let count = 7- offSetSinceCheckingOtherSnakes; count < lengthToCheck; count++) {
                    if (myHead.y == snakes[i].body[count -1].y - 1 && myHead.x == snakes[i].body[count -1].x + 1) {
                        threeQualifications += 1;
                        thirdOffSet = count;
                        break;
                    }
                }
                // length to check minus 1 because it will not check the unit I have as my offset
                for (let count = 4- offSetSinceCheckingOtherSnakes; count < (thirdOffSet -1); count++) {
                    if (snakes[i].body[count -1].y > myHead.y) {
                        threeQualifications += 1;
                        break;
                    }
                }
                if (threeQualifications == 3) {
                    moveUpPoints -= oneUnitWideDeadEndPointsRemoved;
                }
                // console.log("Checking Against Other Snakes Up: ThreeQualifications: " + threeQualifications);





               











                // If I am longer than that particular snake then do this
                if (gameState.you.length > snakes[i].length) {
                    let AIbadMovePunishment = (theSamePunishment - 1);
                    // I start at a at 1 because I want it to ignore the head
                    for (let a = 1; a < snakes[i].body.length; a++) {

                        // ignores the tail if it needs to
                        // breaks the for loop when looking at the snakes tail if I am not supposed to be avoid their tail
                        if (avoidOtherSnakesTails === false) {
                            if (a >= snakes[i].length -1) {
                                break;
                            }
                        }

                        // up movement
                        if (moveSafety.up == true ) {
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x) {
                                moveUpPoints -= AIbadMovePunishment;
                            }
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x + 1) {
                                moveUpPoints -=AIbadMovePunishment;
                            }
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x - 1) {
                                moveUpPoints -=AIbadMovePunishment;
                            }
                        }
                        // down movement
                        if (moveSafety.down == true ) {
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x + 1) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x - 1) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                        }
                        // left movement
                        if (moveSafety.left == true ) {
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y + 1) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y - 1) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                        }
                        // right movement
                        if (moveSafety.right == true ) {
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y + 1) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y - 1) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                        }
    
                    }
                }

                // I start at a at 1 because I want it to ignore the head
                for (let a = 1; a < snakes[i].body.length; a++) {
 
                    // GENERATIVE AI GUESSES

                    // helps ignore the tail if I need to
                    // breaks the for loop when looking at the snakes tail if I am not supposed to be avoid their tail
                    if (avoidOtherSnakesTails === false) {
                        if (a >= snakes[i].length -1) {
                            break;
                        }
                    }

                    // If I am shorter than that particular snake
                    if (gameState.you.length <= snakes[i].length) {
                        let AIbadMovePunishment = (theSamePunishment - 1);
                    
                        // up movement
                        if (moveSafety.up == true ) {
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x) {
                                moveUpPoints -= AIbadMovePunishment;
                            }
                            // // I am not sure if this is even useful anymore since I have rearranged my code
                            // // this helps me to stay away from other snakes
                            // if (myHead.y == snakes[i].body[a].y -3 && myHead.x == snakes[i].body[a].x) {
                            //     moveUpPoints -=AIbadMovePunishment;
                            // }
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x + 1) {
                                moveUpPoints -=AIbadMovePunishment;
                            }
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x - 1) {
                                moveUpPoints -=AIbadMovePunishment;
                            }
                        
                        }
                        // down movement
                        if (moveSafety.down == true ) {
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                            // // I am not sure if this is even useful anymore since I have rearranged my code
                            // // this helps me to stay away from other snakes
                            // if (myHead.y == snakes[i].body[a].y +3 && myHead.x == snakes[i].body[a].x) {
                            //     moveDownPoints -= AIbadMovePunishment;
                            // }
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x + 1) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x - 1) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                        
                        }
                        // left movement
                        if (moveSafety.left == true ) {
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                            // // I am not sure if this is even useful anymore since I have rearranged my code
                            // // this helps me to stay away from other snakes
                            // if (myHead.x == snakes[i].body[a].x +3 && myHead.y == snakes[i].body[a].y) {
                            //     moveLeftPoints -= AIbadMovePunishment;
                            // }
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y + 1) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y - 1) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                        
                        }
                        // right movement
                        if (moveSafety.right == true ) {
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                            // // I am not sure if this is even useful anymore since I have rearranged my code
                            // // this helps me to stay away from other snakes
                            // if (myHead.x == snakes[i].body[a].x -3 && myHead.y == snakes[i].body[a].y) {
                            //     moveRightPoints -= AIbadMovePunishment;
                            // }
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y + 1) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y - 1) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                        }

                    }
                    
                }
            }
        }








        let goingInBetweenBodyDeadEndPunishment = 18;
        /*Checking for dead ends included between my body and another snakes body
         can compare with all snakes including my own with a maximum of 1 unit wide and 2 units tall that is the difference
         between this code and the one on top, it can compare with all snakes but only with a maximum length of 2 units unlike
         the top which doesn't actually have a maximum for length only for width which is 1 unit 
         One Problem That I see with this method is that it can only compare 2 snakes at a time, even though it 
         can do it for all snakes regardless of the order. Sometimes the blockage maybe happening between 3 or 4 snakes!!
         In that Case this code is completely useless but hey it is still an improvement over the old one, I would say that
         this is where flood fill might possibly be better, although flood fill is not always the solution and 
         can sometimes be counterproductive, so yeah**/

        // Block Up Movement
        let betweenBodiesQualifications = 0;
        let otherCheck = 0;
        // just to make it shorter
        let ALLSNAKES = allOfSnakesPositionsIncludingMyOwn;
        // since I am already in a for loop I only need one more for loop
        for (let z = 0; z < allOfSnakesPositionsIncludingMyOwn.length; z++) {
                if (myHead.x == ALLSNAKES[z].x + 1 && myHead.y == ALLSNAKES[z].y - 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x -1 && myHead.y == ALLSNAKES[z].y -1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y -2 || myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y -3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveUpPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("UP MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);

            // Reverse
            // Checking for dead ends included between my body and another snakes body
            // Block Up Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x - 1 && myHead.y == ALLSNAKES[z].y - 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x +1 && myHead.y == ALLSNAKES[z].y -1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y -2 || myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y -3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveUpPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("Reverse: UP MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);
            // Block Down Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x + 1 && myHead.y == ALLSNAKES[z].y + 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x -1 && myHead.y == ALLSNAKES[z].y +1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y +2 || myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y +3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveDownPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("DOWN MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);

            // Reverse
            // Checking for dead ends included between my body and another snakes body
            // Block Down Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x - 1 && myHead.y == ALLSNAKES[z].y + 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x +1 && myHead.y == ALLSNAKES[z].y +1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                // ignores snake's tail
                if (myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y +2 || myHead.x == ALLSNAKES[z].x && myHead.y == ALLSNAKES[z].y +3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveDownPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("Reverse: DOWN MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);

            // Blocks Right Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x - 1 && myHead.y == ALLSNAKES[z].y - 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x -1 && myHead.y == ALLSNAKES[z].y +1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x -2 || myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x -3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveRightPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("RIGHT MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);

            // Reverse
            // Checking for dead ends included between my body and another snakes body
            // Blocks Right Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x - 1 && myHead.y == ALLSNAKES[z].y + 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x -1 && myHead.y == ALLSNAKES[z].y -1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x -2 || myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x -3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveRightPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("Reverse: RIGHT MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);
            // Blocks Left Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x + 1 && myHead.y == ALLSNAKES[z].y - 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x +1 && myHead.y == ALLSNAKES[z].y +1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x +2 || myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x +3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveLeftPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("LEFT MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);

            // Reverse
            // Checking for dead ends included between my body and another snakes body
            // Blocks Left Movement
            betweenBodiesQualifications = 0;
            otherCheck = 0;
                if (myHead.x == ALLSNAKES[z].x + 1 && myHead.y == ALLSNAKES[z].y + 1) {
                    betweenBodiesQualifications += 1;
                }
                if (myHead.x == ALLSNAKES[z].x +1 && myHead.y == ALLSNAKES[z].y -1) {
                    betweenBodiesQualifications += 1;
                }
            // checks all snakes
                if (myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x +2 || myHead.y == ALLSNAKES[z].y && myHead.x == ALLSNAKES[z].x +3) {
                    otherCheck += 1;
                }
            // needs at least 2 betweenbody checks and at least one otherCheck
            if (betweenBodiesQualifications == 2 && otherCheck >= 1) {
                moveLeftPoints -= goingInBetweenBodyDeadEndPunishment;
            }
            // console.log("Reverse: LEFT MOVEMENT BetweenbodiesQualifications and OtherCheck: " + betweenBodiesQualifications + " " + otherCheck);

        }














        /** Prevents my battlesnake from going into dead ends into other snakes or my snakes bodies at the very edge of the 
         * snake board
         */
        let alongTheWallInBodyDeadEndPunishment = 15;
        let distanceUntilDeadEnd = 0;
        let bodySegmentsInStraightLine = 0;
        // dead end along the bottom wall going to the right
        if (myHead.y == 0 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x + z == ALLSNAKES[i].x && myHead.y == ALLSNAKES[i].x) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                    }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x + i == ALLSNAKES[c].x && myHead.y + 1 == ALLSNAKES[c].x) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveRightPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("BOTTOM WALL MOVING RIGHT: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        // Reverse
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the bottom wall going to the left
        if (myHead.y == 0 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x - z == ALLSNAKES[i].x && myHead.y == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x - i == ALLSNAKES[c].x && myHead.y + 1 == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveLeftPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("BOTTOM WALL MOVING LEFT: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the top wall going to the right
        if (myHead.y == gameBoardProperties.height -1 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x + z == ALLSNAKES[i].x && myHead.y == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x + i == ALLSNAKES[c].x && myHead.y - 1 == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveRightPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("TOP WALL MOVING RIGHT: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        // reverse
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the top wall going to the left
        if (myHead.y == gameBoardProperties.height -1 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x - z == ALLSNAKES[i].x && myHead.y == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x - i == ALLSNAKES[c].x && myHead.y - 1 == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveLeftPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("TOP WALL MOVING LEFT: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the left wall going up
        if (myHead.x == 0 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x == ALLSNAKES[i].x && myHead.y + z == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x + 1 == ALLSNAKES[c].x && myHead.y + i == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveUpPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("LEFT WALL MOVING UP: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        // Reverse
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the left wall going down
        if (myHead.x == 0 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x == ALLSNAKES[i].x && myHead.y - z == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x + 1 == ALLSNAKES[c].x && myHead.y - i == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveDownPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("LEFT WALL MOVING DOWN: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the right wall going up
        if (myHead.x == gameBoardProperties.width - 1 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x == ALLSNAKES[i].x && myHead.y + z == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x - 1 == ALLSNAKES[c].x && myHead.y + i == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveUpPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("RIGHT WALL MOVING UP: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }
        // Reverse
        distanceUntilDeadEnd = 0;
        bodySegmentsInStraightLine = 0;
        // dead end along the right wall going down
        if (myHead.x == gameBoardProperties.width - 1 ) {
            for (let i = 0; i < allOfSnakesPositionsIncludingMyOwn.length; i++) {
                    for (let z = 1; z < gameBoardProperties.width; z++) {
                        if (myHead.x == ALLSNAKES[i].x && myHead.y - z == ALLSNAKES[i].y) {
                            distanceUntilDeadEnd = z;
                            break;
                        }
                }
            }
            for (let i = 1; i <distanceUntilDeadEnd; i++) {
                for (let c = 0; c < allOfSnakesPositionsIncludingMyOwn.length; c ++) {
                        if (myHead.x - 1 == ALLSNAKES[c].x && myHead.y - i == ALLSNAKES[c].y) {
                            bodySegmentsInStraightLine += 1;
                        }
                }
            }
            if (distanceUntilDeadEnd == bodySegmentsInStraightLine && bodySegmentsInStraightLine != 0 || distanceUntilDeadEnd - 1 == bodySegmentsInStraightLine || distanceUntilDeadEnd - 2 == bodySegmentsInStraightLine) {
                moveDownPoints -= alongTheWallInBodyDeadEndPunishment;
            }
            console.log("RIGHT WALL MOVING DOWN: distanceUntilDeadEnd and bodySegmentsInStraightLine: " + distanceUntilDeadEnd + "" + bodySegmentsInStraightLine);
        }











        // END OF A SECTION START OF A NEW SECTION

        // FOOD:

        // increases points for being hungry and having food close to you
                // Don't remove "if (i < 1)" it is extremely IMPORTANT!!
                    if (gameState.you.health < hungry) {
                        let food = gameState.board.food;
                        // this helps me not oversShoot eating for food that is far away
                        let doNotOverShootEating = 0;
                        food.forEach((f) => {
                            /* if my safe moves are less than 1 or equal to one then we don't need to try and avoid more stuff
                             or else I will lose and accidentally kill myself, it will be too much       */

                                // eat food that is adjacent to me
                                if (myHead.x == f.x -1 && myHead.y == f.y) {
                                    moveRightPoints += 3;
                                }
                                if (myHead.x == f.x +1 && myHead.y == f.y) {
                                    moveLeftPoints += 3;
                                }
                                if (myHead.y == f.y -1 && myHead.x == f.x) {
                                    moveUpPoints += 3;
                                }
                                if (myHead.y == f.y +1 && myHead.x == f.x) {
                                    moveDownPoints += 3;
                                }

                                // eat food that is diagonal to me
                                if (myHead.x == f.x -1 && myHead.y == f.y -1) {
                                    moveRightPoints += 2;
                                    moveUpPoints += 2;
                                }
                                if (myHead.x == f.x +1 && myHead.y == f.y - 1) {
                                    moveLeftPoints += 2;
                                    moveUpPoints += 2;
                                }
                                if (myHead.y == f.y + 1 && myHead.x == f.x -1) {
                                    moveUpPoints += 2;
                                    moveRightPoints += 2;
                                }
                                if (myHead.y == f.y +1 && myHead.x == f.x + 1) {
                                    moveDownPoints += 2;
                                    moveLeftPoints += 2;
                                }

                                // eating food that is 2 units or more away
                                // eat food that is adjacent to me
                                // Now my snake track food and eat food anywehre on the game board
                                for (let i = 2; i < gameBoardProperties.height - 4; i++) {
                                    /** I am removing the Left and Right functions because it is ruining my snakes ability
                                     * to stay alive
                                     */
                                    // if (myHead.x == f.x -i && myHead.y == f.y) {
                                    //     moveRightPoints += 2;
                                    //     doNotOverShootEating += 1;
                                    // }
                                    // if (myHead.x == f.x +i && myHead.y == f.y) {
                                    //     moveLeftPoints += 2;
                                    //     doNotOverShootEating += 1;
                                    // }
                                    if (doNotOverShootEating >= 1) {
                                        break;
                                    }
                                    let foodReward = 1.5;
                                    // helps me get food better if I am really hungry
                                    if (gameState.you.health < superDuperHungry) {
                                        foodReward = 4;
                                    }
                                    if (myHead.y == f.y -i && myHead.x == f.x) {
                                        moveUpPoints += foodReward;
                                        doNotOverShootEating += foodReward;
                                    }
                                    if (myHead.y == f.y +i && myHead.x == f.x) {
                                        moveDownPoints += 1;
                                        doNotOverShootEating += foodReward;
                                    }

                                }
                        })
                       
                       
                    }
 
 
                // increases points by a lot for being really SUPER DUPER HUNGRY and having food close to you
                    if (gameState.you.health < superDuperHungry) {
                        superDuperReallyHungry = true;
                        let food = gameState.board.food;
                        food.forEach((f) => {
                            /* if my safe moves are less than 1 or equal to one then we don't need to try and avoid more stuff
                             or else I will lose and accidentally kill myself, it will be too much       */
                                if (myHead.x == f.x -1 && myHead.y == f.y) {
                                    // I will increase th points by 11 and not more than that, because eating food
                                    // when really hungry could kill me on the next term, the benefit here doesn't always
                                    // outweight everything else, think logically here!!
                                    moveRightPoints += 11;
                                    // This true part at the bottom may seem useless but I am going to leave it here
                                    // Just in case!!
                                    moveSafety.right = true;
                                }
                                if (myHead.x == f.x +1 && myHead.y == f.y) {
                                    // I will increase th points by 11 and not more than that, because eating food
                                    // when really hungry could kill me on the next term, the benefit here doesn't always
                                    // outweight everything else, think logically here!!
                                    moveLeftPoints += 11;
                                    // This true part at the bottom may seem useless but I am going to leave it here
                                    // Just in case!!
                                    moveSafety.left = true;
                                }
                                if (myHead.y == f.y -1 && myHead.x == f.x) {
                                    // I will increase th points by 11 and not more than that, because eating food
                                    // when really hungry could kill me on the next term, the benefit here doesn't always
                                    // outweight everything else, think logically here!!
                                    moveUpPoints += 11;
                                    // This true part at the bottom may seem useless but I am going to leave it here
                                    // Just in case!!
                                    moveSafety.up = true;
                                }
                                if (myHead.y == f.y +1 && myHead.x == f.x) {
                                    // I will increase th points by 11 and not more than that, because eating food
                                    // when really hungry could kill me on the next term, the benefit here doesn't always
                                    // outweight everything else, think logically here!!
                                    moveDownPoints += 11;
                                    // This true part at the bottom may seem useless but I am going to leave it here
                                    // Just in case!!
                                    moveSafety.down = true;
                                }

                                // eat food that is horizontally adjacted to me that is 2 units away when I am super duper hungry
                                if (gameState.you.health < superDuperHungry) {
                                    if (myHead.x == f.x -2 && myHead.y == f.y) {
                                        moveRightPoints += 4;
                                    }
                                    if (myHead.x == f.x +2 && myHead.y == f.y) {
                                        moveLeftPoints += 4;
                                    }
                                }
                        })
                       
                       
                    }

        // END OF AN OLD SECTION START OF A NEW SECTION
        
        safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);

        // takes away points for their safety being false, DO NOT CHANGE THIS!!!!!
        let pointsRemovedForNotBeingSafe = 200;
        // REALLY BAD CHOICES at -6 is THE SWEET SPOT DO NOT CHANGE THIS!!!!
        let reallyBadChoices = -145;
            if (moveSafety.up == false) {
                moveUpPoints -= pointsRemovedForNotBeingSafe;
            }
            if (moveSafety.down == false) {
                moveDownPoints -= pointsRemovedForNotBeingSafe;
            }
            if (moveSafety.left == false) {
                moveLeftPoints -= pointsRemovedForNotBeingSafe;
            }
            if (moveSafety.right == false) {
                moveRightPoints -= pointsRemovedForNotBeingSafe;
            }

            let deadEndPunishmentPoints = (theSamePunishment + 1);
            // I don't want it to be to big here, because it might not be the right decision, please don't change the 
            // number here because this is the sweet spot, "2"
            let moveAwayFromBorderPoints = 3;
    
           // INSERTED BACK STUFF
           let distanceFromBorder = 2;
           // if my health is less than 50 the distance from the border is lowered which makes it easier to find food
           if (gameState.you.health < 90) {
            distanceFromBorder = 1;
        } else if (gameState.you.length >= (  (gameBoardProperties.height -3)*(gameBoardProperties.width - 3)  )) {
            // if I am to big, then it gives me more space
            distanceFromBorder = 1;
        }
                // #1
                // protects me from going into dead ends in the corners by maximum 2 units
                if (myHead.y +distanceFromBorder >= gameBoardProperties.height -1) {
                    moveUpPoints -= deadEndPunishmentPoints;
                    moveDownPoints += moveAwayFromBorderPoints;
                }
                // #2
                // protects me from going into dead ends in the corners by maximum 2 units
                if (myHead.y - distanceFromBorder <= 0) {
                    moveDownPoints -=deadEndPunishmentPoints;
                    moveUpPoints += moveAwayFromBorderPoints;
                }
                // #3
                // protects me from going into dead ends in the corners by maximum 2 units
                if (myHead.x -distanceFromBorder <= 0) {
                    moveLeftPoints -= deadEndPunishmentPoints;
                    moveRightPoints += moveAwayFromBorderPoints;
                }
                // #4
                // protects me from going into dead ends in the corners by maximum 2 units
                if (myHead.x +distanceFromBorder >= gameBoardProperties.width -1) {
                    moveRightPoints -= deadEndPunishmentPoints;
                    moveLeftPoints += moveAwayFromBorderPoints;
                }
       
        // rules out any real bad choices
        // DO NOT CHANGE THIS!!!!
        if (UpPointsHigher < reallyBadChoices) {
            moveSafety.up = false;
        }
        if (DownPointsHigher < reallyBadChoices) {
            moveSafety.down = false;
        }
        if (LeftPointsHigher < reallyBadChoices) {
            moveSafety.left = false;
        }
        if (RightPointsHigher < reallyBadChoices) {
            moveSafety.right = false;
        }
        

        // checks which moves have higher points, DON'T CHANGE THIS!!!!!! ONLY REVIEW!!
        if (moveSafety.up == true) {
            if (moveUpPoints > moveRightPoints &&  moveUpPoints > moveLeftPoints && moveUpPoints > moveDownPoints) {
                UpPointsHigher = true;
            }


        }
        if (moveSafety.down == true) {
            if (moveDownPoints > moveRightPoints && moveDownPoints > moveUpPoints && moveDownPoints > moveLeftPoints) {
                DownPointsHigher = true;
            }
           
        }
        if (moveSafety.left == true) {
            if (moveLeftPoints > moveRightPoints && moveLeftPoints > moveUpPoints && moveLeftPoints > moveDownPoints) {
                LeftPointsHigher = true;
            }
           
        }
        if (moveSafety.right == true) {
            if (moveRightPoints > moveLeftPoints && moveRightPoints > moveUpPoints && moveRightPoints > moveDownPoints) {
                RightPointsHigher = true;
            }
           
        }
   
        // sometimes none of the moves returns as true in that case I have to choose one of the moves that
        // are greater than -1, at least it won't be an awfully bad choice, yay!!
        // -1 is the sweet spot, DO NOT CHANGE THIS!!!!
        if (LeftPointsHigher == false && UpPointsHigher == false && RightPointsHigher == false && DownPointsHigher == false) {
            if (moveLeftPoints >= -1) {
                LeftPointsHigher = true;
            } else if(moveRightPoints >= -1) {
                RightPointsHigher = true;
            } else if (moveDownPoints >= -1) {
                DownPointsHigher = true;
            } else {
                if (moveUpPoints >= -1) {
                    UpPointsHigher = true;
                }
            }
        }

        // DON'T EDIT THIS ONLY REVIEW IT!!
        // sometimes the benchmark is less than -1 and this causes problems so I am doing add this;
        if (LeftPointsHigher == false && UpPointsHigher == false && RightPointsHigher == false && DownPointsHigher == false) {
            for (let i = 2; i < 10; i++) {
                if (moveLeftPoints >= -i) {
                    LeftPointsHigher = true;
                } else if(moveRightPoints >= -i) {
                    RightPointsHigher = true;
                } else if (moveDownPoints >= -i) {
                    DownPointsHigher = true;
                } else {
                    if (moveUpPoints >= -i) {
                        UpPointsHigher = true;
                    }
                }
                if (LeftPointsHigher == false && UpPointsHigher == false && RightPointsHigher == false && DownPointsHigher == false) {
                    // if the first loop didn't work then it will restart if it was sucessful then the loop will break;
                } else {
                    break;
                }
            }
        }

        // DON'T EDIT THIS, ONLY REVIEW IT!!!
        // sometimes that above code still ends up having two ties, so I am going to break that
        // and choose the best choice
        // 1st bracket
        if (UpPointsHigher == true && DownPointsHigher == true && moveDownPoints > moveUpPoints) {
            UpPointsHigher = false;
        }
        if (DownPointsHigher == true && LeftPointsHigher == true && moveLeftPoints > moveDownPoints) {
            DownPointsHigher = false;
        }
        if (LeftPointsHigher == true && RightPointsHigher == true && moveRightPoints > moveLeftPoints) {
            LeftPointsHigher = false;
        }

        // 2nd bracket
        if (UpPointsHigher == true && LeftPointsHigher == true && moveLeftPoints > moveUpPoints) {
            UpPointsHigher = false;
        }
        if (UpPointsHigher == true && RightPointsHigher == true && moveRightPoints > moveUpPoints) {
            UpPointsHigher = false;
        }


        // 3rd bracket
        if (DownPointsHigher == true && RightPointsHigher == true && moveRightPoints > moveDownPoints) {
            DownPointsHigher = false;
        }

        // END OF A SECTION START OF A NEW SECTION
 
 
 
 
        if (safeMoves.length == 0) {
            console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
            return { move: "down" };
        }
  
        // Filters move again just to make sure before making a final decision
        safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
 
 
    // Choose a random move from the safe moves if length == 1. DON'T CHANGE THIS!!!!!! ONLY REVIEW IT!!
    if (safeMoves.length == 1) {
        nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }
    // DON'T CHANGE THIS!!!!!! ONLY REVIEW IT!!
    // DON"T CHANGE THE ORDER OF THIS OR ELSE IT WILL MESS UP THE PROCEDURE AND THE AI GUESSES AND PICKING
    if (safeMoves.length > 1) {
        // since the start is always going to be 0, I don't need to change anything here
        if (UpPointsHigher == true && moveSafety.up == true) {
            nextMove = safeMoves[0];
        }
        else if (DownPointsHigher == true && moveSafety.down == true) {
            // safeMoves.length changes so I need to account for that, it isn't always 4
            let minus = 0;
            if (moveSafety.up == false) {
                minus += 1;
            }
            nextMove = safeMoves[1 - minus];
        }
        else if (LeftPointsHigher == true && moveSafety.left == true) {
            // safeMoves.length changes so I need to account for that, it isn't always 4
            let minus = 0;
            if (moveSafety.up == false) {
                minus += 1;
            }
            if (moveSafety.down == false) {
                minus += 1;
            }
            nextMove = safeMoves[2 - minus];
        }
        else if (RightPointsHigher == true && moveSafety.right == true) {
            // safeMoves.length changes so I need to account for that, it isn't always 4
            let minus = 0;
            if (moveSafety.up == false) {
                minus += 1;
            }
            if (moveSafety.down == false) {
                minus += 1;
            }
            if (moveSafety.left == false) {
                minus +=1;
            }
            nextMove = safeMoves[3 - minus];
        } else {
            // if there is nothing to choose from pick a random move
            nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
        }
    }
   
    console.log("");
    console.log("Up: " + moveUpPoints);
    console.log("Down: " + moveDownPoints);
    console.log("Left: " + moveLeftPoints);
    console.log("Right: " + moveRightPoints);
    console.log(" ");
    console.log("Up: " + UpPointsHigher);
    console.log("Down: " + DownPointsHigher);
    console.log("Left: " + LeftPointsHigher);
    console.log("Right: " + RightPointsHigher);
 
 
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}
 
 // npm run start