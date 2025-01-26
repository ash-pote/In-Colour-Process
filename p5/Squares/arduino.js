// Get references to DOM elements
const connectButton = document.getElementById("connectButton");
const outputValue = document.getElementById("output");

// Check if the button exists before adding an event listener
if (connectButton) {
  connectButton.addEventListener("click", async () => {
    try {
      console.log("Requesting serial port access...");
      const port = await navigator.serial.requestPort();
      console.log("Serial port selected:", port);

      await port.open({ baudRate: 9600 });
      console.log("Serial port opened with baudRate 9600");

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      console.log("Started reading from serial port...");

      // Continuously read data from the Arduino.
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("Reader closed");
          reader.releaseLock();
          break;
        }

        if (value) {
          let numbers = value.split(";");

          const output = document.getElementById("output");
          output.innerHTML = `${numbers[0]} ${numbers[1]} ${numbers[2]}`;
        } else {
          console.warn("No value received from serial port.");
        }
      }
    } catch (error) {
      console.error("Error connecting to Arduino:", error);
    }
  });
} else {
  console.warn("Connect button not found. Skipping event listener.");
}
