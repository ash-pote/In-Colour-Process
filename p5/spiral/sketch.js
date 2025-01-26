// Spiral effect created with help of chatgpt

let angle = 0; // Starting angle for the spiral
let baseRadius = 50; // Base radius for the spiral
let angleIncrement = 0.04; // How fast the angle increases
let maxRadius = 120; // Maximum radius for the spiral
let history = []; // To store dataIndex history for smooth transitions
let maxHistory = 30; // Number of frames to keep for smoothing
let waveSize = 100; // Initial wave size
let growthPaused = false;
let paused = false; // Pause flag
let data = [0.01, 0.019, 0.005]; // Data array, how many times colour has been 'seen'
let currentDataIndex = 0; // Current index in the data array
let nextDataIndex = 1; // Next index
let lastSwitchTime = 0; // Timestamp of last data switch
let switchInterval = 2000; // Switch data every 2 seconds (2000 milliseconds)

let grain;

function setup() {
  container = document.getElementById("left");

  // Get the div's width and height
  const rect = container.getBoundingClientRect();
  containerWidth = rect.width;
  containerHeight = rect.height;

  let canvas = createCanvas(containerWidth + 16, containerHeight);
  canvas.parent("left");
  noiseLayer = createGraphics(windowWidth, windowHeight * 8);
  createFilmGrain(0, 0, windowWidth, windowHeight, 120, 3, 0.05);

  frameRate(109);
}

function draw() {
  drawLinearGradient(
    0,
    0,
    width,
    height,
    color(255, 255, 255),
    color(33, 33, 33),
    "Y"
  );

  updateGrain();
  displayGrain();

  //
  let dataIndex = data[currentDataIndex];
  dataIndex *= 20; // Scale the dataIndex to make it more responsive

  // Add the dataIndex to history for smoothing
  history.push(dataIndex);
  if (history.length > maxHistory) {
    history.shift(); // Keep the history length fixed
  }

  // Calculate the average dataIndex over the history to smooth the input
  let avgDataIndex = 0;
  for (let i = 0; i < history.length; i++) {
    avgDataIndex += history[i];
  }
  avgDataIndex /= history.length;

  // Map the dataIndex to control the wave size
  waveSize = map(avgDataIndex, 0, 1, 5, 50); // Larger dataIndex results in bigger waves

  // Translate to the center of the canvas
  translate(width / 2, height / 2);

  // Set the starting radius for the spiral
  let radius = baseRadius;

  // Begin drawing the wavy spiral
  noFill();
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (let a = 0; a < angle; a += angleIncrement) {
    // Calculate a dynamic radius that changes based on sine function (wavy effect)
    let currentRadius = radius + sin(a * 5 + frameCount * 0.05) * waveSize;

    // Calculate x and y based on polar coordinates
    let x = currentRadius * cos(a);
    let y = currentRadius * sin(a);

    vertex(x, y);

    // Gradually increase the radius as the angle increases to expand the spiral
    radius += 0.05;

    // Pause the animation if the radius exceeds the maximum
    if (radius > maxRadius) {
      paused = true; // Pause the animation
    }
  }
  endShape();

  // Check if 2 seconds have passed since the last data switch
  let currentTime = millis();
  if (currentTime - lastSwitchTime >= switchInterval) {
    currentDataIndex = (currentDataIndex + 1) % data.length; // Move to the next data point
    nextDataIndex = (currentDataIndex + 1) % data.length;
    lastSwitchTime = currentTime;
  }

  if (!paused) {
    angle += angleIncrement;
  }
}

function drawLinearGradient(x, y, w, h, c1, c2, axis) {
  noFill(); // Disable fill for shapes
  if (axis === "X") {
    // Gradient from left to right
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter); // Interpolate between colors
      stroke(c); // Set the color for the line
      line(i, y, i, y + h); // Draw vertical lines
    }
  } else if (axis === "Y") {
    // Gradient from top to bottom
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter); // Interpolate between colors
      stroke(c); // Set the color for the line
      line(x, i, x + w, i); // Draw horizontal lines
    }
  }
}

// Grain effect from https://editor.p5js.org/lazydistribution/sketches/nB-VddIvd
function updateGrain() {
  grain.update();
}

function displayGrain() {
  grain.display();
}

function createFilmGrain(x, y, w, h, patternSize, sampleSize, patternAlpha) {
  grain = new FilmGrainEffect(
    x,
    y,
    w,
    h,
    patternSize,
    sampleSize,
    patternAlpha
  );
}
