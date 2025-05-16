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

    let IamTheLongest = false;
    let killReward = 4;

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
 
 
    let eatAggressivelyUntilIamThisLong = 7;
 
 
    // checks to see if I am the longest are not to know whether I should eat food agressively or not
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
   
    if (IamTheLongest == true) {
        if (gameState.you.length < 13) {
            hungry = 80;
        } else {
            hungry = 60;
        }
    } else {
        if (gameState.you.length < 13) {
            hungry = 101;
        } else {
            if (gameState.you.length < 15) {
                hungry = 80;
            } else{
                hungry = 60;
            }
        }
    }
 
 
    /* I am doing this because of all those snakes that keep trying to kill me, I although I will only eat food
    agressively until my length is higher than 7 because once your body gets longer that helps shield you
    from getting killed. Why thank you Coreyja, waryferryman, and wrenger, I'll beat you guys this time!! */
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
  
    // checks to see if I am the longest so I can no whether I have to avoid other snakes or not and it works now!!
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
 
 
 
 
    snakes.forEach((snake) => {
        const snakeBody = snake.body;
 
 
 
 
        snakeBody.forEach((b) => {
            if (snake.id == gameState.you.id){
                return;
            }
            // keeps my snake from colliding with other snakes and every part of their body as well
            if (myHead.x == b.x -1 && myHead.y == b.y) {
                moveSafety.right = false;
            }
            if (myHead.x == b.x +1 && myHead.y == b.y) {
                moveSafety.left = false;
            }
            if (myHead.y == b.y -1 && myHead.x == b.x) {
                moveSafety.up = false;
            }
            if (myHead.y == b.y +1 && myHead.x == b.x) {
                moveSafety.down = false;
            }
        })
 
        
        let collisionPunishment = 5;
 
 
        // only avoids other snakes heads if I am not the longest

        
        if (IamTheLongest == false) {
            // keeps my snake from colliding with others snake's heads that are 2 units away
            //  I am going to remove points instead of making moves false, because I don't know for sure
            // that the snake will move in that direction
            for (let i = 0; i < snakes.length; i ++) {
                if (snakes[i].id == gameState.you.id) {
                   
                } else {
                    if (myHead.x == snakes[i].body[0].x -2 && myHead.y == snakes[i].body[0].y) {
                        moveRightPoints -= collisionPunishment;
                    }
                    if (myHead.x == snakes[i].body[0].x +2 && myHead.y == snakes[i].body[0].y) {
                        moveLeftPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y -2 && myHead.x == snakes[i].body[0].x) {
                        moveUpPoints -= collisionPunishment;
                    }
                    if (myHead.y == snakes[i].body[0].y +2 && myHead.x == snakes[i].body[0].x) {
                        moveDownPoints -= collisionPunishment;
                    }
                    // keeps my snake from colliding with other snakes by predicting their future moves
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
 
 
        // helps me kill other snakes if I am the longest
        for (let i = 0; i < snakes.length; i ++) {
            if (snakes[i].id == gameState.you.id) {
               
            } else {
                if (IamTheLongest == true) {
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
                
            }
        }
    })
 
 
    // avoid hazards
    let hazards = gameState.board.hazards;
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
                hazards.forEach((h) => {
                    // hazards that are 1 unit away && cuts off people on the edges of the board as long as I am not in a hazard
                    // or else I might die trying to do it.
                    for (let i = 0; i < snakes.length; i ++) {
                        let cutOffSnakeReward = (cuttingOffSnakeReward + 1);
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
                                    moveUpPoints += (cutOffSnakeReward);
                                }
                                // reverse direction
                                if (myHead.x == gameBoardProperties.width - 2 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                    moveRightPoints += cutOffSnakeReward;
                                    moveDownPoints += (cutOffSnakeReward);
                                }
                           
                                // cuts of a snake at the left side of the board game
                                if (myHead.x == 1 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                    moveLeftPoints += cutOffSnakeReward;
                                    moveUpPoints += (cutOffSnakeReward);
                                }
                                // reverse direction
                                if (myHead.x == 1 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                    moveLeftPoints += cutOffSnakeReward;
                                    moveDownPoints += (cutOffSnakeReward);
                                }
                            
                                // cuts of a snake at the top side of the board game
                                if (myHead.y == gameBoardProperties.height -2  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                    moveUpPoints += cutOffSnakeReward;
                                    moveRightPoints += (cutOffSnakeReward);
                                }
                                // reverse direction
                                if (myHead.y == gameBoardProperties.height -2  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                    moveUpPoints += cutOffSnakeReward;
                                    moveLeftPoints += (cutOffSnakeReward);
                                }
                            
                                // cuts of a snake at the bottom side of the board game
                                if (myHead.y == 1  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                    moveDownPoints += cutOffSnakeReward;
                                    moveRightPoints += (cutOffSnakeReward);
                                }
                                // reverse direction
                                if (myHead.y == 1  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                    moveDownPoints += cutOffSnakeReward;
                                    moveLeftPoints += (cutOffSnakeReward);
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
    
                        let cutOffSnakeReward = (cuttingOffSnakeReward + 1);
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
                                moveUpPoints += (cutOffSnakeReward);
                            }
                            // reverse direction
                            if (myHead.x == gameBoardProperties.width - 2 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == gameBoardProperties.width - 1) {
                                moveRightPoints += cutOffSnakeReward;
                                moveDownPoints += (cutOffSnakeReward);
                            }
                       
                            // cuts of a snake at the left side of the board game
                            if (myHead.x == 1 && myHead.y - 1 > snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                moveLeftPoints += cutOffSnakeReward;
                                moveUpPoints += (cutOffSnakeReward);
                            }
                            // reverse direction
                            if (myHead.x == 1 && myHead.y + 1 < snakes[i].body[0].y && snakes[i].body[0].x == 0) {
                                moveLeftPoints += cutOffSnakeReward;
                                moveDownPoints += (cutOffSnakeReward);
                            }
                        
                            // cuts of a snake at the top side of the board game
                            if (myHead.y == gameBoardProperties.height -2  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                moveUpPoints += cutOffSnakeReward;
                                moveRightPoints += (cutOffSnakeReward);
                            }
                            // reverse direction
                            if (myHead.y == gameBoardProperties.height -2  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == gameBoardProperties.height - 1) {
                                moveUpPoints += cutOffSnakeReward;
                                moveLeftPoints += (cutOffSnakeReward);
                            }
                        
                            // cuts of a snake at the bottom side of the board game
                            if (myHead.y == 1  && myHead.x - 1 > snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                moveDownPoints += cutOffSnakeReward;
                                moveRightPoints += (cutOffSnakeReward);
                            }
                            // reverse direction
                            if (myHead.y == 1  && myHead.x + 1 < snakes[i].body[0].x && snakes[i].body[0].y == 0) {
                                moveDownPoints += cutOffSnakeReward;
                                moveLeftPoints += (cutOffSnakeReward);
                            }

                        }
                    }

                }
   
 
 
    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    // this avoids food when it's health is greater than 60
    if (gameState.you.health > hungry) {
        let food = gameState.board.food;
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

    // Helps my snake follow my tail, instead of getting into dead ends and losing to other big snakes
    if ( gameState.you.body.length > 4) {
        let myTail = gameState.you.body.length;
        let followTailReward = 2;
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
 
 
 
 
    // this for loop makes sure that the snake doesn't collide with any of the segments of it's body
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

        for (let i = 0; i < snakes.length; i ++) {

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

                   let AIbadMovePunishment = (theSamePunishment + 1);


                   if (moveSafety.up == true ) {
                       if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x) {
                           moveUpPoints -= AIbadMovePunishment;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.y == snakes[i].body[a].y -3 && myHead.x == snakes[i].body[a].x) {
                           moveUpPoints -=AIbadMovePunishment;
                       }
                   
                   }
                   if (moveSafety.down == true ) {
                       if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x) {
                           moveDownPoints -= AIbadMovePunishment;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.y == snakes[i].body[a].y +3 && myHead.x == snakes[i].body[a].x) {
                           moveDownPoints -= AIbadMovePunishment;
                       }
                   
                   }
                   if (moveSafety.left == true ) {
                       if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y) {
                           moveLeftPoints -= AIbadMovePunishment;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.x == snakes[i].body[a].x +3 && myHead.y == snakes[i].body[a].y) {
                           moveLeftPoints -= AIbadMovePunishment;
                       }
                   
                   }
                   if (moveSafety.right == true ) {
                       if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y) {
                           moveRightPoints -= AIbadMovePunishment;
                       }
                       // this helps me to get out of longer loops of my body
                       if (myHead.x == snakes[i].body[a].x -3 && myHead.y == snakes[i].body[a].y) {
                           moveRightPoints -= AIbadMovePunishment;
                       }
                   }
               }
            } else {
                // This is comparing my snake against other snakes, it does not include my snake in it's calculations
                // I have 2 of these for a reason, because I want to use both codes when I am the longest and when I am not
                // although I am actually only use a small chunk for this part, because it kind of protects me from 
                // colliding with other snakes although this a temporary solution
                if (IamTheLongest == true) {
                    let AIbadMovePunishment = (theSamePunishment - 1);
                    for (let a = 0; a < snakes[i].body.length; a++) {
                        if (moveSafety.up == true ) {
                            if (myHead.y == snakes[i].body[a].y -2 && myHead.x == snakes[i].body[a].x) {
                                moveUpPoints -= AIbadMovePunishment;
                            }
                        
                        }
                        if (moveSafety.down == true ) {
                            if (myHead.y == snakes[i].body[a].y +2 && myHead.x == snakes[i].body[a].x) {
                                moveDownPoints -= AIbadMovePunishment;
                            }
                        
                        }
                        if (moveSafety.left == true ) {
                            if (myHead.x == snakes[i].body[a].x +2 && myHead.y == snakes[i].body[a].y) {
                                moveLeftPoints -= AIbadMovePunishment;
                            }
                        
                        }
                        if (moveSafety.right == true ) {
                            if (myHead.x == snakes[i].body[a].x -2 && myHead.y == snakes[i].body[a].y) {
                                moveRightPoints -= AIbadMovePunishment;
                            }
                        }
    
                    }
                }


                for (let a = 0; a < snakes[i].body.length; a++) {
 
 
                    // GENERATIVE AI GUESSES
                    if (IamTheLongest == false) {
                        let AIbadMovePunishment = (theSamePunishment - 1);
     
     
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

        // END OF A SECTION START OF A NEW SECTION

        snakes.forEach((snake) => {
            const snakeBody = snake.body;
           
            // I need this i because it calls it too many times since the bounds are in the same
            // position all the time
            let i = 0;
   
            snakeBody.forEach((b) => {
 
                /* ADD More IF statements to make smart choices smarter*/
               
                // increases points for being hungry and having food close to you
                // Don't remove "if (i < 1)" it is extremely IMPORTANT!!
                if (i < 1) {
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
                                // Now my snake can eat food anywehre on the board
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
                                    if (myHead.y == f.y -i && myHead.x == f.x) {
                                        moveUpPoints += 1;
                                        doNotOverShootEating += 1;
                                    }
                                    if (myHead.y == f.y +i && myHead.x == f.x) {
                                        moveDownPoints += 1;
                                        doNotOverShootEating += 1;
                                    }

                                }
                        })
                       
                       
                    }
                }
 
 
                // increases points by a lot for being really SUPER DUPER HUNGRY and having food close to you
                if (i < 1) {
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
                        })
                       
                       
                    }
                }
 
                i += 1;
            })
        })
        
        // takes away points for their safety being false, DO NOT CHANGE THIS!!!!!
        let pointsRemovedForNotBeingSafe = 20;
        // REALLY BAD CHOICES at -6 is THE SWEET SPOT DO NOT CHANGE THIS!!!!
        let reallyBadChoices = -15;
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

            let deadEndPunishmentPoints = theSamePunishment;
    
           // INSERTED BACK STUFF
                // #1
                // I need this i because it calls it too many times since the bounds are in the same
                // position all the time
                // protects me from going into dead ends in the corners
                if (myHead.y +2 > gameBoardProperties.height -1) {
                    moveUpPoints -= deadEndPunishmentPoints;
                }
                // #2
                // I need this i because it calls it too many times since the bounds are in the same
                // position all the time
                // protects me from going into dead ends in the corners
                if (myHead.y - 2 < 0) {
                    moveDownPoints -=deadEndPunishmentPoints;
                }
                // #3
                // I need this i because it calls it too many times since the bounds are in the same
                // position all the time
                // protects me from going into dead ends in the corners
                if (myHead.x -2 < 0) {
                    moveLeftPoints -= deadEndPunishmentPoints;
                }
                // #4
                // I need this i because it calls it too many times since the bounds are in the same
                // position all the time
                // protects me from going into dead ends in the corners
                if (myHead.x +2 > gameBoardProperties.width -1) {
                    moveRightPoints -= deadEndPunishmentPoints;
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