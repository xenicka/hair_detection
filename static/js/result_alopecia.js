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
  const areata = imagePaths.dataset.areata;
  const totalis = imagePaths.dataset.totalis;
  const andro = imagePaths.dataset.andro;
  const circle = document.querySelector(".circle"); // Select the single circle

  // Display uploaded image if available
  if (uploadedImage) {
    const imgElement = document.getElementById("uploaded-image");
    imgElement.src = uploadedImage;
    imgElement.style.display = "block";
  }

  function updateResults() {
    const predictionsData = JSON.parse(localStorage.getItem("predictionsData"));

    if (predictionsData && predictionsData.length > 0) {
      const resultText = `${predictionsData[0].class} - Confidence: ${predictionsData[0].confidence}`;
      resultDiv.innerText = resultText; // Display result

      if (predictionsData[0].class.toLowerCase().includes("areata")) {
        infoText.innerText =
          "Alopecia areata is an autoimmune disorder that causes sudden, round patches of hair loss on the scalp or other parts of the body. The body’s immune system mistakenly attacks hair follicles, leading to hair shedding in small, circular patches. This type of alopecia can occur at any age, though it often starts in childhood or adolescence. In some cases, the hair may regrow naturally, while in others, the condition can be chronic or recurrent. Though the exact cause is unclear, it is thought to involve genetic and environmental factors. Alopecia areata can affect hair growth in other areas as well, such as eyebrows and eyelashes. While there is no permanent cure, treatments like corticosteroids or immunotherapy can help manage the symptoms.";
        type.innerText = "AREATA";
        hairTypeImage.src = areata;
        hairTypeImage.style.display = "block";
        hairTypeImage.style.width = "80%";
        circle.style.backgroundColor = "#D9D9D9"; // Adjust width as needed
      } else if (predictionsData[0].class.toLowerCase().includes("totalis")) {
        infoText.innerText =
          "Alopecia totalis is an advanced form of alopecia areata, where there is total loss of hair on the scalp. It is a severe, rare condition that results in complete baldness of the scalp, and in some cases, it may progress to alopecia universalis, where all body hair is lost. The exact cause is unknown, but it is believed to be linked to an autoimmune response where the immune system attacks the hair follicles, preventing new hair from growing. This form of alopecia can develop suddenly and may be emotionally challenging, though some individuals experience regrowth, while others may not. Treatments are similar to those for alopecia areata but often involve stronger or more intensive therapies.";
        type.innerText = "TOTALIS";
        hairTypeImage.src = totalis;
        hairTypeImage.style.display = "block";
        hairTypeImage.style.width = "50%";
        circle.style.backgroundColor = "#D9D9D9"; // Adjust width as needed
        // Adjust width as needed
      } else if (
        predictionsData[0].class.toLowerCase().includes("androgenetic")
      ) {
        infoText.innerText =
          "This type of hair loss is commonly known as pattern baldness. It typically manifests in a receding hairline or thinning of the hair on the crown, often following a predictable pattern. Androgenetic alopecia can affect both men and women, but it is more pronounced in men. It occurs due to genetic factors and the influence of hormones, particularly androgens. In men, it usually starts with a receding hairline and progresses to baldness on the top of the scalp. In women, it often results in diffuse thinning, especially at the crown. This type of alopecia tends to occur gradually, and though it can’t be reversed, treatments like minoxidil and hair transplants can help slow its progression and restore some hair volume.";

        type.innerText = "ANDRO";
        hairTypeImage.src = andro;
        hairTypeImage.style.display = "block";
        hairTypeImage.style.width = "40%";
        circle.style.backgroundColor = "#00253F"; // Adjust width as needed
        // Adjust width as needed
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
