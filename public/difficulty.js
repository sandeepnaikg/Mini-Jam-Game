
let selectedDifficulty = "";

document.getElementById('easy-btn').addEventListener('click', function() {
    selectedDifficulty = "easy";
    highlightSelectedButton();
});

document.getElementById('medium-btn').addEventListener('click', function() {
    selectedDifficulty = "medium";
    highlightSelectedButton();
});

document.getElementById('hard-btn').addEventListener('click', function() {
    selectedDifficulty = "hard";
    highlightSelectedButton();
});

document.getElementById('confirm-btn').addEventListener('click', function() {
    if (selectedDifficulty === "") {
        alert("Please select a difficulty.");
        return;
    }
    
    if (selectedDifficulty === "easy") {
        window.location.href = "/game-easy";  
    } else if (selectedDifficulty === "medium") {
        window.location.href = "/game-medium"; 
    } else if (selectedDifficulty === "hard") {
        window.location.href = "/game-hard"; 
    }
});

function highlightSelectedButton() {
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(button => {
        if (button.id === `${selectedDifficulty}-btn`) {
            button.style.backgroundColor = '#4a90e2'; 
        } else {
            button.style.backgroundColor = '#6ec1e4';  
        }
    });
}
