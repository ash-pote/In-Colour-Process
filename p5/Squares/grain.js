// First canvas
const sketch1 = (p) => {
  let x = 0;

  p.setup = () => {
    p.createCanvas(200, 200).parent("canvas1"); // Attach to #canvas1
  };

  p.draw = () => {
    p.background(220);
    p.fill(255, 0, 0);
    p.ellipse(x, p.height / 2, 50, 50);
    x = (x + 2) % p.width; // Move the ellipse horizontally
  };
};

// Second canvas
const sketch2 = (p) => {
  let angle = 0;

  p.setup = () => {
    p.createCanvas(200, 200).parent("canvas2"); // Attach to #canvas2
  };

  p.draw = () => {
    p.background(0);
    p.fill(0, 0, 255);
    p.translate(p.width / 2, p.height / 2);
    p.rotate(angle);
    p.rect(-25, -25, 50, 50); // Rotating rectangle
    angle += 0.03;
  };
};

// Initialize the sketches
new p5(sketch1);
new p5(sketch2);
