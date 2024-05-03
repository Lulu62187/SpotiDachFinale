const playlist = document.getElementById("playlist");
const lecteur = document.getElementById("lecteur"); // Correction du sélecteur pour l'élément audio
const cover = document.getElementById("cover");
const disque = document.getElementById("disque");
const btnRandom = document.getElementById("btnRandom");
let dbMusic;

const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/",
};

const getData = async () => {
    const req = await fetch("https://api-jp23.onrender.com/api/v1/musics");
    dbMusic = await req.json();
    data = dbMusic.result;
    data.forEach((music) => {
        playlist.innerHTML += `<li id="${music.id}"><h2>${music.title}</h2><div><small>${music.category}</small></div></li>`;
    });

    const allLi = document.querySelectorAll("li");

    allLi.forEach((li) => {
        li.addEventListener("click", function (elem) {
            const id = parseInt(li.id);
            const searchById = data.find((element) => element.id === id);
            lecteur.src = `${config.urlSound}${searchById.sound}`;
            lecteur.play();
            cover.src = `${config.urlCover}${searchById.cover}`;
            if (disque.classList.contains("pause")) {
                disque.classList.remove("pause");
            }

            allLi.forEach((item) => {
                item.classList.remove("clignote");
            });

            li.classList.add("clignote");
        });

    });
    btnRandom.addEventListener("click", function () {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomMusic = data[randomIndex];
        lecteur.src = `${config.urlSound}${randomMusic.sound}`;
        lecteur.play();
        cover.src = `${config.urlCover}${randomMusic.cover}`;
        if (disque.classList.contains("pause")) {
            disque.classList.remove("pause");
        }
        lecteur.currentTime = 0; // Remet la lecture au début de la piste actuelle
    
        // Supprime la classe clignote de tous les éléments de la playlist
        removeAllClignoteClass();
    
        // Sélectionne l'élément de la playlist correspondant à la musique aléatoire et ajoute la classe clignote
        const randomLi = document.getElementById(randomMusic.id);
        randomLi.classList.add("clignote");
    });
};

getData();



// Correction de la fonction pour faire tourner le disque lorsque la musique est en lecture
lecteur.addEventListener("play", function () {
    disque.classList.remove("pause");
    disque.classList.add("play"); // Ajout de la classe play pour faire tourner le disque
});


// Modification de l'événement pause pour supprimer la classe play du disque
lecteur.addEventListener("pause", function () {
    disque.classList.add("pause");
    disque.classList.remove("play");
});

document.addEventListener("wheel", function(event) {
    const delta = Math.sign(event.deltaY);
    const playlist = document.getElementById("playlist");
    playlist.scrollBy(0, delta * 50);
});

const rockCheckbox = document.getElementById("rockCheckbox");
const popCheckbox = document.getElementById("popCheckbox");
const allLi = document.querySelectorAll("li");

const filterSongsByCategory = () => {
    const selectedCategories = [];

    if (rockCheckbox.checked) {
        selectedCategories.push("rock");
    }
    if (popCheckbox.checked) {
        selectedCategories.push("pop");
    }

    allLi.forEach((li) => {
        const musicCategory = li.querySelector("small").textContent.toLowerCase();
        if (selectedCategories.length === 0 || selectedCategories.includes(musicCategory)) {
            li.style.display = "block";
        } else {
            li.style.display = "none";
        }
    });
};


// Ajout du gestionnaire d'événements pour le formulaire de recherche
const formRecherche = document.getElementById("formRecherche");
formRecherche.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    const rechercheInput = document.getElementById("rechercheInput").value.toLowerCase();
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
        const musicTitle = li.querySelector("h2").textContent.toLowerCase();
        const musicCategory = li.querySelector("small").textContent.toLowerCase();
        if (musicTitle.includes(rechercheInput) || musicCategory.includes(rechercheInput)) {
            li.style.display = "block"; // Afficher l'élément s'il correspond à la recherche
        } else {
            li.style.display = "none"; // Masquer l'élément s'il ne correspond pas à la recherche
        }
    });
});
// Fonction pour supprimer la classe clignote de tous les éléments de la playlist
function removeAllClignoteClass() {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
        li.classList.remove("clignote");
    });
}


