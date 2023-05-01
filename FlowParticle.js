class FlowParticle {

    constructor(x, y){
       //random position
       this.pos = createVector(x, y);
       this.acc = createVector(0, -0.01);
       this.vel = createVector(0, 0);
       //limit their moving speed
       this.maxSpeed = 2;
       this.ellipseSize = random(4, 9);
       //load image as the editable object
       this.img = loadImage('test.jpg');
    }


    update() {
        this.acc.mult(random(0, 3));
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel)
    }


    show(){
        // extract the pixel color from the pic and give it to the particles
        this.img.loadPixels();
        let x = int(random(this.img.width));
        let y = int(random(this.img.height));
        let pix = (x + y * this.img.width) * 4;
        let col = this.img.pixels.slice(pix, pix+6);	
        noStroke();	
        fill(col[0], col[1], col[2]);      
        // stroke(160, 335, 335);
        if (random(1) < 0.4) {
            ellipse(this.pos.x, this.pos.y,  this.ellipseSize);
        }
        if (random(1) < 0.2) {
            line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + random(0, 3));
        }
    }

    boundary(){
        // check the boundary of the particles
        if (this.y > height) {
            this.acc = createVector(0, 0.01);
        }
        if (this.y < 0) {
            this.acc = createVector(0, -0.01);
        }
    }


}