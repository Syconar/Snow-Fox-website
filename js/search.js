window.addEventListener("DOMContentLoaded", function(){
    /***** CATEGORY FILTER LOGIC ON foxrecipes.html */
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
    const searchInput = document.getElementById("search-bar");
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
    }



/***** UNFINISHED *****/
/*****            *****/
    /***** FAVORITE RECIPE ICON SELECTION *****/ 
    // // Replacing "favorite" recipe icon from unselected to selected and back
    // let changeIcon = function(bookmarkIcon, event){
    //     event.stopPropagation(); // Prevents the click from bubbling up to the recipeItem
    //     bookmarkIcon.classList.toggle("fa-solid");
    //     bookmarkIcon.closest(".bookmark-icon").classList.toggle("selected");// Prevents showing up popup modal
    // };
    // const recipeItem = bookmarkIcon.closest('.recipe-item');
    // const recipeId = recipeItem.getAttribute('data-id');
    //     if (favorites.includes(recipeId)) {
    //         favorites = favorites.filter(id => id !== recipeId);
    //     } else {
    //         favorites.push(recipeId);
    //     };
// 
/***** UNFINISHED *****/
/*****            *****/



    /***** MODAL POPUP WINDOW  *****/
    // Picking up right recipe details using API
    const modalRecipe = document.getElementById("recipe-modal");
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
        // console.log("Loaded meals:", mealsData)
    });

    // Modal will close when clicking on background
    modalRecipe.addEventListener("click", function(event){
        if (event.target === modalRecipe) {
            modalRecipe.classList.add("hidden");
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
        }
    });

    // Modal will popup on clicking the recipe
    document.querySelectorAll('.recipe-item').forEach(item => {
        item.addEventListener("click", function(event) {
            // Prevent modal if clicking the bookmark icon
            if(event.target.closest('.bookmark-icon')) return;
            const recipeId = item.getAttribute("data-id");
            const meal = mealsData.find(m => m.idMeal === recipeId);
            if (meal){
                let ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    const ing = meal[`strIngredient${i}`];
                    if (ing && ing.trim() !== ""){
                        ingredients.push(ing);
                    }
                }
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
    modalCloseBtn.addEventListener("click", function(){
        modalRecipe.classList.add("hidden");
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
    });
});