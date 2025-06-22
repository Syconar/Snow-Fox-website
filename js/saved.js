window.addEventListener("DOMContentLoaded", function() {
    // To make sure that this code will only run on foxfavorites.html
    if (!document.body.classList.contains("page-foxfavorites")) return;

    // Getting favorite recipe IDs from localStorage
    function getFavorites() {
        return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    function setFavorites(favorites) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    // removing the saved recipes from favorites using click on the bookmark icon
    function removeFavoriteAndCard(recipeId, cardElement) {
        let favorites = getFavorites();
        favorites = favorites.filter(id => id !== recipeId);
        setFavorites(favorites);
        cardElement.remove();
        // If there are no more saved recipes, show the no-favorite-found message
        if (getFavorites().length === 0) {
            document.querySelector(".no-favorite-found").innerHTML =
                "<p style='display: flex;justify-content: center; padding-top: 50px; align-items: flex-start; font-style: italic; opacity: 0.6; cursor: default'>Hmm, it looks like you don't have any favorite recipes yet.</p>";
        }
    }

    // Getting the recipes container for favorite recipes
    const favorites = getFavorites();
    const containerRecipes = document.querySelector("#results-grid-container");
    containerRecipes.innerHTML = "";

    // Filter allRecipes for only favorite recipes using this
    const favoriteRecipes = window.allRecipes.filter(recipe => favorites.includes(recipe.id));

    // Render the saved recipes to favorites, if the page is empty, show the message
    const noFavorite = document.querySelector(".no-favorite-found");
    const noRecipe = document.querySelector(".no-recipe-found");
    if (favoriteRecipes.length === 0) {
        noFavorite.innerHTML = "<p style='display: flex;justify-content: center; padding-top: 50px; align-items: flex-start; font-style: italic; opacity: 0.6; cursor: default'>Hmm, it looks like you don't have any favorite recipes yet.</p></div>";
        noRecipe.innerHTML = "";
    } else {
        favoriteRecipes.forEach(recipe => {
            noFavorite.innerHTML = "";
            const div = document.createElement("div");
            div.className = "recipe-item";
            div.setAttribute("data-id", recipe.id);
            div.setAttribute("data-category", recipe.category);
            div.innerHTML = `<img src="${recipe.image}" alt="">
                <div class="bookmark-icon selected">
                    <i class="fa-solid fa-bookmark"></i>
                </div>
                <div class="recipe-linear-gradient"></div>
                <div class="recipe-item-text">
                    <i class="fa-regular fa-clock"></i>
                    <p>${recipe.cookingTime}</p>
                </div>
                <div class="recipe-item-heading">
                    <h3>${recipe.title}</h3>
                </div>`;
            // Adding click handler to the bookmark icon, so when you click the icon on the favorites page, the recipe would get removed from favorites
            div.querySelector(".bookmark-icon").addEventListener("click", function(event) {
                event.stopPropagation();
                removeFavoriteAndCard(recipe.id, div);
            });
            /***** MODAL POPUP WINDOW  *****/
            // Attach modal popup event to specific recipe-item
            const modalRecipeData = window.allModalRecipes.find(r => r.idMeal === recipe.id);
            if (!modalRecipeData) {
                console.warn("No modal data for recipe id found:", recipe.id, recipe.title);
                return
            }
            // Collect all non-empty ingredients
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ing = modalRecipeData[`strIngredient${i}`];
                if (ing && ing.trim() !== "") {
                    ingredients.push(ing);
                }
            }
            div.addEventListener("click", function(event) {
                // Find the modal recipe and prevent modal to shows up, if used click the bookmark icon
                if(event.target.closest(".bookmark-icon")) return;
                const modalContent = document.getElementById("recipe-details-content");
                    // Fill modal content after click on the recipe item and allow it to show up
                    modalContent.innerHTML = `
                        <h2>${modalRecipeData.strMeal}</h2>
                        <img src="${modalRecipeData.strMealThumb}" alt="">
                        <h4>Ingredients</h4>
                        <ul>
                            ${ingredients.map(ing => `<li style= "list-style: none;">${ing}</li>`).join('')}
                        </ul>
                        <h3>Directions</h3>
                        <p>${modalRecipeData.strInstructions}</p>
                    `;

                    const modalRecipe = document.getElementById("recipe-modal");
                    modalRecipe.classList.remove("hidden");
                    document.body.classList.add("modal-open");
                    document.body.style.overflow = "hidden";

                    // Modal will close when clicking on background
                    modalRecipe.addEventListener("click", function(event){
                        if (event.target === modalRecipe) {
                            modalRecipe.classList.add("hidden");
                            document.body.classList.remove("modal-open");
                            document.body.style.overflow = "";
                        }  
                    });
                    // Button for closing modal
                    const modalCloseBtn = document.getElementById("modal-close-cross");
                    modalCloseBtn.addEventListener("click", function(){
                        modalRecipe.classList.add("hidden");
                        document.body.classList.remove("modal-open");
                        document.body.style.overflow = "";
                    });
            });
                containerRecipes.appendChild(div);  
        });
    }
    
    

    /***** CATEGORY FILTER LOGIC ON foxfavorites.html *****/
    const filterOptionBtns = document.querySelectorAll(".recipes-option-field .favoritespage-option-button");
    const filterOptionItems = document.querySelectorAll(".results-grid-container .recipe-item");
    // Define the filterItem by selecting buttons
    function filterItem(e){
        let btn = e && e.target ? e.target : this;
        document.querySelector(".selected")?.classList.remove("selected");
        btn.classList.add("selected");
        const selectedCategory = btn.dataset.category.toLowerCase();
        filterOptionItems.forEach(recipeItem => {
            const categories = recipeItem.dataset.category.toLowerCase().split(',').map(c => c.trim());
            // Check if the card matches the selected filter or if "All" is selected
            if (selectedCategory === "all" || categories.includes(selectedCategory)){
                    recipeItem.classList.remove("hide");
            } else {
            // Adding "hide" class to hide the items initially
            recipeItem.classList.add("hide");
            }
        });
    };
    filterOptionBtns.forEach(button => button.addEventListener("click", filterItem));

    // Set the "All" button as selected when the page gets load
    const allBtn = document.querySelector('.favoritespage-option-button button[data-category="all"]');
    if (allBtn) {
    allBtn.classList.add("selected");
    }

    /***** SEARCH BAR FUNCTION ON foxrecipe.html *****/
    // Recipes searching thru letters using the search bar
    function searchRecipes(){
        const searchFilter = searchInput.value.trim().toLowerCase();
        const resultItems = document.querySelectorAll(".recipe-item");
        const noFound = document.querySelector(".no-recipe-found");
        let anyVisible = false;

        resultItems.forEach(resultHeader => {
            const h3 = resultHeader.querySelector("h3");
            if (!h3){
                resultHeader.style.display = "none";
                return;
            }

            const resultTitle = h3.textContent.trim().toLowerCase();
            if(resultTitle.includes(searchFilter) || searchFilter === ""){
                resultHeader.style.display = "";
                anyVisible = true;
            } else{
                resultHeader.style.display = "none"
            }
        });
        if(!anyVisible && noFavorite.innerHTML.trim() === ""){
            noFound.innerHTML = "<p style='display: flex;justify-content: center;padding-top: 50px;align-items: flex-start;font-style: italic;opacity: 0.6; cursor: default'>No recipes found</p>";
        } else{
            noFound.innerHTML = "";
        }
    }
    // Always attach the input event listener!
    const searchInput = document.getElementById("search-bar");
    if (searchInput) {
    searchInput.addEventListener("input", searchRecipes);
    }
});