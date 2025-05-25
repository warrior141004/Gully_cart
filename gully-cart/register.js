function goToStep2() {
  const vendorName = document.getElementById("vendorName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cartType = document.getElementById("cartType").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  const photoInput = document.getElementById("photo");

  if (!vendorName || !phone || !cartType || !category || !description) {
    alert("Please fill in all fields.");
    return;
  }

  if (!photoInput.files.length) {
    alert("Please upload a cart photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const photoData = reader.result;

    const cartDetails = {
      vendorName,
      phone,
      cartType,
      category,
      description,
      photo: photoData
    };

    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));

    // Switch to step 2
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
  };

  reader.readAsDataURL(photoInput.files[0]);
}

// Handle Step 2 form submit
document.getElementById("step2").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("Username").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!username || !password || !confirm) {
    alert("Please fill in all login fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  const cartDetails = JSON.parse(localStorage.getItem("cartDetails"));

  if (!cartDetails) {
    alert("Step 1 details not found. Please start again.");
    return;
  }

  const payload = {
    ...cartDetails,
    username,
    password
  };

  try {
    const response = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
       
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.message || "Registration failed.";
      alert(errorMsg);
      return;
    }

    if (result.success) {
      alert("Registration successful!");
      localStorage.removeItem("cartDetails");
      window.location.href = "login.html";
    } else {
      alert("Registration failed: " + result.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong during registration.");
  }
});
