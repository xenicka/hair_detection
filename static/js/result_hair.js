window.onload = function () {
  const resultDiv = document.getElementById("result");
  const uploadedImage = localStorage.getItem("uploadedImage");
  const infoText = document.getElementById("info-text");
  const type = document.getElementById("type");
  const blurOverlay = document.getElementById("blur-overlay");
  const retryButton = document.getElementById("retry-button");
  const loading_contaienr = document.getElementById("loading-container");
  const failed = document.getElementById("failed_detection");
  const hairTypeImage = document.getElementById("hair-type-image");
  const imagePaths = document.getElementById("image-paths");
  const curlyImageUrl = imagePaths.dataset.curly;
  const wavyImageUrl = imagePaths.dataset.wavy;
  const straightImageUrl = imagePaths.dataset.straight;

  // Display uploaded image if available
  if (uploadedImage) {
    const imgElement = document.getElementById("uploaded-image");
    imgElement.src = uploadedImage;
    imgElement.style.display = "block";
  }
  function updateResults() {
    const predictionsData = JSON.parse(localStorage.getItem("predictionsData"));

    if (predictionsData && predictionsData.length > 0) {
      const resultText = `${predictionsData[0]} `;
      resultDiv.innerText = resultText; // Display result

      if (predictionsData[0].toLowerCase().includes("curly")) {
        infoText.innerText =
          "Curly hair has distinct, well-defined curls that can range from loose, bouncy curls to tighter, more compact ringlets. This type of hair is characterized by its volume, natural bounce, and texture. Curly hair tends to have a lot of body and can create big, bold looks, but it also requires more moisture and care. The natural oils produced by the scalp have a harder time traveling down the twists and turns of the hair, so curly hair can often feel drier than other types. Because of its texture, curly hair can be more difficult to manage and may require extra care to maintain its shape and prevent frizz. However, with the right products and techniques, curly hair can be stunning and full of life.";
        type.innerText = "CURLY";
        hairTypeImage.src = curlyImageUrl;
        hairTypeImage.style.width = "20%";

        hairTypeImage.style.display = "block";
      } else if (predictionsData[0].toLowerCase().includes("wavy")) {
        infoText.innerText =
          "Wavy hair is a versatile hair type that falls between straight and curly, with soft, flowing waves that create natural volume. The waves can vary in size, from loose beachy waves to more defined, larger curls. Wavy hair tends to have more texture and body than straight hair, making it ideal for creating more voluminous hairstyles. However, it can also be more prone to frizz, especially in humid conditions. People with wavy hair often find that it can be a bit tricky to style, as the waves may fall flat or become overly frizzy if not managed properly. Overall, wavy hair is the perfect balance between straight and curly, offering a bit of both.";
        type.innerText = "WAVY";
        hairTypeImage.src = wavyImageUrl;
        hairTypeImage.style.width = "13%";

        hairTypeImage.style.display = "block";
      } else if (predictionsData[0].toLowerCase().includes("straight")) {
        infoText.innerText =
          "Straight hair is smooth and naturally sleek, without any curves or curls. It lays flat against the scalp and tends to reflect light, giving it a shiny appearance. This type of hair is typically more resilient to humidity and environmental changes, which helps it retain its sleek look. However, straight hair can sometimes appear greasy or limp more quickly than other hair types since the natural oils from the scalp are able to travel more easily down the length of the hair. Although it's generally easy to manage, straight hair can be prone to looking flat or lacking volume, especially if it's fine or thin.";
        type.innerText = "STRAIGHT";
        hairTypeImage.src = straightImageUrl;
        hairTypeImage.style.width = "10%";
        hairTypeImage.style.display = "block";
      } else {
        type.innerText = "NOT DETECTED";
        localStorage.setItem(
          "errorMessage",
          "No hair type detected. Please try again."
        );

        // Hide the blur overlay and show the retry button when no hair type is detected
        setTimeout(() => {
          loading_contaienr.style.display = "none"; // Hide blur overlay
          failed.style.display = "block"; // Show retry button
          retryButton.style.display = "block"; // Show retry button
        }, 2000); // Wait for 2 seconds (adjust as necessary)

        return; // Stop further processing
      }

      // Delay the removal of blur (e.g., 2 seconds)
      setTimeout(() => {
        blurOverlay.style.display = "none"; // Hide blur overlay
      }, 2000); // Adjust time (2000ms = 2 seconds) as needed

      // Stop checking for new data
      clearInterval(checkData);
    }
  }

  // Check for predictions every 500 ms
  const checkData = setInterval(updateResults, 500);
};

// Retry function to refresh the process
function retry() {
  // Reset the UI elements and local storage if necessary
  localStorage.removeItem("predictionsData");
  localStorage.removeItem("uploadedImage");

  // Optionally reset the type and info text
  document.getElementById("type").innerText = "";
  document.getElementById("info-text").innerText = "";

  // Hide the retry button again
  document.getElementById("retry-button").style.display = "none";

  // Redirect to a different page or reload the page
  // Option 1: Reload the page
  window.location.reload();

  window.location.href = "/detect_hair"; // Replace 'your_page_url_here' with the desired URL
}
function updateText(element) {
  // Create falling hearts when hovering over the circle
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = "❤️";

    // Random horizontal start position across the entire page width
    const startX = Math.random() * 100 + "%"; // Random horizontal start position

    // Start from above the page, higher than the header (100vh above the top)
    const startY = -100 + "px"; // Start from a position above the viewport

    const delay = Math.random() * 1 + "s"; // Random delay for each heart's animation

    heart.style.left = startX; // Position heart horizontally
    heart.style.top = startY; // Position heart above the page
    heart.style.animationDelay = delay;

    document.body.appendChild(heart);

    // Remove the heart after the animation ends
    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }
}
