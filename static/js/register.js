function register() {
  // Get input values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorElement = document.getElementById("error");

  errorElement.textContent = "";
  if (!name || !email || !password || !confirmPassword) {
    errorElement.innerText = "Please fill in all fields.";
    return;
  }

  if (password !== confirmPassword) {
    document.getElementById("error").innerText = "Passwords do not match.";
    return;
  }

  // Prepare the data to send
  const userData = {
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  };

  // Send the data to the server using fetch
  fetch("http://127.0.0.1:5000/register", {
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
        window.location.href = "/sign_in"; // Redirect to /about
      } else {
        errorElement.textContent = data.message;
        if (data.message.includes("Email already registered")) {
          setTimeout(() => {
            window.location.href = "/sign_in"; // Redirect after 2 sec
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
