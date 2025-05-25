function goToStep2() {
  // Get step 1 values
  const vendorName = document.getElementById("vendorName").value;
  const phone = document.getElementById("phone").value;
  const cartType = document.getElementById("cartType").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const photoInput = document.getElementById("photo");

  if (!photoInput.files.length) {
    alert("Please upload a cart photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const photoData = reader.result;

    // Save step 1 details temporarily
    const cartDetails = {
      phone,
      cartType,
      category,
      description,
      photo: photoData
    };
    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
    localStorage.setItem("vendorNameTemp", vendorName); // Save temporarily

    // Go to step 2
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
  };
  reader.readAsDataURL(photoInput.files[0]);
}

// Step 2 form handling
document.getElementById("step2").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("Username").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  const vendorName = localStorage.getItem("vendorNameTemp");

  // Save vendor credentials
  localStorage.setItem("vendor", username);
  localStorage.setItem("vendorPassword", password); // (optional)

  alert("Registration successful!");

  // Cleanup
  localStorage.removeItem("vendorNameTemp");

  // Redirect to login
  window.location.href = "login.html";
});
