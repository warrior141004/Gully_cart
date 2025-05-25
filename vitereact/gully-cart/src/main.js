import './style.css'
function searchCart() {
    const query = document.getElementById("searchInput").value.trim();
    if (query !== "") {
      // Query encode karke URL me bhej rahe hain
      const encodedQuery = encodeURIComponent(query);
      // Map page pe redirect karna (change the URL as needed)
      window.location.href = `map.html?search=${encodedQuery}`;
    } else {
      alert("Please enter something to search.");
    }
  }

function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function () {
            alert("Location accessed! Redirecting to map...");
            window.location.href = "map.html"; // Replace with your actual map page
          },
          function () {
            alert("Please allow location access to explore carts.");
          }
        );
      } else {
        alert("Geolocation not supported.");
      }
    }
