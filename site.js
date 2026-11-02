
const artworkItems = document.querySelectorAll(".artwork-item");

const viewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");
const viewerCounter = document.getElementById("viewerCounter");

const closeButton = document.querySelector(".viewer-close");
const prevButton = document.querySelector(".viewer-prev");
const nextButton = document.querySelector(".viewer-next");

const artworks = Array.from(artworkItems).map(item => {
    const img = item.querySelector("img");

    return {
        src: img.src,
        alt: img.alt
    };
});

let currentIndex = 0;

function showArtwork(index) {
    currentIndex = (index + artworks.length) % artworks.length;

    viewerImage.src = artworks[currentIndex].src;
    viewerImage.alt = artworks[currentIndex].alt;

    viewerCounter.textContent =
        `${currentIndex + 1} / ${artworks.length}`;
}

artworkItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        showArtwork(index);
        viewer.showModal();
    });
});

prevButton.addEventListener("click", () => {
    showArtwork(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
    showArtwork(currentIndex + 1);
});

closeButton.addEventListener("click", () => {
    viewer.close();
});

viewer.addEventListener("click", event => {
    if (event.target === viewer) {
        viewer.close();
    }
});

document.addEventListener("keydown", event => {
    if (!viewer.open) return;

    if (event.key === "ArrowLeft") {
        showArtwork(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showArtwork(currentIndex + 1);
    }
});
