document.getElementById("upload-button").onclick = function () {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  // Convert image to Base64 for storage
  const reader = new FileReader();
  reader.onloadend = function () {
    localStorage.setItem("uploadedImage", reader.result); // Store image as base64

    // Send the file to the server
    fetch("/upload_alopecia", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          document.getElementById("result").innerText = data.error;
        } else {
          localStorage.setItem(
            "predictionsData",
            JSON.stringify(data.predictions)
          );
          window.location.href = "/result_alopecia"; // Redirect
        }
      })
      .catch((error) => console.error("Error:", error));
  };
  reader.readAsDataURL(file); // Convert image to base64
};
function updateText(element) {
  // Select the tooltip element within the hovered circle
  const tooltip = element.querySelector(".tooltip");

  // If a tooltip exists, update the target paragraph text with its content
  if (tooltip) {
    document.getElementById("what_we_do").textContent =
      tooltip.textContent.trim();
  }
}
