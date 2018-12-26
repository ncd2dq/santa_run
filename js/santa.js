class Santa{
    // Any scrolling background image
    constructor(master_speed, speed_discount, scaling){
        /*
        @param ground_img: p5.js loadImage() object on which sprite will run
        @param master_speed: integer speed of sprite / ground floor
        @param speed_discount: the % of master speed this image should move
        @param scaling: the % of background images real size we should scale down by
        */
        this.scaling = 1 * scaling;
        this.x = WIDTH / 7;
        this.y = 0;
        this.speed_discount = speed_discount;
        this.speed = master_speed * this.speed_discount;
        
        this.animation_index = 0;
        this.frame_update_rate = {'Dead': 5, 'Idle': 5, 'Jump': 5, 'Run': 3, 'Slide': 5, 'Walk': 5};
        this.state_counts = {'Dead': 17, 'Idle': 16, 'Jump': 16, 'Run': 11, 'Slide': 11, 'Walk': 13};
        this.state = 'Run'
        this.animation_dictionary = this.createAnimationDict();
        
        this.height = this.animation_dictionary[this.state][this.animation_index].height * this.scaling;
        this.onGround = true;
    }
    
    createAnimationDict(){
        /*
        Loads all sprites and puts them into a dictionary of arrays of p5.js images
        */
        let img_dict = {};
        let dir_prefix = './assets/santa/'

        for(key in this.state_counts){
            img_dict[key] = [];
            for(let i = 0; i < this.state_counts[key]; i++){
                const img_loc = dir_prefix + key + ' (' + (i + 1) + ').png';
                img_dict[key].push(loadImage(img_loc));
            }
        }
        return img_dict;
    }
    
    updateAnimationIndex(frame_count){
        /*
        @param frame_count: integer of current html5 animation frame
        
        Advances the animation_index based on frame update rate of current state
        */
        
        if(frame_count % this.frame_update_rate[this.state] == 0){
            if(this.animation_index < this.state_counts[this.state] - 1){
                this.animation_index++;
            } else {
                this.animation_index = 0;
            }
        }
    }
    
    setSantaY(){
        /*
        Ugly attempt to find the right spot to draw santa
        */
        this.y = background_object_arrays[background_object_arrays.length - 1][0].y_ceiling_offset - (this.height * 6 / 7);
    }
    
    display(){
        // Blit image to canvas
        const cur_img = this.animation_dictionary[this.state][this.animation_index];
        image(cur_img, this.x, this.y, 
              cur_img.width * this.scaling, cur_img.height * this.scaling);
        this.height = cur_img.height * this.scaling;
    }
    
    run(frame_count){
        this.updateAnimationIndex(frame_count);
        this.display();
    }
}