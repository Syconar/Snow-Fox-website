// Select all recipes option buttons and its items
const filterOptionBtn = document.querySelectorAll(".recipes-option-field .recipes-option-button");
const filterOptionItem = document.querySelectorAll(".results-grid-container .recipe-item");
;

// Define the filterItem by selecting buttons
const filterItem = (e) => {
    document.querySelector(".selected").classList.remove("selected");
    e.target.classList.add("selected");

    const selectedCategory = e.target.dataset.category.toLowerCase();

    filterOptionItem.forEach(recipeItem => {
        const categories = recipeItem.dataset.category.toLowerCase().split(',').map(categoryItem => categoryItem.trim());
        // Ceck if the card matches the selected filter or if "All" is selected
        if (selectedCategory === "all" || categories.includes(selectedCategory)) {
            recipeItem.classList.remove("hide");
        } else {
            // Adding "hide" class to hide the items initially
            recipeItem.classList.add("hide");
        }
    });
};

filterOptionBtn.forEach(button => button.addEventListener("click", filterItem));
// 



// Recipes searching thru letters using the search bar
function searchRecipes() {
    const searchInput = document.getElementById("search-bar");
    const searchFilter = searchInput.value.trim().toLowerCase();
    const resultItems = document.querySelectorAll(".recipe-item");

    resultItems.forEach(resultHeader => {
        const h3 = resultHeader.querySelector("h3");
        if (!h3) {
            resultHeader.style.display = "none";
            return;
        }

        const resultTitle = h3.textContent.trim().toLowerCase();
        if (resultTitle.includes(searchFilter) || searchFilter === "") {
            resultHeader.style.display = "";
        } else {
            resultHeader.style.display = "none";
        }
    });
}
//

// Picking up right recipe details using API
document.addEventListener("DOMContentLoaded", function () {
    const modalRecipe = document.getElementById("recipe-modal");
    const recipeItem = document.querySelectorAll(".recipe-item");
    const modalCloseBtn = document.getElementById("modal-close-cross");
    const modalContent = document.getElementById("recipe-details-content");

    let mealsData = [];

    // Picking up right recipe details using db.json API
    fetch("http://localhost:3000/meals")
    .then(Response => Response.json())
    .then(data => {
        if (Array.isArray(data)) {
            mealsData = data;
        } else if (data.meals) {
            mealsData = data.meals;
        } else {
            mealsData = [];
        }
        console.log("Loaded meals:", mealsData)
    });

    // Recipe showing details by clicking on it
    modalRecipe.addEventListener("click", function(event) {
        if (event.target === modalRecipe) {
            modalRecipe.classList.add("hidden");
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
        }
    });

    recipeItem.forEach(item => {
        item.addEventListener("click", function() {
            const recipeId = item.getAttribute("data-id");
            const meal = mealsData.find(m => m.idMeal === recipeId);
            if (meal) {
                let ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    const ing = meal[`strIngredient${i}`];
                    if (ing && ing.trim() !== "") {
                        ingredients.push(ing);
                    }
                }
                // Fill modal with corresponding recipe data from db.json
                modalContent.innerHTML = `
                    <h2>${meal.strMeal}</h2>
                    <img src="../img/1010.jpg" style="width: 80%;" alt="">
                    <h4>Ingredients</h4>
                    <ul>
                        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                    <h3>Directions</h3>
                    <p>${meal.strInstructions}</p>
                    `;
            }
            modalRecipe.classList.remove("hidden");
            document.body.classList.add("modal-open")
            document.body.style.overflow = "hidden";
        });
    });
    // Button for closing modal
    modalCloseBtn.addEventListener("click", function() {
        modalRecipe.classList.add("hidden");
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
    });
    // Getting a link to go from index.html to specific recipe category button
    const categoryHash = window.location.hash.replace("#", "").toLowerCase();
    document.querySelectorAll(".recipe-option-button button").forEach(btn => btn.classList.remove("selected"));
    const targetCategoryButton = document.getElementById(categoryHash);
    if(targetCategoryButton) {
        targetCategoryButton.classList.add("selected");
        targetCategoryButton.click();
    }
});
// 



// Replacing "favorite" recipe icon from unselected to selected and back
let changeIcon = function(starIcon, event){
    event.stopPropagation(); // Prevents the click from bubbling up to the recipeItem
    starIcon.classList.toggle("fa-solid");
    starIcon.closest(".star-icon").classList.toggle("selected");// Prevents showing up popup modal
}