/* refer to: 
https://p5js.org/examples/simulate-flocking.html
https://natureofcode.com/
*/

class Particle {
  constructor(x, y) {
  // Just to add some individuality to the particles wiggle 
  this.pos = createVector(x, y);
  // Make a random velocsity */
  this.vel = createVector(random(-1, 1), random(-1, 1));
  this.acc = createVector(-1, 1);
  this.r = 3.0;
  this.maxSpeed = 1;
  // Maximum steering force
  this.maxForce = 0.05;
  }
  
  run(particles) {
    this.flock(particles);
    this.update();
    this.boundaries();
    this.show();
  }

  applyForce(force) {
    this.acc.add(force);
  }

  flock(particles) {
    let sep = this.separate(particles); // Separation
    let ali = this.align(particles);    // Alignment
    let coh = this.cohesion(particles); // Cohesion
    
    // Arbitrarily weight these forces
    sep.mult(2.0);
    ali.mult(1.8);
    coh.mult(1.5);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    // Update velocity
    this.vel.add(this.acc);
    // Limit speed
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    // Reset acceleration to 0 each cycle
    this.acc.mult(1);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxSpeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce); // Limit to maximum steering force
    return steer;
  }

  show() {
   push();
   // set the postition of the particles
   translate(this.pos.x, this.pos.y);
   stroke(random(0,255),0,0,random(0,60));
   rectMode(CENTER);
   angle = angle + (30 + (sin(side) * 10)) / 400; 
   translate(width/2, height/2);
   //point(sin(angle) * noise(1)); 
   point(cos(angle) * noise(1)); 
   for(let i = 0; i <= 360; i += 45) {
    push();
    rotate(i);
    branch(15);
    pop();
  }
   pop();
  }

  branch(length) {
    strokeWeight(1);
    stroke(50);
    translate(0, -length);
    point(0, -length);
   
    if (length > 4) {
      push();
      rotate(angle);
      branch(length * 0.7);
      pop();
  
      push();
      rotate(-angle);
      branch(length * 0.7);
      pop();
    }
  }

  boundaries() {
    // detect if the particles touch the boundaries
    // and turn around 
    if (this.pos.x < -100) {
      this.pos.x = width + 100;
    }
    if (this.pos.x > width + 100) {
      this.pos.x = -100;
    } 
    if (this.pos.y < -100) {
      this.pos.y = height + 100;
    }
    if (this.pos.y > height + 100) {
      this.pos.y = -100;
    }
  }

  separate(particles) {
    let desiredseparation = 50.0;
    let steer = createVector(-1, 1);
    let total = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < particles.length; i++) {
      let d = p5.Vector.dist(this.pos, particles[i].pos);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.pos, particles[i].pos);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        total++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (total > 0) {
      steer.div(total);
    }
  
    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }
  
  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(particles) {
    let perception = 50;
    let sum = createVector();
    let total = 0;
    for (let i = 0; i < particles.length; i++) {
      let d = p5.Vector.dist(this.pos, particles[i].pos);
      if ((d > 0) && (d < perception)) {
        sum.add(particles[i].vel);
        total++;
      }
    }

    if (total > 0) {
      sum.div(total);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector();
    }
  }
  
  // Cohesion
  // For the average location (i.e. center) of all nearby particles, calculate steering vector towards that location
  cohesion(particles) {
    let perception = 100;
    let sum = createVector(); // Start with empty vector to accumulate all locations
    let total = 0;
    for (let i = 0; i < particles.length; i++) {
      let d = p5.Vector.dist(this.pos, particles[i].pos);
      if ((d > 0) && (d < perception)) {
        sum.add(particles[i].pos); // Add location
        total++;
      }
    }
    if (total > 0) {
      sum.div(total);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector();
    }
  } 

}