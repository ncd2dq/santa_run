class BackGround{
    // Any scrolling background image
    constructor(ground_img, master_speed, speed_discount, scaling, x_offset=false, is_ground=false, is_base=false){
        /*
        @param ground_img: p5.js loadImage() object on which sprite will run
        @param master_speed: integer speed of sprite / ground floor
        @param speed_discount: the % of master speed this image should move
        @param scaling: the % of background images real size we should scale down by
        @param x_offset: the amount of pixels to the right this should be drawn, this ensures seamless looping
        @param is_ground: boolean value if this image is the ground sprite runs on
        @param is_base: boolean value if this image is static color background
        */
        // Determine how large to draw image compared to original
        this.scaling = 1 * scaling;
        this.im = ground_img;
        this.width = ground_img.width * this.scaling;
        this.height = ground_img.height * this.scaling;
        if(x_offset){
            this.x = x_offset;
        } else {
            this.x = 0;   
        }
        this.y = 0;
        this.speed_discount = speed_discount;
        this.speed = master_speed * this.speed_discount;
        
        if(is_ground){
            // Offset from actual y position that represents where the sprite should be running on
            // Hardcoded 70% from experimentation
            this.y_ceiling_offset = this.height * 0.7;
        }
        // If the flat color background, do not move
        this.is_base = is_base;
    }
    
    screenLoop(){
        // If this piece of ground is no longer visible, loop to other side of the screen
        if(this.x + this.width <= 0){
            this.x = WIDTH;
        }
    }
    
    scroll(){
        // Makes the ground piece move to the left
        this.x -= this.speed;
    }
    
    display(){
        // Blit image to canvas
        image(this.im, this.x, this.y, this.width, this.height);
    }
    
    run(){
        // Don't scroll or loop if static background
        if(!this.is_base){
            this.scroll();
            this.screenLoop();
        }
        this.display();
    }
}