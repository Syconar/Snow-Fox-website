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

    // Getting imported recipe IDs from localStorage
        function getImportedRecipes() {
        return JSON.parse(localStorage.getItem("importedRecipes") || "[]");
    }

    // Getting the recipes elements for favorite recipes
    const containerRecipes = document.querySelector("#results-grid-container");
    const noFavorite = document.querySelector(".no-favorite-found");
    const noRecipe = document.querySelector(".no-recipe-found");

    // Render the saved recipes to favorites, if the page is empty, show the message
    function renderFavorites() {
        containerRecipes.innerHTML = "";
        const favorites = getFavorites();
        const favoriteRecipes = window.allRecipes.filter(recipe => favorites.includes(recipe.id));
        if (favoriteRecipes.length === 0) {
            noFavorite.innerHTML = "<p style='display: flex;justify-content: center; padding-top: 50px; align-items: flex-start; font-style: italic; opacity: 0.6; cursor: default'>Hmm, it looks like you don't have any favorite recipes yet.</p>";
            noRecipe.innerHTML = "";
            return;
        } else {
            noFavorite.innerHTML = "";
            noRecipe.innerHTML = "";
        }
        favoriteRecipes.forEach(recipe => {
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
                const ing = modalRecipeData[`modIngredient${i}`];
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
                        <h2>${modalRecipeData.modMeal}</h2>
                        <p>${modalRecipeData.modTime}</p>
                        <img src="${modalRecipeData.modMealThumb}" alt="">
                        <h4>Ingredients</h4>
                        <ul>
                            ${ingredients.map(ing => `<li style= "list-style: none;">${ing}</li>`).join('')}
                        </ul>
                        <h3>Directions</h3>
                        <p>${modalRecipeData.modInmoductions}</p>
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

    /***** IMPORTED RECIPES LOGIC *****/
    // Getting imported recipe IDs from localStorage
    function getImportedRecipes() {
        return JSON.parse(localStorage.getItem("importedRecipes") || "[]");
    }
    const noImported = document.querySelector(".no-imported-found");
    // Render imported recipes
    function renderImported() {
        containerRecipes.innerHTML = "";
        const importedRecipes = getImportedRecipes();
        if (importedRecipes.length === 0) {
            noImported.innerHTML = "<p style='display: flex;justify-content: center;padding-top: 50px;align-items: flex-start;font-style: italic;opacity: 0.6; cursor: default'>You don't have any imported recipes.</p>";
            noFavorite.innerHTML = "";
            noRecipe.innerHTML ="";
            return;
        } else {
            noImported.innerHTML = "";
            noFavorite.innerHTML = "";
            noRecipe.innerHTML = "";
        }
        importedRecipes.forEach(recipe => {
            const divImported = document.createElement("div");
            divImported.className = "recipe-item";
            divImported.setAttribute("data-id", recipe.id);
            divImported.setAttribute("data-category", "imported");
            divImported.innerHTML = `<img src="${recipe.image}" alt="">
            <div class="trash-icon selected" data-recipe-id="${recipe.id}">
                    <i class="fa-solid fa-trash"></i>
                </div>
                <div class="recipe-linear-gradient"></div>
                <div class="recipe-item-text">
                    <i class="fa-regular fa-clock"></i>
                    <p>${recipe.cookingTime}</p>
                </div>
                <div class="recipe-item-heading">
                    <h3>${recipe.title}</h3>
                </div>`;

            // Trash click event for deleting the imported recipes
            divImported.querySelector(".trash-icon").addEventListener("click", function(event) {
                event.stopPropagation();
                const recipeId = this.dataset.recipeId;
                const confirmRemove = window.confirm(`Are you sure you want to remove this recipe? It will be lost forever!`);
                if (confirmRemove === true) {
                    deleteImportedRecipe(recipeId);
                }
            });
            
            // Corresponding modal for imported recipes
            divImported.addEventListener("click", function(event) {
                if(event.target.closest(".trash-icon")) return;
                const modalContent = document.getElementById("recipe-details-content");
                modalContent.innerHTML = `
                <h2>${recipe.title}</h2>
                    <div class="recipe-details-cook-time">
                        <i class="fa-regular fa-clock"></i>
                        <p>Cook time:</p>
                        <p>${recipe.cookingTime}</p>
                    </div>
                    <img src="${recipe.image}" style="width: 80%;" alt="">
                    <h4>Ingredients</h4>
                    <ul>
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                    <h3>Directions</h3>
                    <p>${recipe.directions}</p>
                    `;

                const modalRecipe = document.getElementById("recipe-modal");
                modalRecipe.classList.remove("hidden");
                document.body.classList.add("modal-open");
                document.body.style.overflow = "hidden";
                modalRecipe.addEventListener("click", function(event) {
                    if (event.target === modalRecipe) {
                        modalRecipe.classList.add("hidden");
                        document.body.classList.remove("modal-open");
                        document.body.style.overflow = "";
                    }
                });
                const modalCloseBtn = document.getElementById("modal-close-cross");
                modalCloseBtn.addEventListener("click", function(){
                    modalRecipe.classList.add("hidden");
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "";
                });
            });
            containerRecipes.appendChild(divImported);
        });
    }

    function deleteImportedRecipe(recipeId) {
        let importedRecipes = JSON.parse(localStorage.getItem("importedRecipes") || "[]");
        importedRecipes = importedRecipes.filter(r => r.id !== recipeId);
        localStorage.setItem("importedRecipes", JSON.stringify(importedRecipes));
        // Optionally re-render your recipes list here
        renderImported();
    }

    /***** CATEGORY FILTER LOGIC ON foxfavorites.html *****/
    const filterOptionBtns = document.querySelectorAll(".recipes-option-field .favoritespage-option-button");
    // Define the filterItem by selecting buttons
    filterOptionBtns.forEach(button => {
        button.addEventListener("click", function(event) {
            // Remove "selected" from all, add to clicked
            filterOptionBtns.forEach(btn => btn.querySelector('button').classList.remove("selected"));
            button.querySelector('button').classList.add("selected");
            const selectedCategory = button.querySelector('button').dataset.category.toLowerCase();

            // Let the no-imported-found messega to be visible only when "Imported" btn is selected
            const noImported = document.querySelector(".no-imported-found");
            if (noImported) noImported.innerHTML = "";

            if (selectedCategory === "imported") {
                renderImported();
            } else {
                renderFavorites();
                // Hide all non-matching categories unless "all" is selected
                const recipeItems = containerRecipes.querySelectorAll(".recipe-item");
                recipeItems.forEach(item => {
                    const categories = item.getAttribute("data-category").toLowerCase().split(',').map(c => c.trim());
                    if (selectedCategory === "all" || categories.includes(selectedCategory)) {
                        item.classList.remove("hide");
                    } else { // Hide all non-matching categories
                        item.classList.add("hide");
                    }
                });
            }
        });
    });

    // Set the "All" button as selected when the page gets load
    const allBtn = document.querySelector('.favoritespage-option-button button[data-category="all"]');
    if (allBtn) {
    allBtn.classList.add("selected");
    }
    renderFavorites();

    /***** SEARCH BAR FUNCTION ON foxrecipe.html *****/
    // Recipes searching thru letters using the search bar
    function searchRecipes(){
        const searchInput = document.getElementById("search-bar");
        if (!searchInput) return;
        const searchFilter = searchInput.value.trim().toLowerCase();
        const resultItems = document.querySelectorAll(".recipe-item");
        const noRecipe = document.querySelector(".no-recipe-found");
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
        if(!anyVisible && noFavorite.innerHTML.trim() === "" && noImported.innerHTML.trim() === "") {
            noRecipe.innerHTML = "<p style='display: flex;justify-content: center;padding-top: 50px;align-items: flex-start;font-style: italic;opacity: 0.6; cursor: default'>No recipes found</p>";
        } else{
            noRecipe.innerHTML = "";
        }
    }
    // Always attach the input event listener!
    const searchInput = document.getElementById("search-bar");
    if (searchInput) {
    searchInput.addEventListener("input", searchRecipes);
    }
});