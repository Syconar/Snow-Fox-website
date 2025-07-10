/***** UPLOAD IMAGE AREA *****/
const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imgView = document.getElementById("img-view");

// Click to open the files
inputFile.addEventListener("change", uploadImage);

// With this, the input image will change and present content will disapear
function uploadImage(){
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imgView.style.backgroundImage = `url(${imgLink})`;
    imgView.textContent = "";
    imgView.style.border = 0;
}

// Drag and drop events
dropArea.addEventListener("dragover", function(event){
    event.preventDefault();
});
dropArea.addEventListener("drop", function(event){
    event.preventDefault();
    inputFile.files = event.dataTransfer.files;
    uploadImage();
});

// Adding new ingredient inputs if needed
const ingContainer = document.getElementById("ingredients-container");
function addIngredientInputIfNeeded() {
    const ingInputs = ingContainer.querySelectorAll(".ingredient-input");
    // Only add a new input if all current ones have a value
    const allInputsFilled = Array.from(ingInputs).every(input => input.value.trim() !== "");
    if (allInputsFilled && ingInputs.length < 40) {// Setting the largest number of inputs
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.className = "ingredient-input";
        newInput.placeholder = "ingredient, grams, tbsp, etc.";
        newInput.addEventListener("input", addIngredientInputIfNeeded);
        ingContainer.appendChild(newInput);
    }
}
    // Attach the new input event to all initial inputs
    ingContainer.querySelectorAll(".ingredient-input").forEach(input => {
        input.addEventListener("input", addIngredientInputIfNeeded);
    });


/***** IMPORTING THE RECIPE *****/
document.querySelector(".upload-window").addEventListener("submit", function(event){
    // Getting form info values
    const title = this.querySelector('input[name="title"]').value;
    const time = this.querySelector('input[name="time"]').value;
    const ingredients = Array.from(this.querySelectorAll(".ingredient-input")).map(i => i.value).filter(Boolean);
    const directions = this.querySelector('textarea').value;
    // Handle image as abse64
    const baseFileInput = document.getElementById('input-file');
    let image = "img/noimgfound.jpg";
    if (baseFileInput.files && baseFileInput.files[0]){
        const baseReader = new FileReader();
        baseReader.onload = function(event){
            image = event.target.result;
            saveRecipe();
        };
        baseReader.readAsDataURL(baseFileInput.files[0]);
    } else {
        saveRecipe();
    }
    // Importing data to foxfavorites.html > "Imported"
    function saveRecipe() {
        const importedRecipes = JSON.parse(localStorage.getItem('importedRecipes') || '[]');
        importedRecipes.push({
            id: 'imported-' + Date.now(),
            title,
            cookingTime: time,
            ingredients,
            directions,
            image,
            category: 'imported'
        });
        localStorage.setItem('importedRecipes', JSON.stringify(importedRecipes));
        alert("Recipe imported! Great job! You can find it in Favorites > Imported.");
        // Closing the alert will send user to foxfavorites.html (It's optional, and I wanted to be ignored by JavaScript for now)
        window.location.href = "foxfavorites.html";
    }
});