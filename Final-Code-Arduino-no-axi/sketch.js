// Generated with help of chat gpt
// For serialread: https://j3n-teaching.notion.site/Web-Serial-1831e9cb58b08023943ae8b9072703ae
let port;
let val = 0;
let arduinoConnected = false;

let dataArray = [];
let dataArrayH = [];
let dataArrayS = [];
let dataArrayL = [];

let squareCounter = 0;

let hueData = {};

let lastSquare = null; // Initialize lastSquare

// Fetch data for how many times a hue was seen
fetch("/hues.json")
  .then((response) => response.json())
  .then((data) => {
    hueData = data.hues; // Now hueData will hold the data from hueData.json
  })
  .catch((error) => {
    console.error("Error loading hue data:", error);
  });

// Push arduino data to separate hsl arrays
setInterval(() => {
  if (arduinoConnected) {
    val = port.readUntil("\n"); //read each line
    dataArray.push(val);

    let parts = val.split(";");
    if (parts.length === 3) {
      dataArrayH.push(Math.floor(parts[0]));
      dataArrayS.push(Math.floor(parts[1]));
      dataArrayL.push(Math.floor(parts[2]));
    }
  }
}, 50);

function mousePressed() {
  if (!port.opened()) {
    port.open("Arduino", 9600);
    arduinoConnected = true;
  } else {
    port.close();
    arduinoConnected = false;
  }
}

function setup() {
  let width = 500;
  let height = 700;
  let canvas = createCanvas(width, height);
  canvas.parent("canvas-container");

  port = createSerial();

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
    // Get hue from dataArrayH
    let h = Math.floor(dataArrayH[dataArrayH.length - 1]) + 20;

    // Ensure that the hue value remains within the valid range
    if (h < startHue || h > hueRange) {
      console.log("Hue out of valid range", h);
      return;
    }

    let s = dataArrayS[dataArrayS.length - 1] * 2;
    let l = dataArrayL[dataArrayL.length - 1] + 20;

    // Get hue count from hueData (ensure hueData[h] is not undefined)
    let hueCount = hueData[h] || 0; // Default to 0 if undefined

    // Print data to screen
    DataToScreen(h, hueCount, s, l);

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

      if (squareCounter == 100) {
        console.log("Squares reached");
      }
    }
  }
}

function DataToScreen(hue, hueTimes, saturation, lightness) {
  // Add to data to screen
  let outputHueCount = document.querySelector(".one");
  let outputHue = document.querySelector(".two");
  const newParagraphSeen = document.createElement("p");
  const newParagraphHue = document.createElement("p");
  if (isNaN(hue)) {
    newParagraphSeen.textContent = ``;
    newParagraphHue.textContent = ``;
  } else {
    newParagraphSeen.textContent = `Hue ${hue} seen: ${hueTimes} times`;
    outputHueCount.appendChild(newParagraphSeen);

    newParagraphHue.textContent = `HSL= ${hue}${saturation}${lightness}`;
    outputHue.appendChild(newParagraphHue);
  }

  // Convert to binary and add to screen
  let outputBinary = document.querySelector(".three");
  const newParagraphBinary = document.createElement("p");
  const hueBinary = hue.toString(2).padStart(9, "0"); // Hue ranges from 0 to 360
  const saturationBinary = saturation.toString(2).padStart(8, "0"); // Saturation ranges from 0 to 100
  const lightnessBinary = lightness.toString(2).padStart(8, "0"); // Lightness ranges from 0 to 100
  if (isNaN(hue)) {
    newParagraphBinary.textContent = ``;
  } else {
    newParagraphBinary.textContent = `${hueBinary}${saturationBinary}${lightnessBinary}`;
    outputBinary.appendChild(newParagraphBinary);
  }
}

// Call PrintSquare at the desired interval
// setInterval(PrintSquare, 10000);
setInterval(PrintSquare, 500);
