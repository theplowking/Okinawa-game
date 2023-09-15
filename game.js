let playbackSpeed = 1;
let state = {
    seenMainRoom: false,
    seenDoor: false,
    seenDesk: false,
    seenBody: false,
    seenShelves: false,
    seenTable: false,
    foundHammer: false,
    foundKey: false,
    foundHand: false,
    openJar: false,
    insertKey: false,
    insertHand: false
};
let debugMode = true;



function playAudio() {
    const audioElement = document.getElementById('audioElement');
    audioElement.play();
    //delay(100).then(() => unMute());

}

function unMute(){
    const audioElement = document.getElementById('audioElement');
    audioElement.muted = false;
}

function stopAudio() {
    const audioElement = document.getElementById('audioElement');
    audioElement.pause();
    audioElement.currentTime = 0;
}

// // Play the audio when the page loads
// window.addEventListener('load', playAudio);

function ready() {
    var ready = document.getElementById('ready');
    var start = document.getElementById('phone');
    ready.style.display = 'none';
    start.style.display = 'flex';
    playAudio();
}

function intro() {
    stopAudio();
    

    var start = document.getElementById('phone');
    var room = document.getElementById('room');
    room.style.display = 'block';
    start.style.display = 'none';

    var video = document.getElementById('video');
    video.style.display = 'block';
    video.src = "./vid/intro.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    debug();
    delay(100).then(() => toggleMute());
    
    var buttonsData = {
        'Are you OK?': function() {
            // Function to execute when Button 2 is clicked
            mainRoom();
        }
    };

    createButtons(buttonsData);

    // Add an event listener to the video element to detect when it ends
    video.addEventListener('ended', function () {
        var buttons = room.getElementsByTagName('button');
        var code = document.getElementById('code');

        // Remove each button
        for (var i=0; i<buttons.length;i++){
            buttons[i].style.display='inline';
        }
        
        if(video.src.includes("door")) { code.style.display = 'inline';}

    });

}

//// ROOM
function mainRoom() {
    
    var video = document.getElementById('video');
    video.src = !state.seenMainRoom ? "./vid/room_intro.mp4" : "./vid/room_description.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    state.seenMainRoom = true;
    debug();

    var cornerTitle = state.seenBody ? 'Go to Body' : 'Go to Corner';

    var buttonsData = {
        'Go to Door': function() {
            Door();
        },
        'Go to Desk': function() {
            //document.getElementById('video').src = "./vid/room_description.mp4";
            Desk();
        },
        [cornerTitle]: function() {
            Body();
        },
        'Go to Shelves': function() {
            Shelves();
        },
        'Go to Table': function() {
            Table();
        },
        '↻': function() {
            mainRoom();
            //restartVideo();
        },
    };

    createButtons(buttonsData);

}

/// DOOR
function Door() {
    var video = document.getElementById('video');
    var code = document.getElementById('code');
    video.src = !state.seenDoor ? "./vid/door_intro.mp4" : "./vid/door_description.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    state.seenDoor = true;
    debug();

    var handData = {
        'Place hand': function() {
            state.insertHand = true;
            document.getElementById('video').src = "./vid/hand_unlock.mp4";
        }
    };

    var keyData = {
        'Insert key': function() {
            state.insertKey = true;
            document.getElementById('video').src = "./vid/key_unlock.mp4";
        }
    };
    
    var buttonsData = {
        'Try the handle': function() {
            
            if( state.insertHand && state.insertKey && code.value == '1270' ) {
                ending();
            }
            else if( code.value == '1270' ){
                document.getElementById('video').src = "./vid/code_unlock.mp4";
            }
            else{
                document.getElementById('video').src = "./vid/wrong_code.mp4";
            }
            
        },
        'Back to Room': function() {
            mainRoom();
        },
        '↻': function() {
            Door();
        },
    };

    createButtons({...(state.foundHand ? handData : null), ...(state.foundKey ? keyData : null), ...buttonsData}, true);



}

//// DESK
function Desk() {
    var video = document.getElementById('video');
    video.src = !state.foundKey ? "./vid/desk_intro.mp4" : "./vid/got_key.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    state.seenDesk = true;
    debug();
    
    var buttonsData = {
        'Back to Room': function() {
            // Function to execute when Button 2 is clicked
            mainRoom();
        },
        '↻': function() {
            Desk();
            //restartVideo();
        },
    };

    var takeDocs = function() {
        // Function to execute when Button 1 is clicked
        state.foundKey = true;
        Desk();
    };

    if(state.foundKey){
        createButtons(buttonsData);
    }
    else{
        createButtons({'Take the key and documents': takeDocs , ...buttonsData});
    }

}

