// DOM SELECTORS//
const fileInput = document.getElementById ("upload");
const chooseImgBtn = document.querySelector(".upload-btn");
const image = document.querySelector(".img-panel img");
const imgDiv = document.querySelector(".img-panel");
const filterOptions = document.querySelectorAll(".filter-options button");
const filterName = document.querySelector(".filter-value .filter-name");
const filterPrc = document.querySelector(".filter-value .filter-prc");
const sliderValue = document.querySelector(".slider input");
const resetButton = document.getElementById("resetbtn");
const rotateButtons = document.querySelectorAll(".rotate-options button");
const saveButton = document.querySelector(".right-btns .save-btn");
//Filters Default Values//
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0, blurr = 0, contrast = 100;
let rotateAngle = 0;
let flipHorizontal = 1, flipVertical = 1;
//Filters Default Values//
//System Functions //
let loadImage = function () {
    let imageData=fileInput.files[0];
    if(imageData == undefined) return; 
    image.src = URL.createObjectURL(imageData);
    image.addEventListener("load",RemoveDisableClass);
}
let RemoveDisableClass = function () { 
    document.querySelector(".container").classList.remove("disabled");
}
let addFilters = function () { 
    image.style.filter = `
    brightness(${brightness}%)
    saturate(${saturation}%)
    invert(${inversion}%)
    grayscale(${grayscale}%)
    blur(${blurr}px)
    contrast(${contrast}%)
    `;
}
let resizeImageToHalf = function () {
    image.classList.replace("w-100","w-60");
}
let resizeImageToFull = function () {
    image.classList.replace("w-60","w-100");
}
let applyRotateAndFlip = function () { 
    image.style.transform = `rotate(${rotateAngle}deg) scale(${flipHorizontal},${flipVertical})`;
    if(image.height>imgDiv.clientWidth) {
        console.log("OverFlow, found!");
        resizeImageToHalf();
    }
    else {
        resizeImageToFull();
    }
}

let editFilterPanel = function (button) {
    button.addEventListener("click",function () {
        document.querySelector(".filter-options .active").classList.remove("active");
        button.classList.add("active");
        filterName.innerText = button.innerHTML;
        if (button.id === "brightness" && button.classList.contains("active")) {
            sliderValue.max = 200;
            sliderValue.value = brightness;
            filterPrc.innerText = `${brightness}%`;
        }
        else if(button.id === "saturation" && button.classList.contains("active")) {
            sliderValue.max = 200;
            sliderValue.value = saturation;
            filterPrc.innerText = `${saturation}%`;
        }
        else if (button.id === "inversion" && button.classList.contains("active")) {
            sliderValue.max = 100;
            sliderValue.value = inversion;
            filterPrc.innerText = `${inversion}%`;
        }
        else if (button.id === "grayscale" && button.classList.contains("active")) {
            sliderValue.max = 100;
            sliderValue.value = grayscale;
            filterPrc.innerText = `${grayscale}%`;
        }
        else if (button.id === "blur" && button.classList.contains("active")) {
            sliderValue.max = 10;
            sliderValue.value = blurr;
            filterPrc.innerText = `${blurr}px`;
        }
        else if (button.id === "contrast" && button.classList.contains("active")) {
            sliderValue.max = 200;
            sliderValue.value = contrast;
            filterPrc.innerText = `${contrast}%`;
        }
    })
}
let changeSliderValue = function () {
    filterPrc.innerText = `${sliderValue.value}%`;
    const currentFilter = document.querySelector(".filter-options .active");
    if(currentFilter.id === "brightness" && currentFilter.classList.contains("active")) {
        brightness = sliderValue.value;
    }
    else if (currentFilter.id === "saturation" && currentFilter.classList.contains("active")) {
        saturation = sliderValue.value;
    }
    else if (currentFilter.id === "inversion" && currentFilter.classList.contains("active")) {
        inversion = sliderValue.value;
    }
    else if (currentFilter.id === "grayscale" && currentFilter.classList.contains("active")) {
        grayscale = sliderValue.value;
    }
    else if (currentFilter.id === "blur" && currentFilter.classList.contains("active")) {
        blurr = sliderValue.value;
        filterPrc.innerText = `${blurr}px`;
    }
    else if (currentFilter.id === "contrast" && currentFilter.classList.contains("active")) {
        contrast = sliderValue.value;
    }
    addFilters();
}
let rotateOptions = function(button) {
    button.addEventListener("click",function () {
        if(button.id === "rotateLeft") {
            rotateAngle -= 90;
        }
        else if(button.id === "rotateRight") {
            rotateAngle += 90;
        }
        else if(button.id === "flipHorizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else if (button.id === "flipVertical") {
            flipVertical = flipVertical === 1? -1 :1;
        }
        applyRotateAndFlip();
    })
}
let ResetAllFilters = function () {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0, blurr = 0, contrast = 100;
    rotateAngle = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    addFilters();
    applyRotateAndFlip();
    filterOptions[0].click();
    console.log(filterOptions[0]);
}
let saveImage = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = `    
        brightness(${brightness}%)
        saturate(${saturation}%)
        invert(${inversion}%)
        grayscale(${grayscale}%)
        blur(${blurr}px)
        contrast(${contrast}%)
    `;
    ctx.translate(canvas.width/2,canvas.height/2);
    if(rotateAngle!=0) {
        ctx.rotate(rotateAngle * Math.PI / 180);
    }
    ctx.scale(flipHorizontal,flipVertical);
    ctx.drawImage(image,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);//Draw the final image to be downloaded for the user.
    document.body.appendChild(canvas);
    const createLink = document.createElement("a");
    let imageData=fileInput.files[0];
    createLink.download = "Edited -" + imageData.name;
    createLink.href = canvas.toDataURL();
    createLink.click();
}

//System Event Listeners//
chooseImgBtn.addEventListener("click",function () {
    fileInput.click();
});
fileInput.addEventListener("change",loadImage);
filterOptions.forEach(editFilterPanel);
sliderValue.addEventListener("input",changeSliderValue);
rotateButtons.forEach(rotateOptions);
resetButton.addEventListener("click",ResetAllFilters);
saveButton.addEventListener("click",saveImage);