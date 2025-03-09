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
    fetch("/upload_hair", {
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
          window.location.href = "/result_hair"; // Redirect
        }
      })
      .catch((error) => console.error("Error:", error));
  };
  reader.readAsDataURL(file); // Convert image to base64
};
