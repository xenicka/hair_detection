window.onload = function () {
  const resultDiv = document.getElementById("result");
  const uploadedImage = localStorage.getItem("uploadedImage");
  if (uploadedImage) {
    const imgElement = document.getElementById("uploaded-image");
    imgElement.src = uploadedImage;
    imgElement.style.display = "block";
  }
  // Retrieve data from localStorage
  const predictionsData = JSON.parse(localStorage.getItem("predictionsData"));

  if (predictionsData) {
    predictionsData.forEach((pred) => {
      const p = document.createElement("p");
      p.innerText = `Detected: ${pred.class} - Confidence: ${pred.confidence}`;
      resultDiv.appendChild(p);
    });

    // Optionally, clear the stored data after using it
    localStorage.removeItem("predictionsData");
  } else {
    resultDiv.innerText = "No data available.";
  }
};
