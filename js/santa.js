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
        this.y_floor = 0; // Y location when santa is on the current ground
        this.y_velocity = 0;
        this.y_acceleration = 0;
        this.speed_discount = speed_discount;
        this.speed = master_speed * this.speed_discount;
        
        this.animation_index = 0;
        this.frame_update_rate = {'Dead': 5, 'Idle': 5, 'Jump': 2, 'Run': 3, 'Slide': 5, 'Walk': 5};
        this.state_counts = {'Dead': 17, 'Idle': 16, 'Jump': 16, 'Run': 11, 'Slide': 11, 'Walk': 13};
        this.state = 'Run'
        this.animation_dictionary = this.createAnimationDict();
        
        this.height = this.animation_dictionary[this.state][this.animation_index].height * this.scaling;
        this.width = this.animation_dictionary[this.state][this.animation_index].width * this.scaling;
        this.onGround = true;
        this.alive = true;
        
        //Top left x/y, bottom right x/y
        this.hitbox = {'Run': [0.24, 0.05, 0.58, 0.91], 'Slide': [0.057, 0.178, 0.58, 0.91]}
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
    
    changeState(state){
        /*
        @param state: String of new state to change to 
        
        Gatekeeping for state change to determine if valid
        */
        if(state == 'Run' && !this.onGround){
            console.log('Ignored');
        } else if(this.state != state){
            this.state = state;
            this.animation_index = 0;
        }
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
    
    update_kinematics(){
        /*
        Apply acceleration and apply velocity
        */
        this.y_velocity += this.y_acceleration;
        this.y += this.y_velocity;
    }
    
    jump(){
        /*
        Apply upward force to santa
        */
        if(this.onGround){
            this.y_velocity -= 15;
            this.y_acceleration -= 6;
            this.onGround = false;
            this.changeState('Jump');
        }
    }
    
    slide(){
        /*
        Allow santa to change to slide animation for 1 second
        */
        this.changeState('Slide');
        setTimeout(()=> this.changeState('Run'), 1000);
    }
    
    debug(){
        /*
        Draw a square around our santa
        */
        rect(this.x, this.y, 100, this.height)
    }
    
    gravity(){
        /*
        If santa's y is not equal to y_floor, apply gravity
        */
        if(this.y < this.y_floor){
            this.y_acceleration = 1.5;
        } else {
            if(!this.onGround){
                this.y_velocity = 0;
                this.y_acceleration = 0;
                this.y = this.y_floor;
                this.onGround = true;
                this.changeState('Run');
            }
        }
    }
    
    setSantaYGround(){
        /*
        Ugly attempt to find the right spot to draw santa on the ground level
        */
        this.y_floor = background_object_arrays[background_object_arrays.length - 1][0].y_ceiling_offset - (this.height * 6 / 7);
        this.y = this.y_floor;
    }
    
    setSantaYBlock(block_list){
        /*
        Set santa's floor to the correct y position depending upon the block he's jumping over
        */
        for(let i = 0; i < block_list.length; i++){
            if(block_list[i].santa_above){
                this.y_floor = block_list[i].y_ceiling_offset;
                return true;
            }
        }
    }
    
    display(){
        // Blit image to canvas
        const cur_img = this.animation_dictionary[this.state][this.animation_index];
        image(cur_img, this.x, this.y, 
              cur_img.width * this.scaling, cur_img.height * this.scaling);
        this.height = cur_img.height * this.scaling;
        this.width = cur_img.width * this.scaling;
    }
    
    run(frame_count, block_list){
        if(this.alive){
            this.updateAnimationIndex(frame_count);
        }
        this.setSantaYBlock(block_list);
        this.display();
        this.update_kinematics();
        this.gravity();
    }
}