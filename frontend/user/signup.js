document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  try {
    const response = await fetch("http://localhost:5001/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });
    const data = await response.json();
    if (data.status === "success") {
      alert("User registered successfully. Please login.");
      window.location.href = "login.html";
    } else {
      alert("Registration failed. Please try again.");
    }
  } catch (error) {
    console.log("Error signing up");
  }
});
