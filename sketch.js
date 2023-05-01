/* 
Video output: Refer to https://github.com/pbeshai/p5js-ccapture
<Me, self and I>
Final project for wcc1
Biying Yao 2022/12/20
*/

let angle = 0;
let side = 0;
let particles = [];
let flowParticles = [];
//set the frame rate 
let fps = 60;
//let ccaputure.js
let capturer = new CCapture({ format: 'png', framerate: fps });
//set the start time 
let startMillis;
//let flowfield;


function setup() {
  createCanvas(1200, 800); 
  frameRate(fps);
  
  //add 20 particles to the scene
  //frameRate(10);
  for (let i = 0; i < 30; i++) {
    particles[i] = new Particle(random(width), random(height));
  }

  for (let j = 0; j < width; j += 10) { 
    flowParticles[j] = new FlowParticle(j, random(0, height));
  }
}


function draw() { 

  /* I comment out as it will run extermly slow while recording
  // start record from the first frame
  if (frameCount === 1) {
    // start the recording on the first frame
    // this avoids the code freeze which occurs if capturer.start is called
    // in the setup, since v0.9 of p5.js
    capturer.start();
  }   

  if (startMillis == null) {
    startMillis = millis(); // get the time for that momonet, only one time
  }
  
  // set the lasting time for the output video
  let duration = 30000;
  let elapsed = millis() - startMillis;
  let t = map(elapsed, 0, duration, 0, 1);
 
  // if it out of the time limited, then save and exit
  if (t > 1) {
    noLoop();
    capturer.stop();
    capturer.save();
    return;
  }
  */

  // Actually Drawing part 
  blendMode(BLEND);
  // set the alpha value to get some blur tracking
  background(0, 50);

  // draw the particleflow as background 
  push();
  drawP();
  pop();

  // draw particles 
  push();
   for (let i = 0; i < 20; i++) {
    particles[i].run(particles);
  }     
  pop();
  
  /*
  // get the output
  capturer.capture(document.getElementById('defaultCanvas0'));
  */
}

// create new function to draw the AI create image
function drawP() {
  translate(0, height - 100);
  for (let i = 0,len = flowParticles.length; i < len; i += 10) {
		flowParticles[i].update();
		flowParticles[i].show();
    flowParticles[i].boundary();
	}
}

// create a recursion drawing function
function branch(length) {
  
	stroke(50,182,195);
	translate(0, -length);
  point(0, -length);
 
	if (length > 4) {
		push();
		rotate(angle);
		branch(length * 0.7);
		pop();
    // recursion
		push();
		rotate(-angle);
		branch(length * 0.7);
		pop();
	}
}


