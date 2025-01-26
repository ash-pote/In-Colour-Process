// Prototype for representing data on screen
// Generated with help of chat gpt

let random;

function printRepeatedSentence() {
  // Target the container where you want to add the repeated sentence
  const container = document.querySelector(".one");

  // Define the sentence to be printed

  function appendSentence() {
    let randomFloat = getRandomFloat();
    let randomFloat2 = getRandomFloat2();
    let randomFloat3 = getRandomFloat3();
    const sentence = `Red value: ${randomFloat} Blue Value: ${randomFloat2}  Green Value: ${randomFloat3} `;

    const newParagraph = document.createElement("p");
    newParagraph.textContent = sentence;
    container.appendChild(newParagraph);

    // Scroll to the bottom after adding new content
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }

  // Call the function every second (1000 milliseconds)
  setInterval(appendSentence, 1000);
}

// Call the function to start printing
printRepeatedSentence();

function getRandomFloat() {
  let randomDecimal = Math.random();
  return Math.floor(randomDecimal * 100); // Random number between 0 (inclusive) and 1 (exclusive)
}

function getRandomFloat2() {
  let randomDecimal = Math.random();
  return Math.floor(randomDecimal * 100); // Random number between 0 (inclusive) and 1 (exclusive)
}

function getRandomFloat3() {
  let randomDecimal = Math.random();
  return Math.floor(randomDecimal * 100); // Random number between 0 (inclusive) and 1 (exclusive)
}

function printRepeatedSentence2() {
  // Target the container where you want to add the repeated sentence
  const container = document.querySelector(".three");
  const paragraph = container.querySelector("p"); // Select the existing p tag

  // Define the sentence to be appended
  function appendSentence() {
    let zeroOrOne = randomZeroOrOne();
    const sentence = `${zeroOrOne}`;

    if (paragraph) {
      paragraph.textContent += sentence; // Append to existing text inside the p tag

      // Scroll to the bottom after adding new content
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }

  // Call the function every second (1000 milliseconds)
  setInterval(appendSentence, 50);
}

printRepeatedSentence2();

function randomZeroOrOne() {
  return Math.floor(Math.random() * 2); // Returns either 0 or 1
}

// Test the function
console.log(randomZeroOrOne()); // Outputs 0 or 1
