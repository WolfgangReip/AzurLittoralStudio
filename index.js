function openFullscreen(elem) {
    document.body.classList.add('fullscreen-active'); // Ajoute cette classe au corps pour assombrir
    elem.classList.add('fullscreen');
    elem.querySelector('.card-video').play(); // Démarrer la lecture de la vidéo
}

function closeFullscreen(event) {
    event.stopPropagation(); // Empêcher la propagation du clic
    document.body.classList.remove('fullscreen-active'); // Enlever la classe du corps pour retirer l'assombrissement
    var fullscreenElem = document.querySelector('.fullscreen');
    if (fullscreenElem) {
        fullscreenElem.classList.remove('fullscreen');
        fullscreenElem.querySelector('.card-video').pause(); // Mettre la vidéo en pause
    }
}
