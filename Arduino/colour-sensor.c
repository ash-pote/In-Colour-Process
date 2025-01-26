#include <Wire.h>
#include "Adafruit_TCS34725.h"

/* Initialise with specific integration time and gain values */
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_4X);

void setup() {
  Serial.begin(9600);

  if (tcs.begin()) {
    Serial.println("TCS34725 found");
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    while (1); // Halt
  }
}

void loop() {
  uint16_t r, g, b, c;
  float red, green, blue;

  // Get the raw data
  tcs.getRawData(&r, &g, &b, &c);

  // Calculate color temperature and lux
  uint16_t colorTemp = tcs.calculateColorTemperature(r, g, b);
  uint16_t lux = tcs.calculateLux(r, g, b);

  // Avoid division by zero for clear channel
  if (c == 0) c = 1;

  // Normalize RGB values using the clear channel
  red = r / (float)c;
  green = g / (float)c;
  blue = b / (float)c;

  // Clamp normalized values to 0–1
  red = constrain(red, 0.0, 1.0);
  green = constrain(green, 0.0, 1.0);
  blue = constrain(blue, 0.0, 1.0);

  // Convert normalized RGB to HSL
  float h, s, l;
  rgbToHslWithLighting(red, green, blue, colorTemp, lux, h, s, l);

  // Print results
  // Serial.print("Color Temp: "); Serial.print(colorTemp); Serial.print(" K ");
  // Serial.print("Lux: "); Serial.print(lux); Serial.println(" lx");
  String p1=";";
  s = s * 100;
  l = l * 100;
  Serial.print(h + p1 + s + p1 + l); // Hue
  Serial.println();

  delay(500);
}

// Function to convert normalized RGB to HSL, incorporating lux and color temperature
void rgbToHslWithLighting(float r, float g, float b, uint16_t colorTemp, uint16_t lux, float &h, float &s, float &l) {
  float maxVal = max(r, max(g, b));
  float minVal = min(r, min(g, b));
  float delta = maxVal - minVal;

  // Calculate Lightness
  l = (maxVal + minVal) / 2.0;

  if (delta == 0) {
    // Achromatic case (no color)
    h = 0;
    s = 0;
  } else {
    // Calculate Saturation
    s = l > 0.5 ? delta / (2.0 - maxVal - minVal) : delta / (maxVal + minVal);

    // Calculate Hue
    if (maxVal == r) {
      h = (g - b) / delta + (g < b ? 6 : 0);
    } else if (maxVal == g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h *= 60.0; // Convert hue to degrees
  }

  // Clamp hue to 0–360
  if (h < 0) {
    h += 360.0;
  }

  // Incorporate lux into lightness
  l = l * (0.8 + (lux / 10000.0)); // Scale lightness based on lux (arbitrary normalization)

  // Adjust hue based on color temperature
  if (colorTemp < 5000) {
    h -= (5000 - colorTemp) / 1000.0; // Shift hue slightly warmer
  } else {
    h += (colorTemp - 5000) / 1000.0; // Shift hue slightly cooler
  }
  h = constrain(h, 0, 360); // Clamp hue back to 0–360

  // Adjust saturation based on lux (higher lux means higher saturation perception)
 s *= (1 + (lux / 1000.0));  // Boost saturation for higher lux // Arbitrary scaling factor for demonstration
  s = constrain(s, 0.0, 1.0); // Clamp saturation back to 0–1
}