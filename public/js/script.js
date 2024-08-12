// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// For search functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const autocompleteContainer = document.getElementById(
    "autocomplete-container"
  );

  searchInput.addEventListener("input", function () {
    const query = this.value.trim();
    if (query === "") {
      autocompleteContainer.innerHTML = ""; // Clear suggestions
      return;
    }

    fetch(`/search?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        autocompleteContainer.innerHTML = ""; // Clear previous suggestions
        data.results.forEach((item) => {
          const div = document.createElement("div");
          div.className = "autocomplete-item";
          div.textContent = item.title;
          div.onclick = () => {
            window.location.href = `/listings/${item._id}`;
          };
          autocompleteContainer.appendChild(div);
        });
      });
  });

  // Hide autocomplete when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !autocompleteContainer.contains(event.target) &&
      event.target !== searchInput
    ) {
      autocompleteContainer.innerHTML = "";
    }
  });
});

// For contact
function validateContactNumber(input) {
  if (input.value.length === 10) {
    input.value = input.value.slice(0, 10);
  }
}

//For Navbar
document
  .getElementById("hamburger-icon")
  .addEventListener("click", function () {
    document.getElementById("menu-overlay").style.display = "flex";
    document.getElementById("hamburger-icon").style.display = "none";
    document.getElementById("cross-icon").style.display = "block";
  });

document.getElementById("cross-icon").addEventListener("click", function () {
  document.getElementById("menu-overlay").style.display = "none";
  document.getElementById("hamburger-icon").style.display = "flex";
  document.getElementById("cross-icon").style.display = "none";
});

// //Filters
// const originalListings = Array.from(document.querySelectorAll(".row a"));

// const filters = document.querySelectorAll(".filter");
// const trendingFilter = filters[0];
// trendingFilter.classList.add("selected");

// trendingFilter.dispatchEvent(new Event("click"));

// filters.forEach((filter) => {
//   filter.addEventListener("click", () => {
//     const selectedFilter = filter.getAttribute("data-filter");

//     filters.forEach((f) => f.classList.remove("selected"));
//     filter.classList.add("selected");

//     const filteredListings = originalListings.filter((anchor) => {
//       const listingCard = anchor.querySelector(".listing-card");
//       const listingCategory = listingCard.getAttribute("data-category");
//       return (
//         selectedFilter === "trending" || listingCategory === selectedFilter
//       );
//     });

//     const row = document.querySelector(".row");
//     row.innerHTML = "";

//     filteredListings.forEach((anchor) => {
//       row.appendChild(anchor);
//     });

//     if (filteredListings.length === 0) {
//       const noListingsMessage = document.createElement("div");
//       noListingsMessage.innerHTML = "😞 No listings found!";
//       noListingsMessage.style.textAlign = "center";
//       noListingsMessage.style.fontSize = "24px";
//       noListingsMessage.style.color = "gray";
//       noListingsMessage.style.position = "absolute";
//       noListingsMessage.style.top = "50%";
//       noListingsMessage.style.left = "50%";
//       noListingsMessage.style.transform = "translate(-50%, -50%)";
//       noListingsMessage.style.width = "100%";
//       document.querySelector(".row").appendChild(noListingsMessage);
//     }
//   });
// });
