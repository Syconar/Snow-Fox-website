// Header transition with scrolling - Home page
const headerBack = document.querySelector("#navbar");
const headerTextSelect = document.querySelector("a.nav-active");
const headerTitle = document.querySelector(".main-title a");

window.onscroll = function(){
    let top = window.scrollY;
    let triggerChange = window.innerHeight;
    if(top >= triggerChange){
        headerBack.classList.add("secondback");
        headerTextSelect.classList.add("scrolled");
        headerTitle.classList.add("secondTitle");
        document.body.classList.add("scrolled");
    } else{
        headerBack.classList.remove("secondback");
        headerTextSelect.classList.remove("scrolled");
        headerTitle.classList.remove("secondTitle");
        document.body.classList.remove("scrolled");
    }
};
//



// Search bar redirect to foxrecipes.html and automatically search/filter recipes there
document.getElementById("main-search-form").addEventListener("submit", function(event){
    event.preventDefault(); // This will stop normal form submission
    const searchValue = document.getElementById("index-search-bar").value.trim(); // Using this will redirect the user to foxrecipes.html with the search term as a query parameter

    // Search icon will function only is the search bar is not empty
    if(!searchValue){
        // If search input is empty, do nothing
        event.preventDefault();
        return;
    } else{
        // If search input isn't empty, redirect to foxrecipes.html
        event.preventDefault();
        window.location.href = `foxrecipes.html?search=${encodeURIComponent(searchValue)}`;
    }
    
});
// 



// Registration form closing with a cross
let popupBox = document.getElementById("popup-box");
let buttonClosed = document.getElementById("button-option");

function closePopup(){
    document.querySelector('.popup').classList.remove('popup-active');
    popupBox.classList.remove("open-popup");
    buttonClosed.classList.add("option-field-closed");
};
// 



// Registration form poping up Sign up or Log in
let confirmField = document.getElementById("confirm-field");
let popupTitle = document.getElementById("popup-title");
let signupBtn = document.getElementById("new-account-button");
let loginBtn = document.getElementById("log-in-button");
let forgotBtn = document.getElementById("forgot-password-button");
let submitBtn = document.getElementById("submit-button");

function openSignupPopup(){
    popupBox.classList.add("open-popup");
    confirmField.style.maxHeight = "65px";
    confirmField.style.display = "flex";
    popupTitle.textContent = "Sign in";
    loginBtn.classList.remove("disabled");
    signupBtn.classList.add("disabled");
    buttonClosed.classList.add("option-field-closed");
    submitBtn.textContent = "Create account";
    document.querySelector(".popup").classList.add("popup-active");
    popupBox.classList.add("open-popup");
    buttonClosed.classList.remove("option-field-closed");
    confirmPassword.required = true;
};

function openLoginPopup() {
    popupBox.classList.add("open-popup");
    confirmField.style.display = "none";
    popupTitle.textContent = "Log in";
    loginBtn.classList.add("disabled");
    signupBtn.classList.remove("disabled");
    buttonClosed.classList.remove("option-field-closed");
    submitBtn.textContent = "Log in";
    document.querySelector(".popup").classList.add("popup-active");
    confirmPassword.required = false;
};
// 



// Pop-up registration form changing sing-up/log-in
signupBtn.onclick = function(){
    confirmField.style.maxHeight = "65px";
    confirmField.style.display = "flex";
    popupTitle.textContent = "Sign up";
    signupBtn.classList.add("disabled");
    loginBtn.classList.remove("disabled");
    submitBtn.textContent = "Create account";
    confirmPassword.required = true;
};

loginBtn.onclick = function(){
    confirmField.style.display = "none";
    popupTitle.textContent = "Log in";
    loginBtn.classList.add("disabled");
    signupBtn.classList.remove("disabled");
    submitBtn.textContent = "Log in";
    confirmPassword.required = false;
};
// 



// Pop-up registration form password and confirm password
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

function validatePassword(){
    if (!confirmPassword.required){
        confirmPassword.setCustomValidity("");
        return;
    };
    if (password.value != confirmPassword.value){
        confirmPassword.setCustomValidity("Passwords Don't Match");
    } else{
        confirmPassword.setCustomValidity("");
    }
};

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;
// 


// Alert popup, whitch will shows up after succesfull creating or loging in at the registration form
$(".popup-box form").on("submit", function(e){
    // if valid = submit will closed, if not = prevent submit from closing
    if (!this.checkValidity()){
        return;
    };
    e.preventDefault();
    $(".popup").removeClass("popup-active")
    // Alert will shows up, if the submit is filled correctly
    $(".alert").removeClass("hidden");
    $(".alert").addClass("show");

    setTimeout(function(){
        $(".alert").removeClass("show");
        $(".alert").addClass("hidden");
    }, 5000); // Alert popup will automatically hide after 5 seconds


    $(".alert-cross").click(function(){ // Closing the alert window with cross button
        $(".alert").removeClass("show");
        $(".alert").addClass("hidden");
    })
});



// Gallery scrolling and clicking
const scrollContainer = document.querySelector(".category-samples");

document.querySelectorAll(".fa-caret-right").forEach(rightBtn => {
    rightBtn.addEventListener("click", () => {
        const gallery = rightBtn.closest(".gallery-container").querySelector(".category-samples");
        gallery.scrollLeft += 338;
    })
});

document.querySelectorAll(".fa-caret-left").forEach(LeftBtn => {
    LeftBtn.addEventListener("click", () => {
        const gallery = LeftBtn.closest(".gallery-container").querySelector(".category-samples");
        gallery.scrollLeft -= 338;
    })
});
//
