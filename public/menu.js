document.getElementById('play-game-btn').addEventListener('click', function() {
    window.location.href = "/game"; 
});

document.getElementById('difficulty-btn').addEventListener('click', function() {
    window.location.href = "/difficulty"; 
});

document.getElementById('info-btn').addEventListener('click',function(){
    window.location.href = "/info"; 
})

const backgroundImage = new Image();
backgroundImage.src = 'Assets/menu.png';

backgroundImage.onload = () => {
    document.body.style.backgroundImage = `url(${backgroundImage.src})`;
    document.getElementById('content').classList.remove('hidden');
};
