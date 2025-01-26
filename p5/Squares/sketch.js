// Generated with help of chat gpt

const element = document.getElementById("output");
let observedData; // Data from arduino
let dataArray = [];

let dataArrayH = [];
let dataArrayS = [];
let dataArrayL = [];

let squareCounter = 0;

let hueData = {};

const MAX_X_MM = 50;
const MAX_Y_MM = 50;
const SCALE_MULTIPLIER = 4; // Increase this value to make AxiDraw drawings larger

const axi = new axidraw.AxiDraw();
axi.setSpeed(40);
let connected = false;
let lastSquare = null; // Initialize lastSquare

// Fetch data for how many times a hue was seen
fetch("/hues.json")
  .then((response) => response.json())
  .then((data) => {
    hueData = data.hues;
    console.log(hueData); // Now hueData will hold the data from hueData.json
  })
  .catch((error) => {
    console.error("Error loading hue data:", error);
  });

// Return data from arduino
function updateObservedData() {
  observedData = element.innerText;
  return observedData;
}

const observer = new MutationObserver(updateObservedData);
observer.observe(element, {
  characterData: true,
  subtree: true,
  childList: true,
});

// Push arduino data to separate hsl arrays
setInterval(() => {
  if (observedData !== undefined) {
    dataArray.push(observedData);

    let parts = observedData.split(" ");
    if (parts.length === 3) {
      let hue = parseFloat(parts[0]);
      dataArrayH.push(hue);
      dataArrayS.push(parseFloat(parts[1]));
      dataArrayL.push(parseFloat(parts[2]));
    }
  }
}, 50);

// Connect to axidraw
function mouseClicked() {
  loop();

  if (!connected) {
    axi.connect().then(() => {
      connected = true;
    });
    return;
  }
}

function mmToPx(mmPos) {
  return createVector(
    constrain(map(mmPos.x, 0, MAX_X_MM, 0, width), 0, width),
    constrain(map(mmPos.y, 0, MAX_Y_MM, 0, height), 0, height)
  );
}

function pxToMm(pxPos) {
  return createVector(
    map(pxPos.x, 0, width, 0, MAX_X_MM * SCALE_MULTIPLIER),
    map(pxPos.y, 0, height, 0, MAX_Y_MM * SCALE_MULTIPLIER)
  );
}

function setup() {
  let width = 500;
  let height = 700;
  let canvas = createCanvas(width, height);
  canvas.parent("canvas-container");
  colorMode(HSL);
  noLoop();
}

let rectangles = 3;
let startHue = 20;
let hueRange = 140;

function draw() {
  background(0, 255, 0, 0);

  for (let i = 0; i < rectangles; i++) {
    let hue = startHue + (hueRange / rectangles) * i;
    fill(hue % 360, 100, 50, 0);
    noStroke();
    rect(0, (height / rectangles) * i, width, height / rectangles);
  }
}

function PrintSquare() {
  if (squareCounter < 100) {
    // For randomly generated hslvalues
    let h = Math.floor(Math.random() * (150 - 20 + 1)) + 20;
    let s = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    let l = Math.floor(Math.random() * (60 - 40 + 1)) + 40;

    // uncomment for arduino data
    // Get hue from dataArrayH
    // let h = Math.floor(dataArrayH[dataArrayH.length - 1]) + 20;

    // Ensure that the hue value remains within the valid range
    // if (h < startHue || h > hueRange) {
    //   console.log("Hue out of valid range", h);
    //   return;
    // }

    // Calculate the saturation and lightness
    // let s = dataArrayS[dataArrayS.length - 1] * 2;
    // let l = dataArrayL[dataArrayL.length - 1] + 20;

    // Get hue count from hueData (ensure hueData[h] is not undefined)
    let hueCount = hueData[h] || 0; // Default to 0 if undefined

    // Set the size of the square based on hue count
    let size = hueCount / 10;

    // Placing square based on hue
    // Determine the column index for the hue range
    let columnIndex = Math.floor((h - startHue) / (hueRange / 6));
    let sectionHeight = height / rectangles;
    let x = Math.random() * width;
    let y = sectionHeight * columnIndex + Math.random() * sectionHeight;

    if (
      x - size / 2 >= 0 &&
      x + size / 2 <= width &&
      y - size / 2 >= 0 &&
      y + size / 2 <= height
    ) {
      fill(h, s, l, 1);
      stroke(1);
      rectMode(CENTER);
      rect(x, y, size, size);

      lastSquare = { x, y, size };

      squareCounter++;

      if (connected) {
        drawShapeOnAxiDraw(lastSquare.x, lastSquare.y, lastSquare.size);
      }

      if (squareCounter == 100) {
        console.log("Squares reached");
      }
    }
  }
}

// Call PrintSquare at the desired interval
// setInterval(PrintSquare, 10000);
setInterval(PrintSquare, 500);

function drawShapeOnAxiDraw(x, y, size) {
  if (!connected) {
    console.error("AxiDraw is not connected.");
    return;
  }

  // Convert the rectangle's center position and size from pixels to millimeters
  const shapeCenterMm = pxToMm(createVector(x, y));
  const sizeMm = size * (MAX_X_MM / width) * SCALE_MULTIPLIER; // Map size proportionally to the AxiDraw area

  // Calculate the corners of the square in millimeters
  const halfSizeMm = sizeMm / 2;
  const corners = [
    createVector(-halfSizeMm, -halfSizeMm),
    createVector(halfSizeMm, -halfSizeMm),
    createVector(halfSizeMm, halfSizeMm),
    createVector(-halfSizeMm, halfSizeMm),
  ];

  // Draw the square on the AxiDraw
  axi
    .penUp()
    .then(() =>
      axi.moveTo(corners[0].x + shapeCenterMm.x, corners[0].y + shapeCenterMm.y)
    )
    .then(() => axi.penDown())
    .then(() =>
      axi.moveTo(corners[1].x + shapeCenterMm.x, corners[1].y + shapeCenterMm.y)
    )
    .then(() =>
      axi.moveTo(corners[2].x + shapeCenterMm.x, corners[2].y + shapeCenterMm.y)
    )
    .then(() =>
      axi.moveTo(corners[3].x + shapeCenterMm.x, corners[3].y + shapeCenterMm.y)
    )
    .then(() =>
      axi.moveTo(corners[0].x + shapeCenterMm.x, corners[0].y + shapeCenterMm.y)
    ) // Close the square
    .then(() => axi.penUp())
    .catch((err) => {
      console.error("Error during drawing:", err);
    });
}
