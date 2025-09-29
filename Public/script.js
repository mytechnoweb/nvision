function openLogin() {
  document.getElementById("loginPopup").style.display = "block";
}

function closeLogin() {
  document.getElementById("loginPopup").style.display = "none";
}

function handleLogin(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Simple check (replace with real authentication logic)
  if (username === "admin" && password === "1234") {
    window.location.href = "welcome.html"; // Redirect to one.html
  } else {
    alert("Invalid credentials. Please try again.");
  }

  return false;
}