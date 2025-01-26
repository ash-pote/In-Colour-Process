#include <NewPing.h>

#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     11  // Arduino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 20 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.

// Constants
const int LEDPIN = 10;
int cm = 1;

// Setup is run once
void setup() {
  Serial.begin(115200); // Open serial monitor at 115200 baud to see ping results.
  // Tell Arduino which pins are input and output
  pinMode(LEDPIN, OUTPUT);
}

// Loop is run over and over again
void loop() {
  cm = sonar.ping_cm();
  Serial.print(decimal);
  Serial.println("cm");

  if (cm >= 3) {
    analogWrite(LEDPIN, 0);
  } else if (cm < 3) {
    analogWrite(LEDPIN, 100);
  }

  // analogWrite(LEDPIN, 100); // Uncomment to test laser

  delay(100);
}