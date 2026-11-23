
document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // MAIN SLIDER
    // =================================

    const slideList = document.querySelector("#slideList");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let visibleSlides = window.innerWidth <= 768 ? 1 : 3;
    const slideInterval = 5000;

    let currentSlide = 0;
    let autoSlide;

    function getTotalGroups() {
        return Math.ceil(
            slideList.children.length / visibleSlides
        );
    }

    function moveSlide() {

        const items = slideList.querySelectorAll(".slide-item");

        if (items.length === 0) return;

        const itemWidth = items[0].getBoundingClientRect().width;

        const gap = parseFloat(
            getComputedStyle(slideList).gap
        ) || 0;

        const distance = (itemWidth + gap) * visibleSlides;

        slideList.style.transform =
            `translateX(-${currentSlide * distance}px)`;
    }

    function nextSlide() {

        const total = getTotalGroups();

        if (total <= 1) return;

        currentSlide = (currentSlide + 1) % total;

        moveSlide();
    }

    function prevSlide() {

        const total = getTotalGroups();

        if (total <= 1) return;

        currentSlide = (currentSlide - 1 + total) % total;

        moveSlide();
    }

    function resetAutoSlide() {

        clearInterval(autoSlide);

        autoSlide = setInterval(nextSlide, slideInterval);
    }

    if (slideList && prevButton && nextButton) {

        nextButton.addEventListener("click", function () {
            nextSlide();
            resetAutoSlide();
        });

        prevButton.addEventListener("click", function () {
            prevSlide();
            resetAutoSlide();
        });

        // 화면 크기 변경 대응
        window.addEventListener("resize", () => {
            visibleSlides = window.innerWidth <= 768 ? 1 : 3;

            currentSlide = Math.min(
                currentSlide,
                getTotalGroups() - 1
            );

    moveSlide();
});

        moveSlide();
        resetAutoSlide();
    }


    // =================================
    // MAIN MODAL
    // =================================

    const slideItems = document.querySelectorAll(".slide-item");

    const mainModal = document.querySelector(".main-modal");

    if (!mainModal || slideItems.length === 0) return;

    const modalContent = mainModal.querySelector(".modal-content");
    const modalClose = mainModal.querySelector(".modal-close");
    const modalPrev = mainModal.querySelector(".modal-prev");
    const modalNext = mainModal.querySelector(".modal-next");

    let modalIndex = 0;

    // 모달 열기
    function openModal(index) {

        modalIndex = index;

        showModalVideo();

        mainModal.style.display = "block";

        document.body.style.overflow = "hidden";
    }

    // 모달 영상 출력
    function showModalVideo() {

        modalContent.innerHTML = "";

        const originalVideo = slideItems[modalIndex].querySelector("video");

        if (!originalVideo) return;

        const video = document.createElement("video");

        video.src =
            originalVideo.currentSrc ||
            originalVideo.getAttribute("src");

        video.controls = true;
        video.preload = "auto";
        video.playsInline = true;
        video.autoplay = true;
        video.muted = false;

        modalContent.appendChild(video);

        video.play().catch(() => {
            console.log("재생 버튼을 눌러 영상을 재생해 주세요.");
        });
    }

    // 이전 영상
    function previousModalVideo() {

        modalIndex--;

        if (modalIndex < 0) {
            modalIndex = slideItems.length - 1;
        }

        showModalVideo();
    }

    // 다음 영상
    function nextModalVideo() {

        modalIndex++;

        if (modalIndex >= slideItems.length) {
            modalIndex = 0;
        }

        showModalVideo();
    }

    // 모달 닫기
    function closeModal() {

        mainModal.style.display = "none";

        modalContent.innerHTML = "";

        document.body.style.overflow = "";
    }


    // =================================
    // MODAL EVENTS
    // =================================

    slideItems.forEach((item, index) => {

        item.addEventListener("click", function () {
            openModal(index);
        });

    });

    modalClose.addEventListener("click", closeModal);

    modalPrev.addEventListener("click", previousModalVideo);

    modalNext.addEventListener("click", nextModalVideo);

    // 모달 배경 클릭
    mainModal.addEventListener("click", function (event) {

        if (event.target === mainModal) {
            closeModal();
        }

    });

    // 키보드 조작
    document.addEventListener("keydown", function (event) {

        if (mainModal.style.display !== "block") return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowLeft") {
            previousModalVideo();
        }

        if (event.key === "ArrowRight") {
            nextModalVideo();
        }

    });


    console.log("PANO Main Slider & Modal 정상 실행");

});