//// SHELVES
function Shelves() {
    var video = document.getElementById('video');
    video.src = !state.foundHand ? "./vid/shelves_intro.mp4" : "./vid/smash_jar.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    state.seenShelves = true;
    debug();
    
    var shelvesData = !state.foundHammer ? {
        'Open jar and take hand': function() {
            document.getElementById('video').src = "./vid/pick_up_jar.mp4";
        }
    } : {
        'Smash jar with hammer': function() {
            state.foundHand = true;
            Shelves();
        }
    };

    var buttonsData = {
        'Back to Room': function() {
            // Function to execute when Button 2 is clicked
            mainRoom();
        },
        '↻': function() {
            Shelves();
            //restartVideo();
        },
    };

    if(state.foundHand){
        createButtons(buttonsData);
    }
    else{
        createButtons({...shelvesData, ...buttonsData});
    }
    

}

//// OPERATING TABLE
function Table() {
    var video = document.getElementById('video');
    video.src = !state.foundHammer ? "./vid/table_intro.mp4" : "./vid/pick_hammer_gloves.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    state.seenDesk = true;
    debug();

    var hammerData = {
        'Pick up hammer and gloves': function() {
            state.foundHammer = true;
            Table();
        }
    };
    
    var buttonsData = {
        'Back to Room': function() {
            // Function to execute when Button 2 is clicked
            mainRoom();
        },
        '↻': function() {
            Table();
            //restartVideo();
        },
    };

    if(state.foundHammer){
        createButtons(buttonsData);
    }
    else{
        createButtons({...hammerData, ...buttonsData});
    }

}

function Body() {
    var video = document.getElementById('video');
    video.src = "./vid/corner_body_intro.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();
    state.seenBody = true;
    debug();
    
    var buttonsData = {
        'Search pocket': function() {
            document.getElementById('video').src = "./vid/corner_body_search.mp4";
        },
        'Back to Room': function() {
            // Function to execute when Button 2 is clicked
            mainRoom();
        },
        '↻': function() {
            Body();
            //restartVideo();
        },
    };

    createButtons(buttonsData);

}

//// ENDING
function ending() {
    var video = document.getElementById('video');
    video.src = "./vid/ending.mp4";
    video.playbackRate = playbackSpeed;
    deleteAllButtons();

    var buttonsData = {
        'Well done - you escaped! Head back to Slack and type in XYZ.': function() {
            alert('You finished, head back to Slack now.');
        },
    };

    createButtons(buttonsData);

}


/* Delay Function to Add SetTimeOut After Defined Interval */

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function debug() {
    if(!debugMode) return;
    console.log(video.src, state);
}

// JavaScript function to delete all buttons in the div
function deleteAllButtons() {
    var divElement = document.getElementById('room'); // Get the div element by its id
    var buttons = divElement.getElementsByTagName('button'); // Get all buttons inside the div
    //show input
    var code = document.getElementById('code');
    code.style.display = 'none';

    // Remove each button
    while (buttons.length > 0) {
        divElement.removeChild(buttons[0]);
    }
}

// Function to create buttons based on an object of labels and functions
function createButtons(buttonData) {
    var videoElement = document.getElementById('video'); // Get the video element by its id
    var buttonContainer = document.getElementById('room'); // Get the div container where buttons will be added
    //show input
    
    var code = document.getElementById('code');
    code.style.display = 'none';
    
    for (var label in buttonData) {
        if (buttonData.hasOwnProperty(label)) {
            var button = document.createElement('button'); // Create a new button element
            button.textContent = label; // Set the button label

            // Add a click event listener that executes the corresponding function
            button.addEventListener('click', buttonData[label]);
            button.style.display = 'none';

            buttonContainer.appendChild(button); // Add the button to the container
        }
    }

    
}

// Function to restart video playback
function restartVideo() {
    var videoElement = document.getElementById('video'); // Get the video element by its id
    videoElement.currentTime = 0; // Set the current time to 0 to restart the video
    videoElement.play(); // Start playing the video from the beginning
}

/* Toggle Button to Unmute the Video */

function toggleMute() {
    
    if (window.video.muted) {
        window.video.muted = false;
    } else {
        window.video.muted = true;
    }
}