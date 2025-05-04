export default function move(gameState){
    let gameBoardProperties = {
        "height" : gameState.board.height,
        "width" : gameState.board.width
    }
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    let failedDecisions = 0;
   
    // We've included code to prevent your Battlesnake from moving backwards
    let myHead = gameState.you.body[0];
    let myNeck = gameState.you.body[1];
   
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

        // keeps my snake from colliding with others snake's heads that are 2 units away
        if (myHead.x == snakeBody[0].x -2 && myHead.y == snakeBody[0].y) {
            moveSafety.right = false;
        }
        if (myHead.x == snakeBody[0].x +2 && myHead.y == snakeBody[0].y) {
            moveSafety.left = false;
        }
        if (myHead.y == snakeBody[0].y -2 && myHead.x == snakeBody[0].x) {
            moveSafety.up = false;
        }
        if (myHead.y == snakeBody[0].y +2 && myHead.x == snakeBody[0].x) {
            moveSafety.down = false;
        }
        // keeps my snake from colliding with other snakes by predicting their future moves
        if (myHead.x == snakeBody[0].x -1 && myHead.y == snakeBody[0].y -1) {
            moveSafety.right = false;
        }
        if (myHead.x == snakeBody[0].x -1 && myHead.y == snakeBody[0].y + 1) {
            moveSafety.right = false;
        }
        if (myHead.x == snakeBody[0].x +1 && myHead.y == snakeBody[0].y - 1) {
            moveSafety.left = false;
        }
        if (myHead.x == snakeBody[0].x +1 && myHead.y == snakeBody[0].y + 1) {
            moveSafety.left = false;
        }
        if (myHead.y == snakeBody[0].y -1 && myHead.x == snakeBody[0].x -1) {
            moveSafety.up = false;
        }
        if (myHead.y == snakeBody[0].y -1 && myHead.x == snakeBody[0].x + 1) {
            moveSafety.up = false;
        }
        if (myHead.y == snakeBody[0].y +1 && myHead.x == snakeBody[0].x -1) {
            moveSafety.down = false;
        }
        if (myHead.y == snakeBody[0].y +1 && myHead.x == snakeBody[0].x + 1) {
            moveSafety.down = false;
        }
    })

    // avoid hazards
    let hazards = gameState.board.hazards;
    let safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    
        if (safeMoves.length != 0) {
            hazards.forEach((h) => {
                if (myHead.x == h.x -1 && myHead.y == h.y && myHead.x == h.x +1 && myHead.y == h.y && myHead.y == h.y -1 && myHead.x == h.x && myHead.y == h.y +1 && myHead.x == h.x) {
                    // There is no way to break a forEach loop other than to throw in an error
                } else {
                    if (myHead.x == h.x -1 && myHead.y == h.y) {
                        moveSafety.right = false;
                    }
                    if (myHead.x == h.x +1 && myHead.y == h.y) {
                        moveSafety.left = false;
                    }
                    if (myHead.y == h.y -1 && myHead.x == h.x) {
                        moveSafety.up = false;
                    }
                    if (myHead.y == h.y +1 && myHead.x == h.x) {
                        moveSafety.down = false;
                    }
                }
            })
        }
    

    
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
                    moveSafety.right = false;
                }
                if (myHead.x == f.x +1 && myHead.y == f.y) {
                    moveSafety.left = false;
                }
                if (myHead.y == f.y -1 && myHead.x == f.x) {
                    moveSafety.up = false;
                }
                if (myHead.y == f.y +1 && myHead.x == f.x) {
                    moveSafety.down = false;
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
        safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
        if (safeMoves.length == 0) {
            console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
            return { move: "down" };
        }
   
    // Choose a random move from the safe moves
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}


// npm run start


