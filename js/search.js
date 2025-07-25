window.addEventListener("DOMContentLoaded", function(){
    /***** CATEGORY FILTER LOGIC ON foxrecipes.html *****/
    const filterOptionBtns = document.querySelectorAll(".recipes-option-field .recipespage-option-button");
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
        if(!anyVisible){
            noFound.innerHTML = "<p style='display: flex;justify-content: center;padding-top: 50px;align-items: flex-start;font-style: italic;opacity: 0.6; cursor: default'>No recipes found</p>";
        } else{
            noFound.innerHTML = "";
        }
    };



    /***** CATEGORY BUTTON SELECTION THROUGH index.html *****/
    // Getting a link to go from index.html to specific recipe category button
    const categoryHash = window.location.hash.replace("#", "").toLowerCase();
    // Remove "selected" from all buttons
if(categoryHash){
        // If there is a hash, select and click the corresponding button
        const categoryHash = window.location.hash.replace("#", "").toLowerCase();
    if(categoryHash){
        const targetCategoryButton = document.getElementById(categoryHash);
        if (targetCategoryButton){
            filterItem.call(targetCategoryButton); // Call filterItem with the button as "this"
            }
    } else{
        // If no hash, select and click "All"
        const allCategoryBtn = document.querySelector('.recipespage-option-button button[data-category="all"]');
        if (allCategoryBtn){
            filterItem.call(allCategoryBtn);
        }
    }
}



    /***** SEARCHING RECIPES THROUGH index.html *****/
    // Always attach the input event listener!
    const searchInput = document.getElementById("search-bar"); // Using this the search bar's event listener will be attach to the search input
    if(searchInput) {
        searchInput.addEventListener("input", searchRecipes);
    }

    // Fill search bar from URL and trigger search
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("search");
    if(searchValue && searchInput){
        searchInput.value = searchValue;
        setTimeout(() => {
            searchRecipes();
        }, 100);
    }
    // Search icon functioning as a submit button
    const searchIcon = document.getElementById("search-icon");
    if(searchIcon && searchInput){
        searchIcon.addEventListener("click", function(){
            searchRecipes();
            searchInput.focus();
        })
    }

    /***** FAVORITE RECIPE ICON SELECTION *****/ 
    // Get favorite recipes from localStorage
    function getFavorites(){
        return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    // Save favorite recipes to localStorage
    function setFavorites(favorites){
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    // Toggle favorite icon and update favorites
    function changeIcon(bookmarkIcon, event){
        event.stopPropagation(); // Prevents modal popup when clicking on bookmark icon
        const recipeItem = bookmarkIcon.closest(".recipe-item");
        const recipeId = recipeItem.getAttribute("data-id");
        let favorites = getFavorites();
        // Toggle icon to solid
        bookmarkIcon.classList.toggle("fa-solid");
        bookmarkIcon.closest(".bookmark-icon").classList.toggle("selected");
        // This will add or remove recipe item from favorites
        if(favorites.includes(recipeId)){
            favorites = favorites.filter(id => id !== recipeId);
        } else {
            favorites.push(recipeId);
        }
        setFavorites(favorites);
    }
    // Mark favorites on page load
    const favorites = getFavorites();
    document.querySelectorAll(".recipe-item").forEach(item => {
        const recipeId = item.getAttribute("data-id");
        if (favorites.includes(recipeId)){
            const bookmarkIconAwesomeFont = item.querySelector(".bookmark-icon i");
            if (bookmarkIconAwesomeFont){
                bookmarkIconAwesomeFont.classList.add("fa-solid");
                bookmarkIconAwesomeFont.closest(".bookmark-icon").classList.add("selected");
            }
        }
    });
    // Make changeIcon globally accessible for inline onclick
    window.changeIcon = changeIcon;

    /***** MODAL POPUP WINDOW  *****/
    // Attach modal popup event to specific recipe-item
    document.querySelectorAll(".recipe-item").forEach(div => {
        div.addEventListener("click", function(event) {
            // Find the modal recipe and prevent modal to shows up, if used click the bookmark icon
            if (event.target.closest(".bookmark-icon")) return;
            const recipeId = div.getAttribute("data-id");
            const modalRecipeData = window.allModalRecipes.find(r => r.idMeal === recipeId);
            if (!modalRecipeData) {
                console.warn("No modal data for recipe id found:", recipeId);
                return;
            }
            // Collect all non-empty ingredients
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ing = modalRecipeData[`modIngredient${i}`];
                if (ing && ing.trim() !== "") {
                    ingredients.push(ing);
                }
            }
            const modalContent = document.getElementById("recipe-details-content");
            // Fill modal content after click on the recipe item and allow it to show up
            modalContent.innerHTML = `
                <div id="recipe-details-content">
                    <div class="recipe-details-heading">
                        <div class="recipe-details-heading-text">
                            <h2>${modalRecipeData.modMeal}</h2>
                            <div class="recipe-details-cook-time">
                                <i class="fa-regular fa-clock"></i>
                                <p>Cook time:</p>
                                <p>${modalRecipeData.modTime}</p>
                            </div>
                        </div>

                        <div class="recipe-details-heading-img">
                            <img src="${modalRecipeData.modMealThumb}" alt="" class="modal-img-max">
                        </div>
                    </div>

                    <article class="recipe-details-list">
                    <div class="recipe-details-ingredients">
                        <h4>Ingredients</h4>
                        <ul>
                            ${ingredients.map(ing => `<li style= "list-style: none;">${ing}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="recipe-details-directions">
                        <h3>Directions</h3>
                        <p>${modalRecipeData.modInmoductions}</p>
                    </div>
                    </article>
                </div>
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
    });
});