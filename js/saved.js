// const filterOptionBtn = document.querySelectorAll(".recipes-option-field .favoritespage-option-button");
// const filterOptionItem = document.querySelectorAll(".no-favorite-found .recipe-item");
// ;

// // Define the filterItem by selecting buttons
// const filterItem = (e) => {
//     document.querySelector(".selected").classList.remove("selected");
//     e.target.classList.add("selected");

//     const selectedCategory = e.target.dataset.category.toLowerCase();

//     filterOptionItem.forEach(recipeItem => {
//         const categories = recipeItem.dataset.category.toLowerCase().split(',').map(categoryItem => categoryItem.trim());
//         // Ceck if the card matches the selected filter or if "All" is selected
//         if (selectedCategory === "all" || categories.includes(selectedCategory)) {
//             recipeItem.classList.remove("hide");
//         } else {
//             // Adding "hide" class to hide the items initially
//             recipeItem.classList.add("hide");
//         }
//     });
// };

// filterOptionBtn.forEach(button => button.addEventListener("click", filterItem));
// // 

// // Save selected filter before leaving the page
// document.querySelectorAll(".favoritespage-option-button button").forEach(btn => {
//   btn.addEventListener("click", function() {
//     localStorage.setItem("selectedCategory", this.dataset.category);
//   });
// });

//     // On page load, restore selected filter
// window.addEventListener("DOMContentLoaded", function() {
//   const savedCategory = localStorage.getItem("selectedCategory");
//   if (savedCategory) {
//     const btn = document.querySelector(`.favoritespage-option-button button[data-category="${savedCategory}"]`);
//     if (btn) btn.click();
//   }
// });

// // Import recipes to favorites page