document.addEventListener("DOMContentLoaded", () => {
    
    const body = document.body;
    const bgImageUrl = "Assets/menu.png"; 

    const img = new Image();
    img.src = bgImageUrl;
    img.onload = () => {
        body.style.backgroundImage = `url(${bgImageUrl})`;
        console.log("Background image loaded.");
    };

    const backButton = document.getElementById("back-btn");
    backButton.addEventListener("click", () => {
        window.location.href = "/"; 
    });
});
