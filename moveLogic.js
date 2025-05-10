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
    let moveUpPoints = 0;
    let moveDownPoints = 0;
    let moveLeftPoints = 0;
    let moveRightPoints = 0;

    let UpPointsHigher = false;
    let DownPointsHigher = false;
    let LeftPointsHigher = false;
    let RightPointsHigher = false;

    let superDuperReallyHungry = false;
    // I am making nextmove and safemoves a global varaible since I am calling it more than once
    let safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    let nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
   
    // We've included code to prevent your Battlesnake from moving backwards
    let myHead = gameState.you.body[0];
    let myNeck = gameState.you.body[1];
   
    if (gameState.you.health < 20) {
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
            // console.log(i);
            // console.log(gameState.you.body.length);
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
   
    let snakes = gameState.board.snakes;


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

        let collisionPunishment = 4;

        // keeps my snake from colliding with others snake's heads that are 2 units away
        //  I am going to remove points instead of making them false, because I don't know for sure
        // that the snake will move in that direction
        if (myHead.x == snakeBody[0].x -2 && myHead.y == snakeBody[0].y) {
            // moveSafety.right = false;
            moveRightPoints -= collisionPunishment;
        }
        if (myHead.x == snakeBody[0].x +2 && myHead.y == snakeBody[0].y) {
            // moveSafety.left = false;
            moveLeftPoints -= collisionPunishment;
        }
        if (myHead.y == snakeBody[0].y -2 && myHead.x == snakeBody[0].x) {
            // moveSafety.up = false;
            moveUpPoints -= collisionPunishment;
        }
        if (myHead.y == snakeBody[0].y +2 && myHead.x == snakeBody[0].x) {
            // moveSafety.down = false;
            moveDownPoints -= collisionPunishment;
        }
        // keeps my snake from colliding with other snakes by predicting their future moves
        //  I am going to remove points instead of making them false, because I don't know for sure
        // that the snake will move in that direction
        if (myHead.x == snakeBody[0].x -1 && myHead.y == snakeBody[0].y -1) {
            // moveSafety.up = false;
            // moveSafety.right = false;
            moveUpPoints -= collisionPunishment;
            moveRightPoints -= collisionPunishment;
        }
        if (myHead.x == snakeBody[0].x -1 && myHead.y == snakeBody[0].y + 1) {
            // moveSafety.right = false;
            // moveSafety.down = false;
            moveRightPoints -= collisionPunishment;
            moveDownPoints -= collisionPunishment;
        }
        if (myHead.x == snakeBody[0].x +1 && myHead.y == snakeBody[0].y - 1) {
            // moveSafety.up = false;
            // moveSafety.left = false;
            moveUpPoints -= collisionPunishment;
            moveLeftPoints -= collisionPunishment;
        }
        if (myHead.x == snakeBody[0].x +1 && myHead.y == snakeBody[0].y + 1) {
            // moveSafety.left = false;
            // moveSafety.down = false;
            moveLeftPoints -= collisionPunishment;
            moveDownPoints -= collisionPunishment;
        }
        if (myHead.y == snakeBody[0].y -1 && myHead.x == snakeBody[0].x -1) {
            // moveSafety.up = false;
            // moveSafety.right = false;
            moveUpPoints -= collisionPunishment;
            moveRightPoints -= collisionPunishment;
        }
        if (myHead.y == snakeBody[0].y -1 && myHead.x == snakeBody[0].x + 1) {
            // moveSafety.up = false;
            // moveSafety.left = false;
            moveUpPoints -= collisionPunishment;
            moveLeftPoints -= collisionPunishment;
        }
        if (myHead.y == snakeBody[0].y +1 && myHead.x == snakeBody[0].x -1) {
            // moveSafety.down = false;
            // moveSafety.right = false;
            moveDownPoints -= collisionPunishment;
            moveRightPoints -= collisionPunishment;
        }
        if (myHead.y == snakeBody[0].y +1 && myHead.x == snakeBody[0].x + 1) {
            // moveSafety.down = false;
            // moveSafety.left = false;
            moveDownPoints -= collisionPunishment;
            moveLeftPoints -= collisionPunishment;
        }
    })

    // avoid hazards
    let hazards = gameState.board.hazards;
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
            // I took this out, safeMoves.length != 0, because I am able to account for it using points
            // to make better decisions instead of by completely ignoring a decision, also this makes my
            // game worse which is another reason to take it out!
            // if (safeMoves.length != 0) {
                hazards.forEach((h) => {
                    if (myHead.x == h.x -1 && myHead.y == h.y && myHead.x == h.x +1 && myHead.y == h.y && myHead.y == h.y -1 && myHead.x == h.x && myHead.y == h.y +1 && myHead.x == h.x) {
                        // There is no way to break a forEach loop other than to throw in an error
                    } else {
                        // instead of avoiding the hazards at all cost until there are no more safe moves
                        // I am just making it a worser choice, because sometimes going into the hazards is actually
                        // a good think, as avoiding it at all costs until there are no more safe moves is actually kind of 
                        // problematic, and I have tested it as well and it is true.
                        if (myHead.x == h.x -1 && myHead.y == h.y) {
                            // moveSafety.right = false;
                            moveRightPoints -= 3;
                        }
                        if (myHead.x == h.x +1 && myHead.y == h.y) {
                            // moveSafety.left = false;
                            moveLeftPoints -= 3;
                        }
                        if (myHead.y == h.y -1 && myHead.x == h.x) {
                            // moveSafety.up = false;
                            moveUpPoints -= 3;
                        }
                        if (myHead.y == h.y +1 && myHead.x == h.x) {
                            // moveSafety.down = false;
                            moveDownPoints -= 3;
                        }
                    }
                })
            // }
    

    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    // this avoids food when it's health is greater than 50
    if (gameState.you.health > 50) {
        let food = gameState.board.food;
        food.forEach((f) => {
            /* if my safe moves are less than 1 or equal to one then we don't need to try and avoid more stuff
             or else I will lose and accidentally kill myself, it will be too much       */
            if (safeMoves.length > 1) {
                if (myHead.x == f.x -1 && myHead.y == f.y) {
                    // moveSafety.right = false;
                    moveRightPoints -= 1;
                }
                if (myHead.x == f.x +1 && myHead.y == f.y) {
                    // moveSafety.left = false;
                    moveLeftPoints -= 1;
                }
                if (myHead.y == f.y -1 && myHead.x == f.x) {
                    // moveSafety.up = false;
                    moveUpPoints -= 1;
                }
                if (myHead.y == f.y +1 && myHead.x == f.x) {
                    // moveSafety.down = false;
                    moveDownPoints -= 1;
                }
            }
        })
        
        
    }
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
            // console.log(i);
            // console.log(gameState.you.body.length);
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


    snakes.forEach((snake) => {
        const snakeBody = snake.body;


        snakeBody.forEach((b) => {
            if (snake.id == gameState.you.id){
                return;
            }
            // keeps my snake from colliding with other snakes and every part of their body as well
            // DON"T EDIT THIS!!!!!!!!!!!!!!!!!!
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
    })


        }
        // filters safe moves before making a final move
        safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);

        // makes a smart move using safe moves and direction points
        /* EDIT THIS */
        snakes.forEach((snake) => {
            const snakeBody = snake.body;
            
            // I need this i because it calls it too many times since the bounds are in the same
            // position all the time
            let i = 0;
    
            snakeBody.forEach((b) => {
                /* I am changing this only for this specific section ONLY because this will help me stop getting stuck in dead ends in my body
                This kind of works like recursion, but I need to add more if statements here to make it smarter*/
                // if (snake.id == gameState.you.id){
                //     return;
                // }
                /* ADD More IF statements to make smart choices smarter*/


                // increases points for being hungry and having food close to you
                // Don't remove "if (i < 1)" it is extremely IMPORTANT!!
                if (i < 1) {
                    if (gameState.you.health < 50) {
                        let food = gameState.board.food;
                        food.forEach((f) => {
                            /* if my safe moves are less than 1 or equal to one then we don't need to try and avoid more stuff
                             or else I will lose and accidentally kill myself, it will be too much       */
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
                        })
                        
                        
                    }
                }

                // increases points by a lot for being really SUPER DUPER HUNGRY and having food close to you
                if (i < 1) {
                    if (gameState.you.health < 20) {
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

                // takes away points for their safety being false, DO NOT CHANGE THIS!!!!!
                let pointsRemovedForNotBeingSafe = 15;
                // REALLY BAD CHOICES at -6 is THE SWEET SPOT DO NOT CHANGE THIS!!!!
                let reallyBadChoices = -12;
                if (i < 1) {
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
                 
                let deadEndPunishmentPoints = 2;

                // GENERATIVE AI GUESSES

                let AIbadMovePunishment = 2;

                if (moveSafety.up == true ) {
                    if (myHead.y == b.y -2 && myHead.x == b.x) {
                        moveUpPoints -= AIbadMovePunishment;
                    }
                    // this helps me to get out of longer loops of my body
                    if (myHead.y == b.y -3 && myHead.x == b.x) {
                        moveUpPoints -=AIbadMovePunishment;
                    }
                    if (myHead.y == b.y -2 && myHead.x == b.x + 1) {
                        moveUpPoints -=AIbadMovePunishment;
                    }
                    if (myHead.y == b.y -2 && myHead.x == b.x - 1) {
                        moveUpPoints -=AIbadMovePunishment;
                    }
                    if (i < 1) {
                        // I need this i because it calls it too many times since the bounds are in the same
                        // position all the time
                        // protects me from going into dead ends in the corners
                        if (myHead.y +2 > gameBoardProperties.height -1) {
                            moveUpPoints -= deadEndPunishmentPoints;
                        }
                    }
                    
                }
                if (moveSafety.down == true ) {
                    if (myHead.y == b.y +2 && myHead.x == b.x) {
                        moveDownPoints -= AIbadMovePunishment;
                    }
                    // this helps me to get out of longer loops of my body
                    if (myHead.y == b.y +3 && myHead.x == b.x) {
                        moveDownPoints -= AIbadMovePunishment;
                    }
                    if (myHead.y == b.y +2 && myHead.x == b.x + 1) {
                        moveDownPoints -= AIbadMovePunishment;
                    }
                    if (myHead.y == b.y +2 && myHead.x == b.x - 1) {
                        moveDownPoints -= AIbadMovePunishment;
                    }
                    if (i < 1) {
                        // I need this i because it calls it too many times since the bounds are in the same
                        // position all the time
                        // protects me from going into dead ends in the corners
                        if (myHead.y - 2 < 0) {
                            moveDownPoints -=deadEndPunishmentPoints;
                        }
                    }
                    
                }
                if (moveSafety.left == true ) {
                    if (myHead.x == b.x +2 && myHead.y == b.y) {
                        moveLeftPoints -= AIbadMovePunishment;
                    }
                    // this helps me to get out of longer loops of my body
                    if (myHead.x == b.x +3 && myHead.y == b.y) {
                        moveLeftPoints -= AIbadMovePunishment;
                    }
                    if (myHead.x == b.x +2 && myHead.y == b.y + 1) {
                        moveLeftPoints -= AIbadMovePunishment;
                    }
                    if (myHead.x == b.x +2 && myHead.y == b.y - 1) {
                        moveLeftPoints -= AIbadMovePunishment;
                    }
                    if (i < 1) {
                        // I need this i because it calls it too many times since the bounds are in the same
                        // position all the time
                        // protects me from going into dead ends in the corners
                        if (myHead.x -2 < 0) {
                            moveLeftPoints -= deadEndPunishmentPoints;
                        }
                    }
                    
                }
                if (moveSafety.right == true ) {
                    if (myHead.x == b.x -2 && myHead.y == b.y) {
                        moveRightPoints -= AIbadMovePunishment;
                    }
                    // this helps me to get out of longer loops of my body
                    if (myHead.x == b.x -3 && myHead.y == b.y) {
                        moveRightPoints -= AIbadMovePunishment;
                    }
                    if (myHead.x == b.x -2 && myHead.y == b.y + 1) {
                        moveRightPoints -= AIbadMovePunishment;
                    }
                    if (myHead.x == b.x -2 && myHead.y == b.y - 1) {
                        moveRightPoints -= AIbadMovePunishment;
                    }
                    if (i < 1) {
                        // I need this i because it calls it too many times since the bounds are in the same
                        // position all the time
                        // protects me from going into dead ends in the corners
                        if (myHead.x +2 > gameBoardProperties.width -1) {
                            moveRightPoints -= deadEndPunishmentPoints;
                        }
                    }
        
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
                i += 1;
            })
        })


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
    // Don't change the order of this or else it will mess us the procedures and the AI guesses and picking
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


