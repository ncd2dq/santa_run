const BWIDTH = 1920, BHEIGHT = 1080;
const MASTER_SCALING = 0.5
const WIDTH = BWIDTH * MASTER_SCALING, HEIGHT = BHEIGHT * MASTER_SCALING;
const MASTER_SPEED = 5;

// Background layer images sorted, closest to screen first
let b_layers = [];
// Array of arrays containing all repeats of a given layer
// List[List[all_layer1], List[all_layer2], List[all_layer3], ...]
let background_object_arrays = [];
let b1, b2, b3, b4, b5, b6, b7

let santa;

let background_music, snow_steps_music;
let first_time_music = false;

function background_loading(img){
    
}

function preload(){
    // The issue is having all images in preload on mobile. They load asynchornously
    
    
    
    // Load Background Images
    b7 = loadImage('./assets/backgrounds/l7-ground.png');
    b6 = loadImage('./assets/backgrounds/l6-mountains02.png');
    b5 = loadImage('./assets/backgrounds/l5-clouds02.png');
    b4 = loadImage('./assets/backgrounds/l4-fog.png'); // For some reason this doesn't line up with the others
    b3 = loadImage('./assets/backgrounds/l3-mountains01.png');
    b2 = loadImage('./assets/backgrounds/l2-clouds01.png');
    b1 = loadImage('./assets/backgrounds/l1-backgrounds.png');
    
    background_music = loadSound('./assets/chuck_berry_run.mp3');
    snow_steps_music = loadSound('./assets/snow_running.mp3');
    
    // Load Santa Images master_speed, speed_discount, scaling
    // Mobile problem is here
    santa = new Santa(MASTER_SPEED, 1, (MASTER_SCALING * 0.4));
}


function setup(){
    // Load images in order
    b_layers.push(b7);
    b_layers.push(b6);
    b_layers.push(b5);
    b_layers.push(b4);
    b_layers.push(b3);
    b_layers.push(b2);
    b_layers.push(b1);
    
    // Maybe also do this for santa?
    
    // Initialize screen
    let canv = createCanvas(WIDTH, HEIGHT);
    canv.parent('the_canvas');

    // Determine how how many backgrounds are need to fill screen
    const required_background_repeats = determineBackgroundCount(WIDTH, BWIDTH * MASTER_SCALING);
    
    // Create group lists of individual layers so that all layer 1s get drawn first,
    // then all layer 2s, then all layer 3s, etc.
    for(let i = 0; i < b_layers.length; i++){
        let single_layer_array = [];
        for(let repeat = 0; repeat < required_background_repeats; repeat++){
            if(i == b_layers.length - 1){
                // Static Back Ground
                single_layer_array.push(new BackGround(
                                                        b_layers[i], MASTER_SPEED, 
                                                        (1/(1+i)), MASTER_SCALING, 
                                                        repeat * (BWIDTH * MASTER_SCALING),
                                                        false, true
                                                        )
                                       )
            } else if (i == 0){
                // Ground Floor   
                single_layer_array.push(new BackGround(
                                                        b_layers[i], MASTER_SPEED, 
                                                        (1/(1+i)), MASTER_SCALING, 
                                                        repeat * (BWIDTH * MASTER_SCALING),
                                                        true, false
                                                        )
                                       )
            
            } else {
                // Standard Layers
                single_layer_array.push(new BackGround(
                                                        b_layers[i], MASTER_SPEED, 
                                                        (1/(1+i)), MASTER_SCALING, 
                                                        repeat * (BWIDTH * MASTER_SCALING)
                                                        )
                                       )
            }
        }
        background_object_arrays.push(single_layer_array);
    }
    background_object_arrays.reverse();
}

function draw(){
    // Draw all paralax background layers
    for(let i = 0; i < background_object_arrays.length; i++){
        for(let j = 0; j <background_object_arrays[i].length; j++){
            background_object_arrays[i][j].run();
        }
    }
    
    if(frameCount == 2){
        santa.setSantaY();
    }
    santa.run(frameCount);
}



function determineBackgroundCount(cw, bw){
    /*
    @param cw: The width of the canvas
    @param bw: The width of the background
    
    This function will determine how many back to backgrounds is needed to avoid
    any white space between scrolling parallax.
    
    Generally, you  need to be able to cover the screen twice with at least 2 images
    */
    if(bw >= cw){
        return 2;
    } else {
        // How many backgrounds to fill the screen + 2 to be safe?
        let repeats = Math.floor(cw / bw) + 2;
        return repeats;
    }
    
}

function mousePressed(){
    if(!first_time_music || !background_music.isPlaying()){
        background_music.play();
        first_time_music = true;
    } else if (santa.onGround && !snow_steps_music.isPlaying()){
        snow_steps_music.play();
    }
}

function keyPressed(){
    if(!first_time_music || !background_music.isPlaying()){
        background_music.play();
        first_time_music = true;
    } else if (santa.onGround && !snow_steps_music.isPlaying()){
        snow_steps_music.play();
    }
}