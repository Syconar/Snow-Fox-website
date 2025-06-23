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

