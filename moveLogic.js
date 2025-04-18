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
    
    // We've included code to prevent your Battlesnake from moving backwards
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    
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

    // this for loop makes sure that the snake doesn't collide with any of the segments of my body
    for (let i = 2; i < gameState.you.body.length -1 ; i++) {
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
    
     // avoiding get stuck in the loop of my body with a vertical loop
     for (let i =0; i <  gameState.you.body.length -5; i ++) {
        if (myHead.x == gameState.you.body [i +2].x + 1  && myHead.x == gameState.you.body [i +4].x -1 || myHead.x == gameState.you.body[i +2].x -1 && myHead.x == gameState.you.body[i +4].x + 1) {
            if (gameState.you.body[i +2].x && gameState.you.body[i +3].x && gameState.you.body[i +5].x && gameState.you.body[i +6].x) {
            if (gameState.you.body[i +4].y > myHead.y) {
                moveSafety.up = false;
                break;
            } else {
                moveSafety.down = false; 
                break;
            }
            }

        }
     }
     // avoiding get stuck in the loop of my body with a horizontal loop
     for (let i =0; i <  gameState.you.body.length -5; i ++) {
        if (myHead.y= gameState.you.body [i +2].y + 1  && myHead.y == gameState.you.body [i +4].y -1 || myHead.y == gameState.you.body[i +2].y -1 && myHead.y == gameState.you.body[i +4].y + 1) {
            if (gameState.you.body[2].y && gameState.you.body[3].y && gameState.you.body[5].y && gameState.you.body[6].y) {
                if (gameState.you.body[4].x > myHead.x) {
                    moveSafety.right = false;
                    break;
                } else {
                    moveSafety.left = false;
                    break;
                }
            }
        
        }

     }

    // Prevent your battle snakes from get into dead end ends in the corner
    // bottom right corner
    if (gameState.you.body.length > 4) {
        if (gameState.you.body[2].x == gameBoardProperties.width -2 && gameState.you.body[3] == gameBoardProperties.width -2  && gameState.you.body[3].y < gameBoardProperties.height/2) {
           if (myHead.x > gameBoardProperties.width -2 && myHead.y > myNeck.y) {
               moveSafety.down = false;
           } else {
            moveSafety.up = false;
           }
        }
    }
     // top right corner
     if (gameState.you.body.length > 4) {
         if (gameState.you.body[2].x == gameBoardProperties.width -2 && gameState.you.body[3] == gameBoardProperties.width -2  && gameState.you.body[3].y > gameBoardProperties.height/2) {
            if (myHead.x > gameBoardProperties.width -2 && myHead.y > myNeck.y) {
                moveSafety.down = false;
                
            } else {
                moveSafety.up = false;
            }
         }
     }
    // top left corner
    if (gameState.you.body.length > 4) {
        if (gameState.you.body[2].x == 1 && gameState.you.body[3] == 1  && gameState.you.body[3].y > gameBoardProperties.height/2) {
            if (myHead.x < 2 && myHead.y > myNeck.y) {
                moveSafety.down = false;
                
            } else {
                moveSafety.up = false;
            }
        } 
    }
    // bottom left corner
    if (gameState.you.body.length > 4) {
        if (gameState.you.body[2].x == 1 && gameState.you.body[3] == 1  && gameState.you.body[3].y < gameBoardProperties.height/2) {
            if (myHead.x < 2 && myHead.y > myNeck.y) {
                moveSafety.down = false;
                
            } else {
                moveSafety.up = false;
            }
        }
    }


    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    
    const snakes = gameState.board.snakes;

    snakes.forEach((snake) => {
        const snakeBody = snake.body;

        snakeBody.forEach((b) => {
            // prevents my snake from colliding with other snakes
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
            // // avoid snakes that want to eat the same food
            // if (myHead.y == b.y +1 && myHead.x == b.x + 1) {
            //     moveSafety.left = false;
            // }
            // if (myHead.y == b.y +1 && myHead.x == b.x -1 && myNeck.x < myHead.x) {
            //     moveSafety.right = false;
            //     moveSafety.down = false;
            // }
            // if (myHead.y == b.y +1 && myHead.x == b.x -1) {
            //     moveSafety.right = false;
            // }
            // if (myHead.y == b.y -1 && myHead.x == b.x -1) {
            //     moveSafety.right = false;
            // }
            // if (myHead.y == b.y -1 && myHead.x == b.x + 1) {
            //     if (myHead.y == 0) {

            //     } else {
            //         moveSafety.left = false;
            //     }
            // }
            // if (myHead.y == b.y -2 && myHead.x == b.x) {
            //     moveSafety.up = false;
            // }
            // if (myHead.y == b.y + 2 && myHead.x == b.x) {
            //     moveSafety.down = false;
            // }
            // if (myHead.y == b.y && myHead.x == b.x + 2) {
            //     moveSafety.left = false;
            // }
            // if (myHead.y == b.y && myHead.x == b.x - 2) {
            //     moveSafety.right = false;
            // }
            

        })
    })

    // Are there any safe moves left?
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
        return { move: "down" };
    }
    
    // Choose a random move from the safe moves
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    
    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    
    let food = gameState.board.food;
    if (gameState.you.health < 60) {
        food.forEach((f) => {
            if (myHead.x == f.x -1 && myHead.y == f.y) {
                moveSafety.left = false;
            }
            if (myHead.x == f.x +1 && myHead.y == f.y) {
                moveSafety.right = false;
            }
            if (myHead.y == f.y -1 && myHead.x == f.x) {
                moveSafety.down = false;
            }
            if (myHead.y == f.y +1 && myHead.x == f.x) {
                moveSafety.up = false;
            }
        })
        
    }
    // avoid hazards
        let hazards = gameState.board.hazards;
            hazards.forEach((h) => {
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
            })
    
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}


// npm run start