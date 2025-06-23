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
    inputFile.files = e.dataTransfer.files;
    uploadImage();
});

/***** IMPORTING THE RECIPE *****/
document.querySelector(".upload-window").addEventListener("submit", function(event){
    // Getting form info values
    const title = this.querySelector('input[name="title"]').value;
    const time = this.querySelector('input[name="time"]').value;
    const ingredinets = Array.from(this.querySelectorAll('input[placeholder="ingredient"]')).map(i => i.value).filter(Boolean);
    const directions = this.querySelector('textarea').value;
    // Handle image as abse64
    const baseFileInput = document.getElementById('input-file');
    let image = "../img/noimgfound.jpg";
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
            ingredinets,
            directions,
            image,
            category: 'imported'
        });
        localStorage.setItem('importedRecipes', JSON.stringify(importedRecipes));
        alert("Recipe imported! Great job! You can find it in Favorites > Imported.");
        // Closing the alert will send user to foxfavorites.html (It's optional, but I wanted to be ignored by JavaScript for now)
        window.location.href = "foxfavorites.html";
    }
});