function register() {
  // Get input values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error");

  errorElement.textContent = "";

  const userData = {
    email: email,
    password: password,
  };
  errorElement.textContent = "";
  if (!password || !email) {
    errorElement.innerText = "Please fill in all fields.";
    return;
  }
  // Send the data to the server using fetch
  fetch("http://127.0.0.1:5000/sign_in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle server response
      if (data.success) {
        // Redirect or display success message
        window.location.href = "/"; // Redirect to /about
      } else {
        errorElement.textContent = data.message;
        if (data.message.includes("Email not registered.")) {
          setTimeout(() => {
            window.location.href = "/register"; // Redirect after 2 sec
          }, 500);
        }
      }
    })
    .catch((error) => {
      // Handle network errors
      console.error("Error:", error);
      document.getElementById("error").innerText =
        "An error occurred, please try again.";
    });
}
