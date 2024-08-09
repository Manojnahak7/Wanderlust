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
